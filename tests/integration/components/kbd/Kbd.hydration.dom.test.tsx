// @vitest-environment jsdom
import '../../../support/dom';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { kbdContracts } from '../../../support/kbd-contracts';
import { Kbd } from '../../../../src/components/kbd/Kbd';
import { KbdGroup } from '../../../../src/components/kbd/KbdGroup';
kbdContracts(element => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);
  return render(element, { container, hydrate: true, onRecoverableError: error => { throw error; } });
});
it('renders a complete grouped shortcut on the server', () => {
  // arrange
  // act
  const result = renderToString(<KbdGroup><Kbd>Ctrl</Kbd> + <Kbd>K</Kbd></KbdGroup>);
  // assert
  expect(result).toBe('<kbd class="fs-kbd-group"><kbd class="fs-kbd">Ctrl</kbd> + <kbd class="fs-kbd">K</kbd></kbd>');
});
