// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Container } from '../../../../src/components/container/Container';

it.each(['reading', 'content', 'wide'] as const)(
  'hydrates the %s layout while preserving native attributes, children and refs',
  (size) => {
    // arrange
    const ref = createRef<HTMLDivElement>();
    const given = (
      <Container
        ref={ref}
        size={size}
        gutters={false}
        id="project"
        className="custom"
        style={{ '--fs-container-max-width-content': '900px' }}
        data-testid="layout"
      >
        <p>Project overview</p>
      </Container>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(given);
    document.body.appendChild(container);
    const onRecoverableError = vi.fn();

    // act
    render(given, { container, hydrate: true, onRecoverableError });

    // assert
    expect(ref.current).toBe(screen.getByTestId('layout'));
    expect(ref.current).toHaveAttribute('id', 'project');
    expect(ref.current).toHaveClass('custom', `fs-container--${size}`);
    expect(screen.getByText('Project overview')).toBeVisible();
    expect(onRecoverableError).not.toHaveBeenCalled();
  },
);

it('server renders deterministic default layout without client state or extra semantics', () => {
  // arrange
  const given = (
    <Container>
      <p>Article content</p>
    </Container>
  );
  const expected = renderToString(given);

  // act
  const result = renderToString(given);

  // assert
  expect(result).toBe(expected);
  expect(result).toContain('fs-container--content fs-container--gutters');
  expect(result).not.toMatch(/role=|tabindex=/);
});
