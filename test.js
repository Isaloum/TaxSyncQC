import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSolidarityCredit, calculateWorkPremium } from './credit-calculator.js';
import { calculateRrspImpact } from './rrsp-calculator.js';
import { parseRL1Text } from './rl1-parser.js';
import { parseIncomeSlip } from './income-slip-parser.js';
import { t } from './i18n.js';

// Test basic functionality of each module
test('Credit calculator should return valid results', async (t) => {
  const solidarityCredit = calculateSolidarityCredit(50000);
  const workPremium = calculateWorkPremium(50000);
  assert.ok(solidarityCredit >= 0);
  assert.ok(workPremium >= 0);
});

test('RRSP calculator should return valid results', async (t) => {
  const result = calculateRrspImpact(50000, 5000);
  assert.ok(result);
  assert.ok(result.contribution >= 0);
  assert.ok(result.taxSaved >= 0);
});

test('RL1 parser should handle valid input', async (t) => {
  const validInput = "Case A: 50000";
  const result = parseRL1Text(validInput);
  assert.ok(result);
  assert.strictEqual(result.income, 50000);
});

test('Income slip parser should handle valid input', async (t) => {
  const validInput = "Box 14: 50000";
  const result = parseIncomeSlip(validInput);
  assert.ok(result);
  assert.strictEqual(result.employmentIncome, 50000);
});

test('i18n should return valid translations', async (testContext) => {
  const english = t('income', 'en');
  const french = t('income', 'fr');
  assert.ok(english);
  assert.ok(french);
  assert.strictEqual(english, 'Income');
  assert.strictEqual(french, 'Revenu');
});

test('i18n should return fallback for invalid key', async (testContext) => {
  const result = t('invalid_key', 'fr');
  assert.strictEqual(result, 'invalid_key');
});