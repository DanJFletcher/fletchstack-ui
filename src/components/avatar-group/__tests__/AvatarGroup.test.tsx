// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { AvatarGroup, type AvatarGroupProps } from '../AvatarGroup';

const members = [
  { id: 'a', name: 'Alex Example' },
  { id: 'b', name: 'Blair Sample', initials: 'B' },
  { id: 'c', name: 'Casey Demo' },
  { id: 'd', name: 'Drew Example' },
  { id: 'e', name: 'Emery Sample' },
];

it('names the group and preserves the first three members in order by default', () => {
  // act
  render(<AvatarGroup label="Editors" members={members} />);
  // assert
  expect(
    within(screen.getByRole('group', { name: 'Editors' }))
      .getAllByRole('img')
      .map((image) => image.getAttribute('aria-label')),
  ).toEqual(['Alex Example', 'Blair Sample', 'Casey Demo']);
  expect(screen.getByLabelText('Show 2 more members')).toHaveTextContent('+2');
});

it.each([
  { maxVisible: 0, expected: 0 },
  { maxVisible: -2, expected: 0 },
  { maxVisible: 1.9, expected: 1 },
  { maxVisible: 99, expected: 5 },
  { maxVisible: Number.NaN, expected: 3 },
  { maxVisible: Infinity, expected: 3 },
])('normalizes maxVisible $maxVisible', ({ maxVisible, expected }) => {
  // act
  render(<AvatarGroup label="Editors" members={members} maxVisible={maxVisible} />);
  // assert
  expect(screen.queryAllByRole('img')).toHaveLength(expected);
});

it('omits overflow when every member is visible', () => {
  // act
  render(<AvatarGroup label="Editors" members={members.slice(0, 2)} />);
  // assert
  expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
});

it('retains an empty named group without an empty disclosure', () => {
  // act
  render(<AvatarGroup label="Editors" members={[]} />);
  // assert
  expect(screen.getByRole('group', { name: 'Editors' }).textContent).toBe('');
});

it('uses a singular default disclosure name for one remaining member', () => {
  // act
  render(<AvatarGroup label="Editors" members={members} maxVisible={4} />);
  // assert
  expect(screen.getByLabelText('Show 1 more member')).toHaveTextContent('+1');
});

it('localizes the disclosure/list and exposes hidden names only on native expansion', async () => {
  // arrange
  const user = userEvent.setup();
  render(
    <AvatarGroup
      label="Editors"
      members={members}
      maxVisible={0}
      overflowLabel="View assigned editors"
      overflowListLabel="Assigned editors"
    />,
  );
  expect(screen.getByRole('list', { name: 'Assigned editors' })).not.toBeVisible();
  // act
  await user.click(screen.getByLabelText('View assigned editors'));
  // assert
  const list = screen.getByRole('list', { name: 'Assigned editors' });
  expect(
    within(list)
      .getAllByRole('listitem')
      .map((item) => item.textContent),
  ).toEqual([
    'AEAlex Example',
    'BBlair Sample',
    'CDCasey Demo',
    'DEDrew Example',
    'ESEmery Sample',
  ]);
  expect(within(list).queryAllByRole('img')).toHaveLength(0);
});

it('forwards descriptive styling/ref attributes without allowing owned content or identity overrides', () => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const props = {
    children: 'Override',
    role: 'button',
    'aria-label': 'Override',
    'aria-labelledby': 'elsewhere',
    dangerouslySetInnerHTML: { __html: 'Override' },
  } as unknown as AvatarGroupProps;
  // act
  render(
    <AvatarGroup
      {...props}
      label="Editors"
      members={members}
      ref={ref}
      title="People"
      className="custom"
      style={{ '--fs-avatar-group-overlap': '4px' }}
    />,
  );
  // assert
  expect(ref.current).toBe(screen.getByRole('group', { name: 'Editors' }));
  expect(ref.current).toHaveAttribute('title', 'People');
  expect(ref.current).toHaveClass('custom');
  expect(ref.current).not.toHaveAttribute('aria-labelledby');
  expect(screen.queryByText('Override')).not.toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Alex Example' })).not.toHaveAttribute('id');
});

it('updates visible members and removes stale disclosure content when the team changes', async () => {
  // arrange
  const user = userEvent.setup();
  const { rerender } = render(<AvatarGroup label="Editors" members={members} />);
  await user.click(screen.getByLabelText('Show 2 more members'));
  // act
  rerender(<AvatarGroup label="Editors" members={members.slice(0, 1)} />);
  // assert
  expect(screen.getAllByRole('img')).toHaveLength(1);
  expect(screen.queryByText('Drew Example')).not.toBeInTheDocument();
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});
