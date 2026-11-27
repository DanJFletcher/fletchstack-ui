import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { AvatarGroup } from '../AvatarGroup';
import { AvatarGroupExample, AvatarGroupSizes, teamMembers } from './avatar-group-examples';
import './avatar-group.stories.css';

const meta = {
  id: 'components-avatar-group',
  title: 'Components/Identity/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  args: { label: 'Project team', members: teamMembers },
  argTypes: {
    members: { control: false },
    size: { control: 'select', options: ['small', 'medium', 'large', 'xlarge'] },
    maxVisible: { control: { type: 'number', min: 0 } },
  },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Ordered shared Avatars with 32px default footprints, 8px overlap, and 2px separating rings. Native details/summary reveals the hidden names. maxVisible=0 shows a count-only disclosure. Import avatar.css alongside avatar-group.css and tokens, or use combined styles.',
      },
    },
  },
} satisfies Meta<typeof AvatarGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const TeamMembers: Story = {};
export const OverflowDisclosure: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const summary = canvas.getByText('+3');
    await userEvent.click(summary);
    await expect(canvas.getByRole('list', { name: 'Additional team members' })).toBeVisible();
    await expect(canvas.getByText('Ari Morgan')).toBeVisible();
    await userEvent.click(summary);
    await expect(canvas.getByText('Ari Morgan')).not.toBeVisible();
  },
};
export const SmallGroup: Story = { args: { members: teamMembers.slice(0, 2) } };
export const AllMembersHidden: Story = {
  args: { maxVisible: 0, overflowLabel: 'View all 6 assigned editors' },
};
export const Sizes: Story = { render: () => <AvatarGroupSizes /> };
export const BothThemes: Story = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel">
          <h2>{theme}</h2>
          <AvatarGroup label={`${theme} team`} members={teamMembers} />
        </section>
      ))}
    </div>
  ),
};
export const Composition: Story = { render: () => <AvatarGroupExample /> };
export const Empty: Story = { args: { members: [] } };
export const Hidden: Story = { args: { hidden: true } };
export const Customization: Story = {
  args: {
    style: { '--fs-avatar-group-overlap': '4px', '--fs-avatar-group-ring-color': 'var(--fs-text)' },
  },
};
