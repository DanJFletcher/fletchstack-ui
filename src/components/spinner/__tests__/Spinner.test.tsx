// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Spinner, type SpinnerProps } from '../Spinner';

it('exposes meaningful loading text as a status', () => {
  // arrange
  const given = <Spinner label="Loading projects…" />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('status')).toHaveTextContent('Loading projects…');
});

it('defaults to visible loading text with polite atomic status semantics', () => {
  // arrange
  const given = <Spinner />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('status')).toHaveTextContent('Loading…');
  expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true');
});

it.each(['', '   '])('keeps meaningful status text for a blank label %j', (label) => {
  // arrange
  const given = <Spinner label={label} />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('status')).toHaveTextContent('Loading…');
});

it('hides decorative duplicates from status announcements', () => {
  // arrange
  const given = (
    <button>
      <Spinner decorative />
      Saving…
    </button>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('button', { name: 'Saving…' })).toBeVisible();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
});

it.each(['small', 'medium', 'large'] as const)(
  'exposes the %s size with unchanged status text',
  (size) => {
    // arrange
    const given = <Spinner size={size} label="Loading projects…" />;

    // act
    render(given);

    // assert
    expect(screen.getByRole('status')).toHaveClass(`fs-spinner--${size}`);
    expect(screen.getByRole('status')).toHaveTextContent('Loading projects…');
  },
);

it('forwards native span refs and scoped styling', () => {
  // arrange
  const ref = createRef<HTMLSpanElement>();
  const given = (
    <Spinner
      ref={ref}
      id="loading"
      className="custom"
      style={{ '--fs-spinner-label-gap': '12px' }}
    />
  );

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByRole('status'));
  expect(ref.current).toHaveClass('custom');
  expect(ref.current).toHaveStyle('--fs-spinner-label-gap: 12px');
});

it('preserves hidden semantics for the complete widget', () => {
  // arrange
  const given = <Spinner hidden />;

  // act
  render(given);

  // assert
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

it('keeps status and non-focusable semantics for untyped native overrides', () => {
  // arrange
  const overrides = {
    role: 'progressbar',
    'aria-valuenow': 40,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-valuetext': '40 percent',
    'aria-label': 'Other',
    'aria-labelledby': 'other',
    'aria-hidden': true,
    'aria-live': 'assertive',
    'aria-atomic': false,
    tabIndex: 0,
    contentEditable: true,
  } as unknown as SpinnerProps;

  // act
  render(<Spinner {...overrides} />);

  // assert
  expect(screen.getByRole('status')).not.toHaveAttribute('tabindex');
  expect(screen.getByRole('status')).not.toHaveAttribute('aria-valuenow');
  expect(screen.getByRole('status')).not.toHaveAttribute('contenteditable');
  expect(screen.getByRole('status')).toHaveTextContent('Loading…');
});

it('updates status text when the consumer changes its loading task', () => {
  // arrange
  const { rerender } = render(<Spinner label="Loading projects…" />);

  // act
  rerender(<Spinner label="Loading activity…" />);

  // assert
  expect(screen.getByRole('status')).toHaveTextContent('Loading activity…');
});

it('removes the status when the consumer unmounts the spinner', () => {
  // arrange
  const { unmount } = render(<Spinner />);

  // act
  unmount();

  // assert
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
