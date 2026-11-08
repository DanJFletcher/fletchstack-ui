import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { Button } from '../src';

it('defaults to a non-submitting native button in server HTML', () => {
  // arrange
  const given = createElement(Button, null, 'Save changes');

  // act
  const result = renderToStaticMarkup(given);

  // assert
  expect(result).toContain('type="button"');
});
