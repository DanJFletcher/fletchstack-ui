import { describe, expect, it } from 'vitest';
import { validateTabs } from '../../../../src/components/tabs/tabs-policy';
import { tabsPolicyContracts } from '../../../support/tabs-policy-contracts';

describe('tabs policy integration', tabsPolicyContracts);
it('accepts enabled content configuration', () => {
  const result = validateTabs([{ id: 'a', label: 'Alpha', content: 'Content' }], 'Workspace');
  expect(result).toBeUndefined();
});
