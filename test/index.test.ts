// sum.test.js
import { expect, test } from 'vitest';
import { placeholder } from '../src/index';

test('placeholder test', () => {
  placeholder();
  expect(3).toBe(3)
});
