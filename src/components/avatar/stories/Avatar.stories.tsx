import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Avatar } from '../../../index';
import { AvatarExamples, AvatarShapes, AvatarSizes, AvatarSourceChanges } from './avatar-examples';
import './avatar.stories.css';

const meta = {
  id: 'components-avatar',
  title: 'Components/Identity/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'Maya Chen' },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large', 'xlarge'] },
    shape: { control: 'select', options: ['circle', 'rounded', 'square'] },
  },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Passive identity image with generated or custom initials while loading or after failure. Sizes are 24/32/48/64px; circle, rounded and square shapes retain their footprint. Name labels the whole image; alt overrides it and alt="" makes it decorative beside a visible name. No automatic keyboard stop or live announcement. Parents own profile text, actions and spacing.',
      },
    },
  },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const ImageFallback: Story = {
  render: () => (
    <div className="actions">
      <Avatar
        name="Maya Chen"
        src={new URL('./portrait.svg', import.meta.url).href}
        size="xlarge"
      />
      <Avatar name="Maya Chen" size="xlarge" />
      <Avatar name="Maya Chen" initials="M" size="xlarge" />
      <Avatar name="Unavailable photo" src="data:image/png;base64,broken" size="xlarge" />
    </div>
  ),
};
export const Sizes: Story = { render: () => <AvatarSizes /> };
export const Shapes: Story = { render: () => <AvatarShapes /> };
export const BothThemes: Story = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel stack">
          <h2>{theme}</h2>
          <AvatarSizes />
          <AvatarShapes />
        </section>
      ))}
    </div>
  ),
};
export const Composition: Story = { render: () => <AvatarExamples /> };
export const SourceChanges: Story = {
  render: () => <AvatarSourceChanges />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Maya Chen' })).toHaveTextContent('MC');
    await userEvent.click(canvas.getByRole('button', { name: 'Use available photo' }));
    await expect(canvas.getByRole('img', { name: 'Maya Chen' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Use failed photo' }));
    await expect(canvas.getByRole('img', { name: 'Maya Chen' })).toHaveTextContent('MC');
  },
};
export const Customization: Story = {
  args: {
    initials: 'M',
    shape: 'rounded',
    style: {
      '--fs-avatar-size': '80px',
      '--fs-avatar-background': 'var(--fs-text)',
      '--fs-avatar-text': 'var(--fs-surface)',
    },
  },
};
export const Hidden: Story = {
  args: { hidden: true },
  render: (args) => (
    <div>
      <p>The native hidden attribute removes the avatar from layout.</p>
      <Avatar {...args} />
    </div>
  ),
};
export const Decorative: Story = {
  render: () => (
    <div className="actions">
      <Avatar name="Maya Chen" alt="" />
      <span>Maya Chen</span>
    </div>
  ),
};
