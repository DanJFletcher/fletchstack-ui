// @vitest-environment jsdom
import '../../../support/dom';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { bottomNavigationContracts } from '../../../support/bottom-navigation-contracts';

describe('server hydration', () => bottomNavigationContracts(element => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);
  return render(element, { container, hydrate: true, onRecoverableError: error => { throw error; } });
}));

import { BottomNavigation } from '../../../../src/components/bottom-navigation/BottomNavigation';

it('renders deterministic server markup without browser effects', () => {
  const element = <BottomNavigation aria-label="Primary" ><span>Page</span></BottomNavigation>;
  const result = renderToString(element);
  expect(renderToString(element)).toBe(result);
  expect(result).toContain('Page');
});
