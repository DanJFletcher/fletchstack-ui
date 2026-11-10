// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, it } from 'vitest';
import { Stack, type StackStyle } from '../Stack';

it('preserves native description relationships on the layout wrapper', () => {
  // arrange
  const given = <Stack id="settings" aria-describedby="summary" data-testid="layout"><p>Project settings</p></Stack>;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveAttribute('id', 'settings');
  expect(screen.getByTestId('layout')).toHaveAttribute('aria-describedby', 'summary');
});

it('defaults to related spacing and stretch alignment', () => {
  // arrange
  const given = <Stack data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass('fs-stack--gap-related', 'fs-stack--align-stretch');
});

it.each(['none', 'related', 'group', 'section'] as const)('supports the %s gap relationship', gap => {
  // arrange
  const given = <Stack gap={gap} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass(`fs-stack--gap-${gap}`);
});

it.each(['stretch', 'start', 'center', 'end'] as const)('supports %s cross-axis alignment', align => {
  // arrange
  const given = <Stack align={align} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass(`fs-stack--align-${align}`);
});

it('forwards a native div ref', () => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const given = <Stack ref={ref} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByTestId('layout'));
  expect(ref.current?.tagName).toBe('DIV');
});

it('preserves consumer classes and typed semantic overrides', () => {
  // arrange
  const style: StackStyle = { '--fs-space-gap-related': '32px', color: 'red' };
  const given = <Stack className="consumer" style={style} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass('consumer');
  expect(screen.getByTestId('layout').style.getPropertyValue('--fs-space-gap-related')).toBe('32px');
  expect(screen.getByTestId('layout')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
});

it('preserves the supplied child order', () => {
  // arrange
  const given = <Stack><button>First</button><button>Second</button></Stack>;

  // act
  render(given);

  // assert
  expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['First', 'Second']);
});

it('preserves native hidden behavior', () => {
  // arrange
  const given = <Stack hidden><p>Hidden content</p></Stack>;

  // act
  render(given);

  // assert
  expect(screen.getByText('Hidden content')).not.toBeVisible();
});

it('adds no role or keyboard focus to the wrapper', () => {
  // arrange
  const given = <Stack data-testid="layout"><p>Project settings</p></Stack>;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).not.toHaveAttribute('role');
  expect(screen.getByTestId('layout')).not.toHaveAttribute('tabindex');
});
