// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  accordionContracts,
  animatedServerMarkup,
} from '../../../../tests/support/accordion-contracts';

describe('client rendering', () => accordionContracts((element) => render(element)));
it('server hides animated panels before inert can be installed', () => {
  // arrange
  // act
  const result = animatedServerMarkup();
  // assert
  expect(result.match(/hidden=""/g)).toHaveLength(3);
});
