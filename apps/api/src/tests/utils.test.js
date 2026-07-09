import test from "node:test";
import assert from "node:assert/strict";
import { sha256 } from "../utils/crypto.js";
import { generateOtp } from "../utils/otp.js";

test("sha256 returns stable hashes", () => {
  assert.equal(sha256("oneprofile"), sha256("oneprofile"));
});

test("generateOtp returns a fixed-length numeric string", () => {
  const otp = generateOtp(6);
  assert.equal(otp.length, 6);
  assert.match(otp, /^[0-9]{6}$/);
});
