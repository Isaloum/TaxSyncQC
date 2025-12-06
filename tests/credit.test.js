import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSolidarityCredit,
  calculateWorkPremium,
  calculateCWB,
} from '../credit-calculator.js';

test('calculateSolidarityCredit returns number', () => {
  const s = calculateSolidarityCredit(30000);
  assert.strictEqual(typeof s, 'number');
});

test('calculateWorkPremium returns number', () => {
  const w = calculateWorkPremium(25000);
  assert.strictEqual(typeof w, 'number');
});

test('calculateCWB returns number', () => {
  const c = calculateCWB(20000);
  assert.strictEqual(typeof c, 'number');
});

// Additional tests to cover phase-out and phase-in branches
test('calculateSolidarityCredit reduced for singles in phaseout range', () => {
  const amt = calculateSolidarityCredit(60000); // between PHASEOUT_START and PHASEOUT_END
  assert.ok(amt > 0 && amt < 531);
});

test('calculateSolidarityCredit zero at/above PHASEOUT_END for couples', () => {
  const amt = calculateSolidarityCredit(65000, false);
  assert.strictEqual(amt, 0);
});

test('calculateCWB phase-in returns 27% of income (below max)', () => {
  const c = calculateCWB(5000);
  assert.strictEqual(c, 1350);
});

test('calculateCWB phase-out reduces then reaches zero', () => {
  const c1 = calculateCWB(30000); // within phase-out range
  assert.strictEqual(c1, 849.85);
  const c2 = calculateCWB(40000); // beyond phase-out end
  assert.strictEqual(c2, 0);
});
