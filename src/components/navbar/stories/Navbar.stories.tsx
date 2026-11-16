import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Navbar } from '../Navbar';
import { NavbarAllVisible, NavbarControlled, NavbarExample, NavbarIdentity, NavbarResources, ProjectNavbar } from './navbar-examples';
import './navbar.stories.css';

const meta = { id: 'components-navbar', title: 'Components/Navigation/Navbar', component: Navbar, tags: ['autodocs'],
  args: { children: <><Navbar.Item><a href="#docs">Docs</a></Navbar.Item><Navbar.Item mobilePlacement="bar"><a href="#support">Support</a></Navbar.Item></>, 'aria-label': 'Primary' },
  argTypes: { children: { control: false } },
  parameters: { a11y: { test: 'error' }, docs: { description: { component: 'Native container-responsive navigation. Compose Navbar.Brand and Navbar.Item once; children retain local state when the container shrinks or the disclosure toggles. Item mobilePlacement defaults to menu; bar items stay visible. Defaults: menuLabel="Menu", defaultOpen=false. Controlled open requests use onOpenChange. See docs/navbar.md for public types, CSS imports, groups, native links and keyboard behavior.' } } },
} satisfies Meta<typeof Navbar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Composition: Story = { render: () => <NavbarExample /> };
export const Compact: Story = { render: () => <ProjectNavbar />, decorators: [Story => <div style={{ maxWidth: 400 }}><Story /></div>], play: async ({ canvasElement }) => {
  const canvas = within(canvasElement), trigger = await canvas.findByRole('button', { name: 'Menu' });
  await userEvent.click(trigger); await expect(canvas.getByRole('link', { name: 'What we do' })).toBeVisible();
  await userEvent.click(canvas.getByRole('switch', { name: 'Dark mode' })); await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await userEvent.keyboard('{Escape}'); await expect(trigger).toHaveFocus();
} };
export const TypedResources: Story = { render: () => <NavbarResources /> };
export const Controlled: Story = { render: () => <NavbarControlled />, decorators: [Story => <div style={{ maxWidth: 400 }}><Story /></div>] };
export const AllVisible: Story = { render: () => <NavbarAllVisible />, decorators: [Story => <div style={{ maxWidth: 320 }}><Story /></div>] };
export const IdentityAcrossLayouts: Story = { render: () => <NavbarIdentity /> };
export const ScopedOverrides: Story = { render: () => <><ProjectNavbar aria-label="Custom" style={{ '--fs-navbar-radius': '24px', '--fs-navbar-gap': '32px' }} /><ProjectNavbar aria-label="Neighbor" /></> };
