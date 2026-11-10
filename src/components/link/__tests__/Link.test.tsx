// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Link } from '../Link';

it('announces an explicit new-tab destination', () => {
  // arrange
  const given = <Link href="https://example.com/docs" target="_blank">Read documentation</Link>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('link', { name: 'Read documentation' })).toHaveAccessibleDescription('Opens in a new tab.');
});

it('keeps external destinations in the current tab unless explicitly requested', () => {
  // arrange
  const given = <Link href="https://example.com/docs" icon={<span>Destination</span>}>Documentation</Link>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('link', { name: 'Documentation' })).not.toHaveAttribute('target');
  expect(screen.getByRole('link')).not.toHaveAccessibleDescription();
});

it('preserves caller context when announcing a case-insensitive new-tab target', () => {
  // arrange
  const given = <><p id="context">Reference material.</p><Link href="/docs" target="_BLANK" rel="noreferrer author" aria-describedby="context">Documentation</Link></>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('link')).toHaveAccessibleDescription('Reference material. Opens in a new tab.');
  expect(screen.getByRole('link')).toHaveAttribute('rel', 'noreferrer author noopener');
});

it('preserves native named targets and relationships', () => {
  // arrange
  const given = <Link href="/docs" target="reference-window" rel="author">Documentation</Link>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('link')).toHaveAttribute('target', 'reference-window');
  expect(screen.getByRole('link')).toHaveAttribute('rel', 'author');
  expect(screen.getByRole('link')).not.toHaveAccessibleDescription();
});

it('preserves an empty-string href for native current-page navigation', () => {
  // arrange
  const given = <Link href="">Current page</Link>;

  // act
  render(given);

  // assert
  expect(screen.getByText('Current page')).toHaveAttribute('href', '');
});

it('renders unavailable text without a hyperlink role', () => {
  // arrange
  const given = <Link target="_blank" rel="author" tabIndex={0}>Documentation</Link>;

  // act
  render(given);

  // assert
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
  expect(screen.getByText('Documentation')).not.toHaveAttribute('tabindex');
  expect(screen.getByText('Documentation')).not.toHaveAttribute('target');
  expect(screen.getByText('Documentation')).not.toHaveAttribute('rel');
});

it('does not activate an unavailable destination', async () => {
  // arrange
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(<Link onClick={onClick}>Documentation</Link>);

  // act
  await user.click(screen.getByText('Documentation'));

  // assert
  expect(onClick).not.toHaveBeenCalled();
});

it('does not handle auxiliary activation without a destination', () => {
  // arrange
  const onAuxClick = vi.fn();
  render(<Link onAuxClick={onAuxClick}>Documentation</Link>);

  // act
  fireEvent(screen.getByText('Documentation'), new MouseEvent('auxclick', { bubbles: true, button: 1 }));

  // assert
  expect(onAuxClick).not.toHaveBeenCalled();
});

it('preserves modified native click events for consumers', () => {
  // arrange
  const onClick = vi.fn(event => event.preventDefault());
  render(<Link href="/docs" onClick={onClick}>Documentation</Link>);

  // act
  fireEvent.click(screen.getByRole('link'), { ctrlKey: true });

  // assert
  expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ ctrlKey: true }));
});

it('forwards native download attributes and a native anchor ref', () => {
  // arrange
  const ref = createRef<HTMLAnchorElement>();
  const given = <Link ref={ref} href="/guide.pdf" download="guide.pdf" className="custom" variant="standalone" style={{ '--fs-link-icon-gap': '12px' }}>Download guide</Link>;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByRole('link'));
  expect(ref.current).toHaveAttribute('download', 'guide.pdf');
  expect(ref.current).toHaveClass('fs-link--standalone', 'custom');
  expect(ref.current).toHaveStyle('--fs-link-icon-gap: 12px');
});

it('assigns independent announcements to repeated new-tab links', () => {
  // arrange
  const given = <><Link href="/first" target="_blank">First</Link><Link href="/second" target="_blank">Second</Link></>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('link', { name: 'First' }).getAttribute('aria-describedby')).not.toBe(screen.getByRole('link', { name: 'Second' }).getAttribute('aria-describedby'));
});

it('preserves native hidden behavior', () => {
  // arrange
  const given = <Link href="/docs" hidden>Documentation</Link>;

  // act
  render(given);

  // assert
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
