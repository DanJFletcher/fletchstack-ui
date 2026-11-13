// @vitest-environment jsdom
import '../../../support/dom';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Callout } from '../../../../src/components/callout/Callout';
import { calloutContracts } from '../../../support/callout-contracts';

describe('server hydration', () => calloutContracts(element => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);
  return render(element, { container, hydrate: true, onRecoverableError: error => { throw error; } });
}));
it('server renders persistent content without implicit announcement semantics', () => {
  const result = renderToString(<Callout tone="warning" title="Review publishing" action={<button type="button">Review pages</button>}>Two pages need approval.</Callout>);
  expect(result).toContain('Review pages');
  expect(result).toContain('Two pages need approval.');
  expect(result).not.toMatch(/role=|aria-live=/);
});
