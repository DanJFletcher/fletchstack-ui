// @vitest-environment jsdom
import '../../../support/dom';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Navbar } from '../../../../src/components/navbar/Navbar';
import { navbarContracts } from '../../../support/navbar-contracts';

describe('server hydration', () => navbarContracts(element => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element); document.body.appendChild(container);
  return render(element, { container, hydrate: true, onRecoverableError: error => { throw error; } });
}));
it('renders deterministic native landmark markup without browser globals', () => {
  const result = renderToString(<Navbar aria-label="Primary"><Navbar.Item mobilePlacement="bar"><a href="/help">Help</a></Navbar.Item></Navbar>);
  expect(result).toContain('<nav aria-label="Primary"');
  expect(result).toContain('href="/help"');
});
