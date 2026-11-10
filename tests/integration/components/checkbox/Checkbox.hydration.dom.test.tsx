// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it } from 'vitest';
import { Checkbox } from '../../../../src/components/checkbox/Checkbox';

afterEach(cleanup);

it('hydrates native mixed state from server-rendered checkbox markup', () => {
  // arrange
  const ref = createRef<HTMLInputElement>();
  const given = <Checkbox label="Select all" indeterminate ref={ref} />;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);

  // act
  render(given, { container, hydrate: true });

  // assert
  expect(screen.getByRole('checkbox', { name: 'Select all' })).toBePartiallyChecked();
});
