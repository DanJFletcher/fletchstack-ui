// @vitest-environment jsdom
import '../../../support/dom';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { Chip } from '../../../../src/components/chip/index';
import { chipContracts } from '../../../support/chip-contracts';

describe('server hydration', () => chipContracts(element => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);
  return render(element, { container, hydrate: true, onRecoverableError: error => { throw error; } });
}));
it('server renders a controlled selection with independent removal', () => {
  const result = renderToString(<Chip selected onSelect={() => {}} onRemove={() => {}} removeLabel="Remove Design">Design</Chip>);
  expect(result).toContain('aria-pressed="true"');
  expect(result).toContain('aria-label="Remove Design"');
  expect(result).not.toContain('tabindex=');
});
