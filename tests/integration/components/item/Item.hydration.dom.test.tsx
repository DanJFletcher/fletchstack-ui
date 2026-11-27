// @vitest-environment jsdom
import '../../../support/dom';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { itemContracts } from '../../../support/item-contracts';
itemContracts((element) => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);
  return render(element, {
    container,
    hydrate: true,
    onRecoverableError: (error) => {
      throw error;
    },
  });
});
import { expect, it } from 'vitest';
import { Item } from '../../../../src/components/item/Item';
it('preserves destination attributes on the initial server render', () => {
  // arrange
  // act
  const result = renderToString(
    <Item as="a" href="/guide" aria-label="Guide">
      Read
    </Item>,
  );

  // assert
  expect(result).toContain('href="/guide" aria-label="Guide"');
});
