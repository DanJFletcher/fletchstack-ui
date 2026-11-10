// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { SimpleGrid } from '../../../../src/index';

it.each(['none', 'related', 'group'] as const)('hydrates the %s relationship while preserving native attributes and child order', gap => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const given = <SimpleGrid ref={ref} gap={gap} id="actions" className="custom" style={{ '--fs-space-gap-related': '24px' }} data-testid="layout"><button>Save</button><button>Preview</button></SimpleGrid>;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);
  const onRecoverableError = vi.fn();

  // act
  render(given, { container, hydrate: true, onRecoverableError });

  // assert
  expect(ref.current).toBe(screen.getByTestId('layout'));
  expect(ref.current).toHaveAttribute('id', 'actions');
  expect(ref.current).toHaveClass('custom', `fs-simple-grid--gap-${gap}`);
  expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['Save', 'Preview']);
  expect(onRecoverableError).not.toHaveBeenCalled();
});

it('server renders deterministic passive defaults without spacer nodes', () => {
  // arrange
  const given = <SimpleGrid><button>Save</button><button>Preview</button></SimpleGrid>;
  const expected = renderToString(given);

  // act
  const result = renderToString(given);

  // assert
  expect(result).toBe(expected);
  expect(result).toContain('fs-simple-grid--gap-related');
  expect(result).toContain('<button>Save</button><button>Preview</button>');
  expect(result).not.toMatch(/role=|tabindex=/);
});
