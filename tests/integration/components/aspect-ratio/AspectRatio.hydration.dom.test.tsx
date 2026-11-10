// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { AspectRatio, type AspectRatioProps } from '../../../../src/index';

it.each<AspectRatioProps>([{}, { ratio: 1 }, { ratio: 0.75 }, { ratio: 0 }, { ratio: -1 }, { ratio: NaN }, { ratio: Infinity }])('hydrates %j without losing native media semantics', props => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const given = <AspectRatio {...props} ref={ref} id="media" className="custom" style={{ '--fs-space-gap-related': '24px' }} data-testid="frame"><img alt="Project landscape" /><button>Play</button></AspectRatio>;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);
  const onRecoverableError = vi.fn();

  // act
  render(given, { container, hydrate: true, onRecoverableError });

  // assert
  expect(ref.current).toBe(screen.getByTestId('frame'));
  expect(ref.current).toHaveAttribute('id', 'media');
  expect(ref.current).toHaveClass('custom');
  expect(screen.getByRole('img', { name: 'Project landscape' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Play' })).toBeVisible();
  expect(onRecoverableError).not.toHaveBeenCalled();
});

it('preserves consumer style precedence during hydration', () => {
  // arrange
  const given = <AspectRatio ratio={1} style={{ aspectRatio: '4 / 3' }} data-testid="frame" />;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);

  // act
  render(given, { container, hydrate: true });

  // assert
  expect(screen.getByTestId('frame').style.aspectRatio).toBe('4 / 3');
});
