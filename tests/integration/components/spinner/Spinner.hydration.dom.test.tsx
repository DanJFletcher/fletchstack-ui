// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Button } from '../../../../src/components/button/Button';
import { Spinner } from '../../../../src/components/spinner/Spinner';

it('hydrates loading text without introducing keyboard focus or duplicate status roles', () => {
  // arrange
  const ref = createRef<HTMLSpanElement>();
  const given = <Spinner ref={ref} label="Loading projects…" size="large" className="custom" style={{ '--fs-spinner-label-gap': '12px' }} />;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);
  const onRecoverableError = vi.fn();

  // act
  render(given, { container, hydrate: true, onRecoverableError });

  // assert
  expect(ref.current).toBe(screen.getByRole('status'));
  expect(ref.current).toHaveTextContent('Loading projects…');
  expect(ref.current).not.toHaveAttribute('tabindex');
  expect(screen.getAllByRole('status')).toHaveLength(1);
  expect(onRecoverableError).not.toHaveBeenCalled();
});

it('keeps a loading button name free of decorative duplicate text', () => {
  // arrange
  const given = <Button disabled aria-busy="true"><Spinner decorative size="small" />Saving…</Button>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

it('preserves fallback status text in server-rendered HTML', () => {
  // arrange
  const given = <Spinner label="   " />;

  // act
  const result = renderToString(given);

  // assert
  expect(result).toContain('Loading…');
  expect(result).not.toContain('aria-valuenow');
});

it('server renders a hidden spinner without adding focus attributes', () => {
  // arrange
  const given = <Spinner hidden />;

  // act
  const result = renderToString(given);

  // assert
  expect(result).toContain('hidden=""');
  expect(result).not.toContain('tabindex');
});
