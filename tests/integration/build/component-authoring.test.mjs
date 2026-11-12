import { describe, it, expect } from 'vitest';
import { authoringContracts } from '../../support/component-contracts.mjs';

describe('Component authoring contracts', authoringContracts);

import { componentOptions } from '../../../scripts/component-options.mjs';

it('refuses an implicit native element', () => {
  // act
  const act = () => componentOptions('StatusLabel', 'Feedback');
  // assert
  expect(act).toThrow('Unsupported element');
});
