// @vitest-environment jsdom
import '../../../support/dom';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { appLayoutContracts } from '../../../support/app-layout-contracts';

describe('server hydration', () =>
  appLayoutContracts((element) => {
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

import { AppShell } from '../../../../src/components/app-shell/AppShell';

it('renders deterministic server markup without browser effects', () => {
  const element = (
    <AppShell>
      <span>Page</span>
    </AppShell>
  );
  const result = renderToString(element);
  expect(renderToString(element)).toBe(result);
  expect(result).toContain('Page');
});
