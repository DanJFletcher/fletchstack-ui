// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { Avatar, type AvatarProps } from '../Avatar';

afterEach(() => vi.restoreAllMocks());

it.each([
  { name: 'Maya Chen', expected: 'MC' },
  { name: '  maya middle chen  ', expected: 'MC' },
  { name: 'Maya', expected: 'M' },
  { name: 'Élodie 李', expected: 'É李' },
  { name: '𐐀 Test', expected: '𐐀T' },
  { name: '', expected: '?' },
  { name: '   ', expected: '?' },
])('generates $expected for "$name"', ({ name, expected }) => {
  // arrange
  const given = <Avatar name={name} />;
  // act
  render(given);
  // assert
  expect(screen.getByText(expected)).toBeInTheDocument();
});

it.each([
  { initials: ' m ', expected: 'M' },
  { initials: 'abc', expected: 'AB' },
  { initials: ' ', expected: 'MC' },
])('uses custom initials "$initials"', ({ initials, expected }) => {
  // act
  render(<Avatar name="Maya Chen" initials={initials} />);
  // assert
  expect(screen.getByRole('img', { name: 'Maya Chen' })).toHaveTextContent(expected);
});

it('provides a decorative unknown fallback by default', () => {
  // act
  render(<Avatar />);
  // assert
  expect(screen.getByText('?').parentElement).toHaveAttribute('aria-hidden', 'true');
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

it('allows alt to override the identity name without changing initials', () => {
  // act
  render(<Avatar name="Maya Chen" alt="  Account owner  " />);
  // assert
  expect(screen.getByRole('img', { name: 'Account owner' })).toHaveTextContent('MC');
});

it('makes a named avatar decorative with empty alt', () => {
  // act
  render(<Avatar name="Maya Chen" alt="" />);
  // assert
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

it('forwards native presentation attributes and the span ref', () => {
  // arrange
  const ref = createRef<HTMLSpanElement>();
  // act
  render(
    <Avatar
      ref={ref}
      name="Maya Chen"
      id="owner"
      title="Owner"
      className="custom"
      size="xlarge"
      shape="rounded"
      hidden
      style={{ '--fs-avatar-size': '80px' }}
    />,
  );
  // assert
  expect(ref.current).toHaveClass('fs-avatar--xlarge', 'fs-avatar--rounded', 'custom');
  expect(ref.current).toHaveAttribute('id', 'owner');
  expect(ref.current).toHaveAttribute('title', 'Owner');
  expect(ref.current).toHaveAttribute('hidden');
  expect(ref.current?.style.getPropertyValue('--fs-avatar-size')).toBe('80px');
});

it('ignores owned and interactive overrides from untyped callers', () => {
  // arrange
  const onClick = vi.fn();
  const given = {
    role: 'button',
    tabIndex: 0,
    'aria-label': 'Wrong',
    'aria-hidden': true,
    contentEditable: true,
    children: 'Wrong',
    onClick,
    'aria-live': 'polite',
    dangerouslySetInnerHTML: { __html: '<b>Wrong</b>' },
  } as unknown as AvatarProps;
  render(<Avatar {...given} name="Maya Chen" />);
  // act
  fireEvent.click(screen.getByRole('img', { name: 'Maya Chen' }));
  // assert
  expect(onClick).not.toHaveBeenCalled();
  expect(screen.getByRole('img')).not.toHaveAttribute('tabindex');
  expect(screen.getByRole('img')).not.toHaveAttribute('aria-live');
  expect(screen.getByRole('img')).toHaveTextContent('MC');
});

it('keeps initials while an image is pending', () => {
  // act
  render(<Avatar name="Maya Chen" src="/pending.svg" />);
  // assert
  expect(screen.getAllByRole('img')).toHaveLength(1);
  expect(screen.getByRole('img', { name: 'Maya Chen' })).toHaveTextContent('MC');
  expect(screen.getByRole('img').querySelector('img')).toHaveAttribute('alt', '');
});

it('replaces initials when the native image loads', () => {
  // arrange
  render(<Avatar name="Maya Chen" src="/photo.svg" />);
  // act
  fireEvent.load(screen.getByRole('img').querySelector('img')!);
  // assert
  expect(screen.queryByText('MC')).not.toBeInTheDocument();
  expect(screen.getByRole('img').querySelector('img')).toHaveClass('fs-avatar__photo--loaded');
});

it('removes a failed image and retains the named fallback', () => {
  // arrange
  render(<Avatar name="Maya Chen" src="/failed.svg" />);
  // act
  fireEvent.error(screen.getByRole('img').querySelector('img')!);
  // assert
  expect(screen.getByRole('img', { name: 'Maya Chen' })).toHaveTextContent('MC');
  expect(screen.getByRole('img').querySelector('img')).toBeNull();
});

it('retries a changed source after failure', () => {
  // arrange
  const { rerender } = render(<Avatar name="Maya Chen" src="/failed.svg" />);
  fireEvent.error(screen.getByRole('img').querySelector('img')!);
  // act
  rerender(<Avatar name="Maya Chen" src="/replacement.svg" />);
  // assert
  expect(screen.getByRole('img').querySelector('img')).toHaveAttribute('src', '/replacement.svg');
});

it('does not accept a late event from a replaced image', () => {
  // arrange
  const { rerender } = render(<Avatar name="Maya Chen" src="/first.svg" />);
  const oldImage = screen.getByRole('img').querySelector('img')!;
  rerender(<Avatar name="Maya Chen" src="/second.svg" />);
  // act
  fireEvent.load(oldImage);
  // assert
  expect(screen.getByRole('img')).toHaveTextContent('MC');
  expect(screen.getByRole('img').querySelector('img')).toHaveAttribute('src', '/second.svg');
});

it('restores initials when a loaded source is removed', () => {
  // arrange
  const { rerender } = render(<Avatar name="Maya Chen" src="/first.svg" />);
  fireEvent.load(screen.getByRole('img').querySelector('img')!);
  // act
  rerender(<Avatar name="Maya Chen" src="  " />);
  // assert
  expect(screen.getByRole('img')).toHaveTextContent('MC');
  expect(screen.getByRole('img').querySelector('img')).toBeNull();
});

it.each([
  { width: 80, expected: '' },
  { width: 0, expected: 'MC' },
])('recognizes an already-complete image with width $width', ({ width, expected }) => {
  // arrange
  vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
  vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(width);
  // act
  render(<Avatar name="Maya Chen" src="/cached.svg" />);
  // assert
  expect(screen.getByRole('img', { name: 'Maya Chen' }).textContent).toBe(expected);
});
