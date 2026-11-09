// @vitest-environment jsdom
import '../setup/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, it } from 'vitest';
import { Button, Icon } from '../../../src';

it('uses a trimmed label as its image name', () => {
  // arrange
  const given = <Icon label=" Night mode "><path d="M4 4h16v16H4Z" /></Icon>;

  // act
  render(given);

  // assert
  const result = screen.getByRole('img', { name: 'Night mode' });
  expect(result).toHaveAccessibleName('Night mode');
});

it.each([undefined, '', '   '])('keeps a %j label decorative', label => {
  // arrange
  const given = <Button>Save<Icon {...(label === undefined ? {} : { label })} data-testid="artwork"><path d="M4 4h16v16H4Z" /></Icon></Button>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('button', { name: 'Save' })).toHaveAccessibleName('Save');
  expect(screen.getByTestId('artwork')).toHaveAttribute('aria-hidden', 'true');
  expect(screen.getByTestId('artwork')).toHaveAttribute('focusable', 'false');
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

it.each([
  { size: undefined, expected: 'fs-icon--medium' },
  { size: 'small', expected: 'fs-icon--small' },
  { size: 'medium', expected: 'fs-icon--medium' },
  { size: 'large', expected: 'fs-icon--large' },
] as const)('selects the $expected styling hook', ({ size, expected }) => {
  // arrange
  const given = <Icon label="Shape" {...(size === undefined ? {} : { size })} />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('img', { name: 'Shape' })).toHaveClass('fs-icon', expected);
});

it('forwards SVG composition, coordinate space, and consumer customization', () => {
  // arrange
  const given = <Icon label="Custom" viewBox="0 0 32 32" className="brand-art" data-source="consumer"
    style={{ '--fs-icon-size-medium': '32px' }} fill="currentColor" stroke="none">
    <g><path d="M4 4h24v24H4Z" /></g>
  </Icon>;

  // act
  render(given);

  // assert
  const result = screen.getByRole('img', { name: 'Custom' });
  expect(result).toHaveAttribute('viewBox', '0 0 32 32');
  expect(result).toHaveAttribute('data-source', 'consumer');
  expect(result).toHaveClass('brand-art');
  expect(result.style.getPropertyValue('--fs-icon-size-medium')).toBe('32px');
  expect(result).toHaveAttribute('fill', 'currentColor');
  expect(result).toHaveAttribute('stroke', 'none');
  expect(result.querySelector('g > path')).toHaveAttribute('d', 'M4 4h24v24H4Z');
});

it('exposes its SVG root through the forwarded ref', () => {
  // arrange
  const ref = createRef<SVGSVGElement>();
  const given = <Icon label="Shape" ref={ref} />;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByRole('img', { name: 'Shape' }));
});

it('preserves its naming and focus contract against untyped prop overrides', () => {
  // arrange
  const conflicting: Record<string, unknown> = { role: 'button', 'aria-label': 'Wrong', 'aria-labelledby': 'other', 'aria-hidden': true, tabIndex: 0, focusable: 'true', width: 900, height: 900 };
  const given = <Icon {...conflicting} label="Correct" />;

  // act
  render(given);

  // assert
  const result = screen.getByRole('img', { name: 'Correct' });
  expect(result).not.toHaveAttribute('aria-labelledby');
  expect(result).not.toHaveAttribute('aria-hidden');
  expect(result).not.toHaveAttribute('tabindex');
  expect(result).not.toHaveAttribute('width');
  expect(result).not.toHaveAttribute('height');
  expect(result).toHaveAttribute('focusable', 'false');
});
