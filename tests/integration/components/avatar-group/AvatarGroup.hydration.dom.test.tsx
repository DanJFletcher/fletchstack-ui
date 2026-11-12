// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { AvatarGroup, type AvatarGroupProps } from '../../../../src/components/avatar-group/AvatarGroup';

const members = [
  { id: 'a', name: 'Alex Example' }, { id: 'b', name: 'Blair Sample', initials: 'B' },
  { id: 'c', name: 'Casey Demo' }, { id: 'd', name: 'Drew Example', src: '/pending.svg' },
];

it.each([
  { props: {}, count: 3 }, { props: { maxVisible: 0 }, count: 0 }, { props: { maxVisible: -1 }, count: 0 },
  { props: { maxVisible: 1.5 }, count: 1 }, { props: { maxVisible: Number.NaN }, count: 3 },
  { props: { maxVisible: 4 }, count: 4 }, { props: { members: [] }, count: 0 },
] satisfies { props: Partial<AvatarGroupProps>; count: number }[])('hydrates stable server structure for $props', ({ props, count }) => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const errors = vi.fn();
  const given = <AvatarGroup label="Editors" members={members} {...props} ref={ref} className="consumer" title="Team" style={{ '--fs-avatar-group-overlap': '4px' }} />;
  const container = document.createElement('div'); container.innerHTML = renderToString(given); document.body.appendChild(container);
  // act
  render(given, { container, hydrate: true, onRecoverableError: errors });
  // assert
  expect(screen.queryAllByRole('img')).toHaveLength(count);
  expect(ref.current).toBe(screen.getByRole('group', { name: 'Editors' }));
  expect(ref.current).toHaveClass('consumer');
  expect(ref.current).toHaveAttribute('title', 'Team');
  expect(errors).not.toHaveBeenCalled();
});

it('hydrates count-only localized disclosure without duplicate image names', () => {
  // arrange
  const given = <AvatarGroup label="Editors" members={members} maxVisible={0} overflowLabel="View editors" overflowListLabel="Editors list" size="large" />;
  const container = document.createElement('div'); container.innerHTML = renderToString(given); document.body.appendChild(container);
  const errors = vi.fn();
  // act
  render(given, { container, hydrate: true, onRecoverableError: errors });
  fireEvent.click(screen.getByLabelText('View editors'));
  // assert
  expect(screen.getByRole('list', { name: 'Editors list' })).toBeVisible();
  expect(screen.queryAllByRole('img')).toHaveLength(0);
  expect(errors).not.toHaveBeenCalled();
});

it('protects SSR ownership against untyped container overrides', () => {
  // arrange
  const invalid = { children: 'Override', role: 'button', 'aria-label': 'Override', 'aria-labelledby': 'Override', dangerouslySetInnerHTML: { __html: 'Override' } } as unknown as AvatarGroupProps;
  // act
  const result = renderToString(<AvatarGroup {...invalid} label="Editors" members={members} />);
  // assert
  expect(result).toContain('role="group"');
  expect(result).toContain('aria-label="Editors"');
  expect(result).not.toContain('Override');
});
