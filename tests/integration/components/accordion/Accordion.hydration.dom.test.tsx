// @vitest-environment jsdom
import '../../../support/dom';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { accordionContracts, animatedServerMarkup } from '../../../support/accordion-contracts';

describe('server hydration', () => accordionContracts(element => {
  const container = document.createElement('div');
  container.innerHTML = requireServerMarkup(element);
  document.body.appendChild(container);
  return render(element, { container, hydrate: true, onRecoverableError: error => { throw error; } });
}));
import { renderToString as requireServerMarkup } from 'react-dom/server';
it('server hides animated panels before hydration', () => {
  const result = animatedServerMarkup();
  expect(result.match(/hidden=""/g)).toHaveLength(3);
});
