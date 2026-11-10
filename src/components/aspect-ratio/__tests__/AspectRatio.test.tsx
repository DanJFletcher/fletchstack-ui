// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, it } from 'vitest';
import { AspectRatio, type AspectRatioStyle } from '../AspectRatio';

it('preserves native media description relationships', () => {
  // arrange
  const given = <AspectRatio id="project-media" aria-describedby="caption" data-testid="frame"><img alt="Project landscape" /></AspectRatio>;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('frame')).toHaveAttribute('id', 'project-media');
  expect(screen.getByTestId('frame')).toHaveAttribute('aria-describedby', 'caption');
});

it('defaults to the landscape numeric ratio', () => {
  // arrange
  const given = <AspectRatio data-testid="frame" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('frame')).toHaveStyle({ aspectRatio: '1.7777777777777777' });
});

it.each([{ ratio: 1, expected: '1' }, { ratio: 0.75, expected: '0.75' }, { ratio: 2.4, expected: '2.4' }])('supports a positive $ratio ratio', ({ ratio, expected }) => {
  // arrange
  const given = <AspectRatio ratio={ratio} data-testid="frame" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('frame')).toHaveStyle({ aspectRatio: expected });
});

it.each([0, -1, NaN, Infinity, -Infinity])('falls back to landscape for invalid numeric ratio %s', ratio => {
  // arrange
  const given = <AspectRatio ratio={ratio} data-testid="frame" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('frame')).toHaveStyle({ aspectRatio: '1.7777777777777777' });
});

it('forwards the ref to the native outer div', () => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const given = <AspectRatio ref={ref} data-testid="frame"><img alt="Project artwork" /></AspectRatio>;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByTestId('frame'));
  expect(ref.current?.tagName).toBe('DIV');
});

it('preserves consumer classes and typed semantic style overrides', () => {
  // arrange
  const style: AspectRatioStyle = { '--fs-space-gap-related': '32px', color: 'red' };
  const given = <AspectRatio className="consumer" style={style} data-testid="frame" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('frame')).toHaveClass('consumer');
  expect(screen.getByTestId('frame').style.getPropertyValue('--fs-space-gap-related')).toBe('32px');
  expect(screen.getByTestId('frame')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
});

it('lets native aspectRatio styles override the ratio prop', () => {
  // arrange
  const given = <AspectRatio ratio={1} style={{ aspectRatio: '4 / 3' }} data-testid="frame" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('frame').style.aspectRatio).toBe('4 / 3');
});

it('preserves native child semantics and source order', () => {
  // arrange
  const given = <AspectRatio><button>Play</button><button>Pause</button></AspectRatio>;

  // act
  render(given);

  // assert
  expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['Play', 'Pause']);
});

it('preserves the native hidden attribute', () => {
  // arrange
  const given = <AspectRatio hidden><img alt="Hidden artwork" /></AspectRatio>;

  // act
  render(given);

  // assert
  expect(screen.getByAltText('Hidden artwork')).not.toBeVisible();
});

it('adds no role or keyboard stop to the frame', () => {
  // arrange
  const given = <AspectRatio data-testid="frame" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('frame')).not.toHaveAttribute('role');
  expect(screen.getByTestId('frame')).not.toHaveAttribute('tabindex');
});
