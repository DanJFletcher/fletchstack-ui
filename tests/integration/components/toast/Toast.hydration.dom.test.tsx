// @vitest-environment jsdom
import '../../../support/dom';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { toastContracts } from '../../../support/toast-contracts';
import { Toast } from '../../../../src/components/toast/Toast';
toastContracts((element) => {
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
});
it('renders readable server content with an initially empty live region', () => {
  // arrange
  // act
  const result = renderToString(<Toast title="Saved">Project updated.</Toast>);

  // assert
  expect(result).toContain('role="status" aria-live="polite" aria-atomic="true"></span>');
  expect(result).toContain('Project updated.');
});
