// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Stack } from '../../../../src/index';

it.each(['none', 'related', 'group', 'section'] as const)('hydrates the %s relationship with native attributes and a div ref', gap => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const given = <Stack gap={gap} align="start" ref={ref} id="settings" className="custom" style={{ '--fs-space-gap-related': '32px' }} data-testid="layout"><button>First</button><button>Second</button></Stack>;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);
  const onRecoverableError = vi.fn();

  // act
  render(given, { container, hydrate: true, onRecoverableError });

  // assert
  expect(ref.current).toBe(screen.getByTestId('layout'));
  expect(ref.current).toHaveAttribute('id', 'settings');
  expect(ref.current).toHaveClass('custom', `fs-stack--gap-${gap}`);
  expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['First', 'Second']);
  expect(onRecoverableError).not.toHaveBeenCalled();
});

it('server renders deterministic defaults without adding semantics or spacer nodes', () => {
  // arrange
  const given = <Stack><p>First</p><p>Second</p></Stack>;
  const expected = renderToString(given);

  // act
  const result = renderToString(given);

  // assert
  expect(result).toBe(expected);
  expect(result).toContain('fs-stack--gap-related fs-stack--align-stretch');
  expect(result).toContain('<p>First</p><p>Second</p>');
  expect(result).not.toMatch(/role=|tabindex=/);
});
