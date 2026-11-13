// @vitest-environment jsdom
import '../../../support/dom';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { comboboxContracts } from '../../../support/combobox-contracts';
import { Combobox } from '../../../../src/components/combobox/Combobox';

describe('server hydration', () => comboboxContracts(element => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);
  return render(element, { container, hydrate: true, onRecoverableError: error => { throw error; } });
}));

it('renders a selected canonical form value before hydration', () => {
  const result = renderToString(<Combobox label="Region" options={[{ value: 'gb', label: 'United Kingdom' }]} name="region" defaultValue="gb" />);
  expect(result).toMatch(/<input\b(?=[^>]*type="hidden")(?=[^>]*name="region")(?=[^>]*value="gb")[^>]*>/);
  expect(result).toContain('value="United Kingdom"');
});
