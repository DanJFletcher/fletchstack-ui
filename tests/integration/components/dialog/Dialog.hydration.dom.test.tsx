// @vitest-environment jsdom
import '../../../support/dom';
import '../../../support/dialog-platform';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Dialog } from '../../../../src/components/dialog/Dialog';
import { dialogContracts } from '../../../support/dialog-contracts';

describe('hydrated native modal', () =>
  dialogContracts((element) => {
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
it('defers native modal opening until hydration rather than rendering a nonmodal open attribute', () => {
  const element = (
    <Dialog open onOpenChange={() => {}} heading="Review">
      Draft
    </Dialog>
  );
  const markup = renderToString(element);
  expect(markup).toBe(renderToString(element));
  expect(markup).not.toMatch(/\sopen=/);
  expect(markup).toContain('Draft');
});
