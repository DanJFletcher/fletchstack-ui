// @vitest-environment jsdom
import '../../../support/dom';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Tabs } from '../../../../src/components/tabs/Tabs';
import { tabsFocusContracts } from '../../../support/tabs-focus-contracts';
import { tabItems, tabsContracts } from '../../../support/tabs-contracts';

describe('focus after server hydration', () => tabsFocusContracts(element => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element); document.body.appendChild(container);
  return render(element, { container, hydrate: true, onRecoverableError: error => { throw error; } });
}));

describe('server hydration', () => tabsContracts(element => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element); document.body.appendChild(container);
  return render(element, { container, hydrate: true, onRecoverableError: error => { throw error; } });
}));
it('renders deterministic default relationships without client effects', () => {
  const element = <Tabs label="Workspace" items={tabItems} />;
  expect(renderToString(element)).toBe(renderToString(element));
});
