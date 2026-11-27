import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { Icon } from '../Icon';

it('produces deterministic SVG markup without browser globals', () => {
  // arrange
  const given = (
    <Icon label="Moon">
      <path d="M4 4h16v16H4Z" />
    </Icon>
  );
  const expected = renderToString(given);

  // act
  const result = renderToString(given);

  // assert
  expect(result).toBe(expected);
  expect(result).toContain('role="img" aria-label="Moon"');
  expect(result).toContain('viewBox="0 0 24 24"');
});
