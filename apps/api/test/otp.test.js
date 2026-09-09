import test from 'node:test';
import assert from 'node:assert';
import { generateSecureOtp, generateEmailOtp, verifyEmailOtp } from '../src/services/otp.service.js';
import { EmailOtp } from '../src/models/EmailOtp.js';
import { sha256 } from '../src/utils/crypto.js';

// Simple in-memory mock store for EmailOtp operations to bypass real MongoDB calls in tests
const mockStore = [];

EmailOtp.findOne = function (query) {
  const now = new Date();
  const match = mockStore.find(item => {
    if (item.email !== query.email) return false;
    if (item.purpose !== query.purpose) return false;
    if (query.expiresAt && query.expiresAt.$gt && item.expiresAt <= now) return false;
    if (query.createdAt && query.createdAt.$gt) {
      const minCreatedAt = query.createdAt.$gt;
      if (item.createdAt <= minCreatedAt) return false;
    }
    return true;
  });
  const result = match ? {
    ...match,
    save: async function() {
      const idx = mockStore.findIndex(i => i._id === match._id);
      if (idx !== -1) mockStore[idx] = this;
      return this;
    }
  } : null;

  return {
    sort: function() {
      return this;
    },
    then: function(resolve) {
      return Promise.resolve(result).then(resolve);
    }
  };
};

EmailOtp.create = async function (data) {
  const record = {
    _id: Math.random().toString(),
    attempts: 0,
    createdAt: new Date(),
    ...data
  };
  mockStore.push(record);
  return record;
};

EmailOtp.deleteMany = async function (query) {
  const initialLen = mockStore.length;
  for (let i = mockStore.length - 1; i >= 0; i--) {
    if (mockStore[i].email === query.email && mockStore[i].purpose === query.purpose) {
      mockStore.splice(i, 1);
    }
  }
  return { deletedCount: initialLen - mockStore.length };
};

EmailOtp.deleteOne = async function (query) {
  const idx = mockStore.findIndex(i => i._id === query._id);
  if (idx !== -1) {
    mockStore.splice(idx, 1);
    return { deletedCount: 1 };
  }
  return { deletedCount: 0 };
};

test('OTP System Tests', async (t) => {
  // Clear mock store before each test run
  mockStore.length = 0;

  await t.test('generateSecureOtp should generate a secure 6-digit numeric string', () => {
    const otp = generateSecureOtp(6);
    assert.strictEqual(otp.length, 6);
    assert.match(otp, /^[0-9]+$/);
  });

  await t.test('generateEmailOtp should generate and store secure hashed OTP', async () => {
    const email = 'user@example.com';
    const purpose = 'registration';
    
    const { emailOtp, otp } = await generateEmailOtp({ email, purpose });
    
    assert.strictEqual(otp.length, 6);
    assert.strictEqual(emailOtp.email, email);
    assert.strictEqual(emailOtp.purpose, purpose);
    assert.strictEqual(emailOtp.otpHash, sha256(otp));
    assert.strictEqual(emailOtp.attempts, 0);
  });

  await t.test('generateEmailOtp should enforce 60s cooldown limit', async () => {
    const email = 'cooldown@example.com';
    const purpose = 'registration';

    // First request should succeed
    await generateEmailOtp({ email, purpose });

    // Second request immediate should trigger cooldown exception
    await assert.rejects(
      async () => {
        await generateEmailOtp({ email, purpose });
      },
      (err) => {
        assert.strictEqual(err.message, 'Please wait 60 seconds before requesting a new code.');
        assert.strictEqual(err.code, 'COOLDOWN');
        return true;
      }
    );
  });

  await t.test('verifyEmailOtp should succeed for correct code and invalidate OTP challenge', async () => {
    const email = 'verify@example.com';
    const purpose = 'registration';

    // Reset cooldown by bypassing mock store manually
    mockStore.length = 0;

    const { otp } = await generateEmailOtp({ email, purpose });
    const result = await verifyEmailOtp({ email, purpose, otp });

    assert.strictEqual(result.valid, true);
    
    // verify it is invalidated
    const match = mockStore.find(i => i.email === email);
    assert.strictEqual(match, undefined);
  });

  await t.test('verifyEmailOtp should fail for incorrect code and increment attempts', async () => {
    const email = 'incorrect@example.com';
    const purpose = 'registration';

    mockStore.length = 0;

    const { emailOtp } = await generateEmailOtp({ email, purpose });
    const result = await verifyEmailOtp({ email, purpose, otp: '000000' });

    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.reason, 'incorrect_otp');
    
    const updatedRecord = mockStore.find(i => i.email === email);
    assert.strictEqual(updatedRecord.attempts, 1);
  });

  await t.test('verifyEmailOtp should block after 5 failed verification attempts', async () => {
    const email = 'bruteforce@example.com';
    const purpose = 'registration';

    mockStore.length = 0;

    const { emailOtp } = await generateEmailOtp({ email, purpose });
    
    // Mock 5 failed attempts
    const record = mockStore.find(i => i.email === email);
    record.attempts = 5;

    const result = await verifyEmailOtp({ email, purpose, otp: '123456' });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.reason, 'max_attempts_exceeded');
  });

  await t.test('verifyEmailOtp should reject expired OTP requests', async () => {
    const email = 'expired@example.com';
    const purpose = 'registration';

    mockStore.length = 0;

    const { emailOtp } = await generateEmailOtp({ email, purpose });
    
    // Mock expiration (past date)
    const record = mockStore.find(i => i.email === email);
    record.expiresAt = new Date(Date.now() - 1000);

    const result = await verifyEmailOtp({ email, purpose, otp: '123456' });
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.reason, 'invalid_or_expired');
  });
});
