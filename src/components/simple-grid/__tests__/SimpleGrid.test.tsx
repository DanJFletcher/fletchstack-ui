// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, it } from 'vitest';
import { SimpleGrid, type SimpleGridStyle } from '../SimpleGrid';

it('preserves native description relationships on the layout wrapper', () => {
  // arrange
  const given = (
    <SimpleGrid id="settings" aria-describedby="summary" data-testid="layout">
      <p>Project settings</p>
    </SimpleGrid>
  );

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveAttribute('id', 'settings');
  expect(screen.getByTestId('layout')).toHaveAttribute('aria-describedby', 'summary');
});

it('defaults to related spacing', () => {
  // arrange
  const given = <SimpleGrid data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass('fs-simple-grid--gap-related');
});

it.each(['none', 'related', 'group'] as const)('supports the %s gap relationship', (gap) => {
  // arrange
  const given = <SimpleGrid gap={gap} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass(`fs-simple-grid--gap-${gap}`);
});

it('forwards a native div ref', () => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const given = <SimpleGrid ref={ref} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByTestId('layout'));
  expect(ref.current?.tagName).toBe('DIV');
});

it('preserves consumer classes and typed semantic overrides', () => {
  // arrange
  const style: SimpleGridStyle = { '--fs-space-gap-related': '32px', color: 'red' };
  const given = <SimpleGrid className="consumer" style={style} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass('consumer');
  expect(screen.getByTestId('layout').style.getPropertyValue('--fs-space-gap-related')).toBe(
    '32px',
  );
  expect(screen.getByTestId('layout')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
});

it('preserves the supplied child order', () => {
  // arrange
  const given = (
    <SimpleGrid>
      <button>First</button>
      <button>Second</button>
    </SimpleGrid>
  );

  // act
  render(given);

  // assert
  expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
    'First',
    'Second',
  ]);
});

it('preserves native hidden behavior', () => {
  // arrange
  const given = (
    <SimpleGrid hidden>
      <p>Hidden content</p>
    </SimpleGrid>
  );

  // act
  render(given);

  // assert
  expect(screen.getByText('Hidden content')).not.toBeVisible();
});

it('adds no role or keyboard focus to the wrapper', () => {
  // arrange
  const given = (
    <SimpleGrid data-testid="layout">
      <p>Project settings</p>
    </SimpleGrid>
  );

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).not.toHaveAttribute('role');
  expect(screen.getByTestId('layout')).not.toHaveAttribute('tabindex');
});
