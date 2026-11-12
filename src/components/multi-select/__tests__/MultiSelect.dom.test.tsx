// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { multiSelectContracts } from '../../../../tests/support/multi-select-contracts';
describe('fresh client rendering', () => multiSelectContracts(element => render(element)));

import { MultiSelect } from '../index';
import { renderToString } from 'react-dom/server';
it('server renders a named composite through the component entrypoint', () => {
  // arrange
  const given = <MultiSelect label="Topics" options={[]} />;
  // act
  const result = renderToString(given);
  // assert
  expect(result).toContain('role="combobox"');
  expect(result).toContain('Topics');
});
