// @vitest-environment jsdom
import '../../../support/dom';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from '../../../../src/components/breadcrumbs/Breadcrumbs';
import { breadcrumbsContracts } from '../../../support/breadcrumbs-contracts';

describe('server hydration', () => breadcrumbsContracts(element => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);
  return render(element, { container, hydrate: true, onRecoverableError: error => { throw error; } });
}));
it('server renders a native named landmark and plain current page', () => {
  const result = renderToString(<Breadcrumbs items={[{ label: 'Home', href: '/home' }, { label: 'Settings', current: true }]} />);
  expect(result).toContain('<nav aria-label="Breadcrumb"');
  expect(result).toContain('aria-current="page">Settings');
});
