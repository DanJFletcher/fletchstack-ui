// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, it } from 'vitest';
import { Cluster, type ClusterStyle } from '../Cluster';

it('preserves native description relationships on the layout wrapper', () => {
  // arrange
  const given = <Cluster id="actions" aria-describedby="hint" data-testid="layout"><button>Save</button></Cluster>;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveAttribute('id', 'actions');
  expect(screen.getByTestId('layout')).toHaveAttribute('aria-describedby', 'hint');
});

it('defaults to actions gap, center alignment and start justification', () => {
  // arrange
  const given = <Cluster data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass('fs-cluster--gap-actions', 'fs-cluster--align-center', 'fs-cluster--justify-start');
});

it.each(['none', 'actions', 'related'] as const)('supports the %s gap', gap => {
  // arrange
  const given = <Cluster gap={gap} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass(`fs-cluster--gap-${gap}`);
});

it.each(['start', 'center', 'end', 'baseline'] as const)('supports %s alignment', align => {
  // arrange
  const given = <Cluster align={align} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass(`fs-cluster--align-${align}`);
});

it.each(['start', 'center', 'end'] as const)('supports %s justification', justify => {
  // arrange
  const given = <Cluster justify={justify} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass(`fs-cluster--justify-${justify}`);
});

it('forwards a native div ref', () => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const given = <Cluster ref={ref} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByTestId('layout'));
  expect(ref.current?.tagName).toBe('DIV');
});

it('preserves consumer classes and typed styles', () => {
  // arrange
  const style: ClusterStyle = { '--fs-space-gap-actions': '24px', color: 'red' };
  const given = <Cluster className="consumer" style={style} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass('consumer');
  expect(screen.getByTestId('layout').style.getPropertyValue('--fs-space-gap-actions')).toBe('24px');
  expect(screen.getByTestId('layout')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
});

it('preserves native child order', () => {
  // arrange
  const given = <Cluster><button>First</button><button>Second</button></Cluster>;

  // act
  render(given);

  // assert
  expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['First', 'Second']);
});

it('honors native hidden behavior', () => {
  // arrange
  const given = <Cluster hidden><button>Save</button></Cluster>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('button', { hidden: true })).not.toBeVisible();
});

it('adds no group, toolbar or focus semantics', () => {
  // arrange
  const given = <Cluster data-testid="layout"><button>Save</button></Cluster>;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).not.toHaveAttribute('role');
  expect(screen.getByTestId('layout')).not.toHaveAttribute('tabindex');
});
