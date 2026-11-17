import { describe, expect, it } from 'vitest';
import { validateTabs } from '../tabs-policy';
import { tabsPolicyContracts } from '../../../../tests/support/tabs-policy-contracts';

describe('tabs policy', tabsPolicyContracts);
it('accepts an empty named list', () => {
  // arrange
  const given: [] = [];

  // act
  const result = validateTabs(given, 'Workspace');

  // assert
  expect(result).toBeUndefined();
});
