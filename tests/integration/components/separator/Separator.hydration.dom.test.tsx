// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Separator, type SeparatorProps } from '../../../../src/components/separator/Separator';

it.each(['horizontal', 'vertical'] as const)(
  'hydrates a semantic %s boundary without a focus stop',
  (orientation) => {
    // arrange
    const ref = createRef<HTMLDivElement>();
    const given = (
      <Separator
        ref={ref}
        orientation={orientation}
        decorative={false}
        className="custom"
        title="Boundary"
        style={{ '--fs-separator-thickness': '2px' }}
      />
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(given);
    document.body.appendChild(container);
    const onRecoverableError = vi.fn();

    // act
    render(given, { container, hydrate: true, onRecoverableError });

    // assert
    expect(ref.current).toBe(screen.getByRole('separator'));
    expect(ref.current).toHaveAttribute('aria-orientation', orientation);
    expect(ref.current).not.toHaveAttribute('tabindex');
    expect(onRecoverableError).not.toHaveBeenCalled();
  },
);

it('server renders decorative grouping without exposed separator semantics', () => {
  // arrange
  const given = <Separator />;

  // act
  const result = renderToString(given);

  // assert
  expect(result).toContain('aria-hidden="true"');
  expect(result).not.toContain('role=');
  expect(result).not.toContain('aria-orientation=');
});

it('preserves static semantics when an untyped consumer supplies widget overrides', () => {
  // arrange
  const given = {
    role: 'slider',
    tabIndex: 0,
    'aria-valuenow': 50,
    'aria-hidden': true,
    onClick: vi.fn(),
    title: 'Boundary',
  } as unknown as SeparatorProps;

  // act
  const result = renderToString(<Separator {...given} decorative={false} />);

  // assert
  expect(result).toContain('role="separator"');
  expect(result).toContain('aria-orientation="horizontal"');
  expect(result).toContain('title="Boundary"');
  expect(result).not.toMatch(/tabindex=|aria-valuenow=|aria-hidden=|onclick=/);
});
