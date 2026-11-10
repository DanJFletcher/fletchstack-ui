// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Cluster } from '../../../../src/components/cluster/Cluster';

it.each(['none', 'actions', 'related'] as const)('hydrates the %s relationship while preserving native attributes and child order', gap => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const given = <Cluster ref={ref} gap={gap} align="baseline" justify="end" id="actions" className="custom" style={{ '--fs-space-gap-actions': '24px' }} data-testid="layout"><button>Save</button><button>Preview</button></Cluster>;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);
  const onRecoverableError = vi.fn();

  // act
  render(given, { container, hydrate: true, onRecoverableError });

  // assert
  expect(ref.current).toBe(screen.getByTestId('layout'));
  expect(ref.current).toHaveAttribute('id', 'actions');
  expect(ref.current).toHaveClass('custom', `fs-cluster--gap-${gap}`);
  expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['Save', 'Preview']);
  expect(onRecoverableError).not.toHaveBeenCalled();
});

it('server renders deterministic passive defaults without spacer nodes', () => {
  // arrange
  const given = <Cluster><button>Save</button><button>Preview</button></Cluster>;
  const expected = renderToString(given);

  // act
  const result = renderToString(given);

  // assert
  expect(result).toBe(expected);
  expect(result).toContain('fs-cluster--gap-actions fs-cluster--align-center fs-cluster--justify-start');
  expect(result).toContain('<button>Save</button><button>Preview</button>');
  expect(result).not.toMatch(/role=|tabindex=/);
});
