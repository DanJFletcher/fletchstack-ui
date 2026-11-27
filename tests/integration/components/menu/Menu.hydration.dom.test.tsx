// @vitest-environment jsdom
import '../../../support/dom';
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Menu } from '../../../../src/components/menu/Menu';
import { menuEdgeContracts, menuTriggerContracts } from '../../../support/menu-edge-contracts';
import { menuContracts } from '../../../support/menu-contracts';

/**
 * Hydrate the actual server markup and fail immediately on recovery rather than hiding mismatches.
 **/
function hydrate(element: ReactElement) {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);

  return render(element, {
    container,
    hydrate: true,
    onRecoverableError: (error) => {
      throw error;
    },
  });
}

describe('server hydration', () => {
  menuContracts(hydrate);
  menuEdgeContracts(hydrate);
  menuTriggerContracts(hydrate);
});
it('server renders native links and named menu semantics', () => {
  const result = renderToString(
    <Menu
      triggerLabel="Actions"
      menuLabel="Project menu"
      defaultOpen
      items={[{ type: 'item', id: 'guide', label: 'Guide', href: '#guide' }]}
    />,
  );
  expect(result).toContain('role="menu" aria-label="Project menu"');
  expect(result).toContain('href="#guide"');
});
