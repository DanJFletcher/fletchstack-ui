// @vitest-environment jsdom
import '../../../support/dom';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { progressContracts } from '../../../support/progress-contracts';
import { Progress } from '../../../../src/components/progress/Progress';
progressContracts(element => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);
  return render(element, { container, hydrate: true, onRecoverableError: error => { throw error; } });
});
it('exposes measured task completion on the first server render', () => {
  // arrange
  // act
  const result = renderToString(<Progress value={3} max={8} label="Upload progress" />);

  // assert
  expect(result).toContain('aria-valuemax="8" aria-valuenow="3"');
  expect(result).toContain('inline-size:37.5%');
});
