// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { ArrowRightIcon } from '../../../../src/components/icon/named/ArrowRightIcon';
import { Link } from '../../../../src/components/link/Link';

it('hydrates a new-tab link with stable description relationships', () => {
  // arrange
  const ref = createRef<HTMLAnchorElement>();
  const given = <><p id="context">Reference material.</p><Link ref={ref} href="/docs" target="_blank" rel="author" aria-describedby="context" icon={<ArrowRightIcon />} variant="standalone" className="custom" style={{ '--fs-link-icon-gap': '12px' }}>Documentation</Link></>;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);
  const expected = container.querySelector('a')!.getAttribute('aria-describedby');
  const onRecoverableError = vi.fn();

  // act
  render(given, { container, hydrate: true, onRecoverableError });

  // assert
  expect(ref.current).toBe(screen.getByRole('link', { name: 'Documentation' }));
  expect(ref.current).toHaveAccessibleDescription('Reference material. Opens in a new tab.');
  expect(ref.current).toHaveAttribute('aria-describedby', expected);
  expect(onRecoverableError).not.toHaveBeenCalled();
});

it('server renders plain unavailable text without a keyboard stop', () => {
  // arrange
  const given = <Link target="_blank" tabIndex={0}>Unavailable documentation</Link>;

  // act
  const result = renderToString(given);

  // assert
  expect(result).toBe('<a class="fs-link fs-link--inline">Unavailable documentation</a>');
});

it('preserves native destinations and same-tab targets through the package API', () => {
  // arrange
  const given = <Link href="/docs" target="_self" rel="author">Documentation</Link>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('link')).toHaveAttribute('href', '/docs');
  expect(screen.getByRole('link')).not.toHaveAccessibleDescription();
});
