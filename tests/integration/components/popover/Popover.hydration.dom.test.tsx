// @vitest-environment jsdom
import '../../../support/dom';
import '../../../support/popover-platform';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Popover } from '../../../../src/components/popover/Popover';
import { popoverContracts } from '../../../support/popover-contracts';

describe('hydrated non-modal panel', () => popoverContracts(element => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element); document.body.appendChild(container);
  return render(element, { container, hydrate: true, onRecoverableError: error => { throw error; } });
}));
it('renders deterministic native popover markup on the server', () => {
  const element = <Popover triggerLabel="Details">Draft</Popover>;
  const markup = renderToString(element);
  expect(markup).toBe(renderToString(element));
  expect(markup).toContain('popover="manual"');
  expect(markup).toContain('hidden=""');
});

import { popoverPositionContracts } from '../../../support/popover-position-contracts';
describe('popover position', popoverPositionContracts);
