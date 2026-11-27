// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import { Avatar, type AvatarProps } from '../../../../src/components/avatar/Avatar';

afterEach(() => vi.restoreAllMocks());

it.each([
  { props: {}, expected: '?' },
  { props: { name: 'Maya' }, expected: 'M' },
  { props: { name: '  Maya Chen  ', alt: 'Account owner' }, expected: 'MC' },
  { props: { name: 'Élodie 李', alt: '' }, expected: 'É李' },
  { props: { name: 'Maya Chen', initials: 'm', shape: 'square', size: 'small' }, expected: 'M' },
  { props: { name: 'Maya Chen', initials: '  ', src: '  ' }, expected: 'MC' },
] satisfies { props: AvatarProps; expected: string }[])(
  'hydrates deterministic identity markup: $expected',
  ({ props, expected }) => {
    // arrange
    const ref = createRef<HTMLSpanElement>();
    const given = (
      <Avatar
        {...props}
        ref={ref}
        title="Owner"
        className="consumer"
        style={{ '--fs-avatar-size': '48px' }}
      />
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(given);
    document.body.appendChild(container);
    const onRecoverableError = vi.fn();
    // act
    render(given, { container, hydrate: true, onRecoverableError });
    // assert
    expect(ref.current).toHaveTextContent(expected);
    expect(ref.current).toHaveClass('consumer');
    expect(ref.current).toHaveAttribute('title', 'Owner');
    expect(onRecoverableError).not.toHaveBeenCalled();
  },
);

it('hydrates a pending photo, replaces it after failure, and removes it after loading', () => {
  // arrange
  const given = <Avatar name="Maya Chen" src="/pending.svg" />;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);
  const errors = vi.fn();
  const { rerender } = render(given, { container, hydrate: true, onRecoverableError: errors });
  expect(screen.getByRole('img', { name: 'Maya Chen' })).toHaveTextContent('MC');
  // act
  fireEvent.error(screen.getByRole('img').querySelector('img')!);
  expect(screen.getByRole('img').querySelector('img')).toBeNull();
  rerender(<Avatar name="Maya Chen" src="/replacement.svg" />);
  fireEvent.load(screen.getByRole('img').querySelector('img')!);
  expect(screen.getByRole('img').textContent).toBe('');
  rerender(<Avatar name="Maya Chen" />);
  // assert
  expect(screen.getByRole('img', { name: 'Maya Chen' })).toHaveTextContent('MC');
  expect(errors).not.toHaveBeenCalled();
});

it.each([
  { width: 64, expected: '' },
  { width: 0, expected: 'MC' },
])(
  'recovers an image completed before hydration with natural width $width',
  ({ width, expected }) => {
    // arrange
    const given = <Avatar name="Maya Chen" src="/cached.svg" />;
    const container = document.createElement('div');
    container.innerHTML = renderToString(given);
    document.body.appendChild(container);
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
    vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(width);
    const errors = vi.fn();
    // act
    render(given, { container, hydrate: true, onRecoverableError: errors });
    // assert
    expect(screen.getByRole('img', { name: 'Maya Chen' }).textContent).toBe(expected);
    expect(errors).not.toHaveBeenCalled();
  },
);

it('keeps server output passive even with untyped interaction overrides', () => {
  // arrange
  const given = {
    role: 'button',
    tabIndex: 0,
    onClick: vi.fn(),
    'aria-live': 'polite',
    'aria-label': 'Override',
    dangerouslySetInnerHTML: { __html: 'Override' },
    title: 'Account',
  } as unknown as AvatarProps;
  // act
  const result = renderToString(<Avatar {...given} name="Maya Chen" />);
  // assert
  expect(result).toContain('role="img"');
  expect(result).toContain('aria-label="Maya Chen"');
  expect(result).toContain('title="Account"');
  expect(result).not.toMatch(/tabindex|aria-live|Override|onclick/);
});
