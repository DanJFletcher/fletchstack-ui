// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, it } from 'vitest';
import { Separator, type SeparatorProps } from '../Separator';

it('exposes a meaningful horizontal boundary when decorative mode is disabled', () => {
  // arrange
  const given = <Separator decorative={false} />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
});

it.each(['horizontal', 'vertical'] as const)('exposes the semantic %s orientation', orientation => {
  // arrange
  const given = <Separator decorative={false} orientation={orientation} />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', orientation);
});

it.each(['horizontal', 'vertical'] as const)('hides decorative %s grouping from assistive technology', orientation => {
  // arrange
  const given = <Separator orientation={orientation} />;

  // act
  const result = render(given);

  // assert
  expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  expect(result.container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  expect(result.container.firstElementChild).not.toHaveAttribute('aria-orientation');
});

it('defaults to an empty horizontal rule', () => {
  // arrange
  const given = <Separator />;

  // act
  const result = render(given);

  // assert
  expect(result.container.firstElementChild).toHaveClass('fs-separator--horizontal');
  expect(result.container.firstElementChild).toBeEmptyDOMElement();
});

it('supports an optional accessible name for meaningful boundaries', () => {
  // arrange
  const given = <Separator decorative={false} aria-label="Account settings" />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('separator', { name: 'Account settings' })).toBeInTheDocument();
});

it('forwards a div ref and native consumer attributes', () => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const given = <Separator ref={ref} decorative={false} id="boundary" title="Account boundary" className="custom" style={{ '--fs-separator-thickness': '2px' }} />;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByRole('separator'));
  expect(ref.current).toHaveAttribute('id', 'boundary');
  expect(ref.current).toHaveAttribute('title', 'Account boundary');
  expect(ref.current).toHaveClass('custom');
  expect(ref.current?.style.getPropertyValue('--fs-separator-thickness')).toBe('2px');
});

it('preserves native hidden semantics', () => {
  // arrange
  const given = <Separator hidden decorative={false} />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('separator', { hidden: true })).not.toBeVisible();
});

it.each(['role', 'aria-hidden', 'aria-orientation', 'tabIndex', 'contentEditable', 'aria-live', 'aria-atomic', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-valuetext', 'children', 'dangerouslySetInnerHTML', 'onClick', 'onKeyDown'])('ignores the untyped override %s', name => {
  // arrange
  const given = { [name]: 'override' } as unknown as SeparatorProps;

  // act
  const result = render(<Separator {...given} decorative={false} />);

  // assert
  expect(result.container.firstElementChild?.getAttributeNames()).toEqual(['class', 'role', 'aria-orientation']);
  expect(screen.getByRole('separator')).toBeEmptyDOMElement();
});

it('updates orientation when its parent changes the layout', () => {
  // arrange
  const { rerender } = render(<Separator decorative={false} />);

  // act
  rerender(<Separator decorative={false} orientation="vertical" />);

  // assert
  expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
});
