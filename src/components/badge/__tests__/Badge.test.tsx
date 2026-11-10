// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, it } from 'vitest';
import { Badge, type BadgeProps } from '../Badge';

it('hides optional artwork from assistive technology while retaining the status text', () => {
  // arrange
  const given = <Badge icon={<svg role="img" aria-label="Check" />}>Published</Badge>;

  // act
  render(given);

  // assert
  expect(screen.getByText('Published')).toBeVisible();
  expect(screen.queryByRole('img', { name: 'Check' })).not.toBeInTheDocument();
});

it.each(['neutral', 'info', 'success', 'warning', 'danger'] as const)('supports the %s semantic tone', tone => {
  // arrange
  const given = <Badge tone={tone}>Status</Badge>;

  // act
  const result = render(given);

  // assert
  expect(result.container.firstElementChild).toHaveClass(`fs-badge--${tone}`);
});

it.each([0, 12, 1000000])('preserves the exact count %s', count => {
  // arrange
  const given = <Badge>{count}</Badge>;
  const expected = String(count);

  // act
  render(given);

  // assert
  expect(screen.getByText(expected)).toBeVisible();
});

it('defaults to a passive neutral span', () => {
  // arrange
  const given = <Badge>Draft</Badge>;

  // act
  const result = render(given);

  // assert
  expect(result.container.firstElementChild).toHaveClass('fs-badge--neutral');
  expect(result.container.firstElementChild?.tagName).toBe('SPAN');
  expect(result.container.firstElementChild).not.toHaveAttribute('role');
  expect(result.container.firstElementChild).not.toHaveAttribute('tabindex');
  expect(result.container.firstElementChild).not.toHaveAttribute('aria-live');
});

it('preserves native hidden semantics', () => {
  // arrange
  const given = <Badge hidden>Draft</Badge>;

  // act
  render(given);

  // assert
  expect(screen.getByText('Draft')).not.toBeVisible();
});

it('forwards a native span ref with consumer attributes', () => {
  // arrange
  const ref = createRef<HTMLSpanElement>();
  const given = <Badge ref={ref} id="draft" title="Not yet published" className="custom" style={{ '--fs-badge-padding-inline': '12px' }} aria-describedby="hint">Draft</Badge>;

  // act
  const result = render(given);

  // assert
  expect(ref.current).toBe(result.container.firstElementChild);
  expect(ref.current).toHaveAttribute('id', 'draft');
  expect(ref.current).toHaveAttribute('title', 'Not yet published');
  expect(ref.current).toHaveAttribute('aria-describedby', 'hint');
  expect(ref.current).toHaveClass('custom');
  expect(ref.current?.style.getPropertyValue('--fs-badge-padding-inline')).toBe('12px');
});

it.each(['role', 'tabIndex', 'contentEditable', 'aria-live', 'aria-atomic', 'aria-hidden', 'aria-label', 'aria-labelledby', 'dangerouslySetInnerHTML', 'onClick', 'onKeyDown'])('rejects the passive-semantics override %s from untyped consumers', name => {
  // arrange
  const given = { [name]: 'override' } as unknown as BadgeProps;

  // act
  const result = render(<Badge {...given}>Draft</Badge>);

  // assert
  expect(result.container.firstElementChild?.getAttributeNames()).toEqual(['class']);
  expect(screen.getByText('Draft')).toBeVisible();
});

it('shows an updated count when the consumer rerenders', () => {
  // arrange
  const { rerender } = render(<Badge>{12}</Badge>);

  // act
  rerender(<Badge>{0}</Badge>);

  // assert
  expect(screen.getByText('0')).toBeVisible();
  expect(screen.queryByText('12')).not.toBeInTheDocument();
});
