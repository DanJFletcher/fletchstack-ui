// @vitest-environment jsdom
import '../../../support/dom';
import '../../../support/tooltip-platform';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Tooltip } from '../../../../src/components/tooltip/Tooltip';
import { tooltipContracts } from '../../../support/tooltip-contracts';

import { tooltipPositionContracts } from '../../../support/tooltip-position-contracts';

describe('focus-safe placement', tooltipPositionContracts);
describe('hydrated tooltip', () =>
  tooltipContracts((element) => {
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
  }));
it('renders deterministic hidden content and descriptions before hydration', () => {
  const element = (
    <Tooltip content="Server help">
      <button>Project help</button>
    </Tooltip>
  );
  const markup = renderToString(element);
  expect(markup).toBe(renderToString(element));
  expect(markup).toContain('role="tooltip"');
  expect(markup).toContain('hidden=""');
  expect(markup).toContain('aria-describedby="tooltip-');
});
it('rejects a Fragment trigger during server rendering', () => {
  const element = (
    <Tooltip content="Help">
      <>
        <button>Help</button>
      </>
    </Tooltip>
  );
  expect(() => renderToString(element)).toThrow(
    'Tooltip requires one trigger element, not a Fragment.',
  );
});
