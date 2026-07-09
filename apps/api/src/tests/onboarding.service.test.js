import test from 'node:test';
import assert from 'node:assert/strict';
import { getLookups } from '../services/onboarding.service.js';

test('onboarding lookups expose industries, categories, themes, and steps', async () => {
  const data = await getLookups();
  assert.ok(Array.isArray(data.industries));
  assert.ok(data.categories.technology);
  assert.ok(Array.isArray(data.themes));
  assert.deepEqual(data.stepOrder, ['industry', 'category', 'company', 'logo', 'theme', 'content']);
});
