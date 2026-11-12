// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { Chip } from '../index';
import { chipContracts } from '../../../../tests/support/chip-contracts';

describe('client rendering', () => chipContracts(element => render(element)));
it('server renders deterministic passive content through the component entrypoint', () => {
  // arrange
  const given = <Chip>Design</Chip>;
  // act
  const result = renderToString(given);
  // assert
  expect(result).toBe('<span data-disabled="false" class="fs-chip fs-chip--medium"><span class="fs-chip__label">Design</span></span>');
});
