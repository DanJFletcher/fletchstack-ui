import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { BottomNavigation } from '../BottomNavigation';
import { BottomNavigationExample, ChangingDestination, NativeDestinations, NavigationOverrides, RouterExample, ShellExample } from './bottom-navigation-examples';
import docs from '../../../../docs/bottom-navigation.md?raw';
import './bottom-navigation.stories.css';

const meta = { id: 'components-bottom-navigation', title: 'Components/Navigation/BottomNavigation', component: BottomNavigation, tags: ['autodocs'],
  args: { 'aria-label': 'Primary', children: <BottomNavigation.Item><a href="#home">Home</a></BottomNavigation.Item> },
  argTypes: { children: { control: false } },
  parameters: { a11y: { test: 'error' }, docs: { description: { component: `${docs.replaceAll('./app-shell.md', '?path=/docs/components-app-shell--docs').replaceAll('./app-content.md', '?path=/docs/components-app-content--docs').replaceAll('./bottom-navigation.md', '?path=/docs/components-bottom-navigation--docs')}\n\n[AppShell](?path=/docs/components-app-shell--docs) · [AppContent](?path=/docs/components-app-content--docs)` } } },
} satisfies Meta<typeof BottomNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = { render: () => <NativeDestinations /> };
export const Composition: Story = { render: () => <BottomNavigationExample /> };
export const HelpCurrent: Story = { render: () => <NativeDestinations current="help" /> };
export const KeyboardFocus: Story = { render: () => <NativeDestinations />, play: async ({ canvasElement }) => {
  const home = within(canvasElement).getByRole('link', { name: 'Home' });
  home.focus(); await userEvent.tab(); await userEvent.tab();
  await expect(within(canvasElement).getByRole('link', { name: 'Help' })).toHaveFocus();
  await expect(within(canvasElement).getByRole('link', { name: 'Inbox' })).toHaveAttribute('aria-current', 'page');
} };
export const CurrentChanges: Story = { render: () => <ChangingDestination /> };
export const RouterLinks: Story = { render: () => <RouterExample /> };
export const LongLabels: Story = { render: () => <div style={{ maxWidth: 280 }}><NativeDestinations long /></div> };
export const ScopedOverrides: Story = { render: () => <NavigationOverrides /> };
export const AppLayout: Story = { render: () => <ShellExample /> };
