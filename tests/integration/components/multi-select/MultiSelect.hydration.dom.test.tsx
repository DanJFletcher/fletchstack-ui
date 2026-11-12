// @vitest-environment jsdom
import '../../../support/dom';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { multiSelectContracts } from '../../../support/multi-select-contracts';

describe('server markup hydration', () => multiSelectContracts(element => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);
  return render(element, { container, hydrate: true, onRecoverableError: error => { throw error; } });
}));

import { MultiSelect } from '../../../../src/components/multi-select/index';
it('server renders repeated successful values through the component entrypoint', () => {
  const given = <MultiSelect label="Topics" options={[{ value: 'react', label: 'React' }]} defaultValue={['react']} name="topics" />;
  const result = renderToString(given);
  expect(result).toContain('type="hidden" name="topics" value="react"');
});
