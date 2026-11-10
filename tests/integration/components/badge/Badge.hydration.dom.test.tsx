// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Badge, CheckIcon, type BadgeProps } from '../../../../src/index';

it('hydrates a published badge with decorative artwork and native attributes intact', () => {
  // arrange
  const ref = createRef<HTMLSpanElement>();
  const given = <Badge ref={ref} tone="success" className="custom" icon={<CheckIcon />} id="published" style={{ '--fs-badge-padding-inline': '12px' }}>Published</Badge>;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);
  const onRecoverableError = vi.fn();

  // act
  render(given, { container, hydrate: true, onRecoverableError });

  // assert
  expect(ref.current).toBe(container.firstElementChild);
  expect(screen.getByText('Published')).toBeVisible();
  expect(ref.current).toHaveClass('custom');
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  expect(onRecoverableError).not.toHaveBeenCalled();
});

it.each(['neutral', 'info', 'success', 'warning', 'danger'] as const)('server renders the %s tone deterministically', tone => {
  // arrange
  const given = <Badge tone={tone}>{12}</Badge>;
  const expected = renderToString(given);

  // act
  const result = renderToString(given);

  // assert
  expect(result).toBe(expected);
  expect(result).toContain(`fs-badge--${tone}`);
  expect(result).toContain('>12<');
});

it('keeps zero visible without introducing live, focus, or action semantics from untyped props', () => {
  // arrange
  const given = { role: 'button', tabIndex: 0, 'aria-live': 'polite', onClick: vi.fn(), title: 'Unread count' } as unknown as BadgeProps;

  // act
  const result = renderToString(<Badge {...given}>{0}</Badge>);

  // assert
  expect(result).toContain('>0<');
  expect(result).toContain('title="Unread count"');
  expect(result).not.toMatch(/role=|tabindex=|aria-live=|onclick=/);
});
