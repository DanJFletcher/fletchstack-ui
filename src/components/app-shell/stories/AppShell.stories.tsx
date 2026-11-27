import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppShell } from '../AppShell';
import { ShellExample } from '../../bottom-navigation/stories/bottom-navigation-examples';
import docs from '../../../../docs/app-shell.md?raw';
import '../../bottom-navigation/stories/bottom-navigation.stories.css';

const meta = {
  id: 'components-app-shell',
  title: 'Components/Layout/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  args: { children: 'Page content' },
  argTypes: { children: { control: false } },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component: `${docs.replaceAll('./app-shell.md', '?path=/docs/components-app-shell--docs').replaceAll('./app-content.md', '?path=/docs/components-app-content--docs').replaceAll('./bottom-navigation.md', '?path=/docs/components-bottom-navigation--docs')}

[BottomNavigation](?path=/docs/components-bottom-navigation--docs) · [AppShell](?path=/docs/components-app-shell--docs) · [AppContent](?path=/docs/components-app-content--docs)`,
      },
    },
  },
} satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = { render: () => <ShellExample /> };
export const Composition: Story = { render: () => <ShellExample longLabels inset="24px" /> };
export const Viewport: Story = { render: () => <ShellExample height="viewport" /> };
