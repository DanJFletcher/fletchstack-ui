import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Menu } from '../Menu';
import {
  AdvancedMenu,
  ControlledMenu,
  MenuExample,
  ProjectMenu,
  projectMenuItems,
} from './menu-examples';
import './menu.stories.css';

const meta = {
  id: 'components-menu',
  title: 'Components/Navigation/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: {
    triggerLabel: 'Project actions',
    menuLabel: 'Project actions',
    items: projectMenuItems(() => {}),
  },
  argTypes: { items: { control: false }, onOpenChange: { control: false } },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'An ARIA action menu with native links and recursive submenus. Defaults: collapsed, closeOnSelect=true, emptyMessage="No actions available.". Supply triggerLabel, menuLabel and typed items. Item labels remain visible; icons are decorative. Enter/Space opens; arrows, Home/End and buffered typeahead move within a level; Escape/Left return; Tab dismisses. Child panels flip/clamp on desktop and become inline at 600px. Consumers own actions and controlled open state. onSelect(event).preventDefault() retains the menu and cancels native link navigation. Import tokens, menu.css and button.css/icon.css as used, or combined styles. See docs/menu.md.',
      },
    },
  },
} satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Composition: Story = {
  render: () => <MenuExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const corporate = within(canvas.getByRole('region', { name: 'Corporate' }));
    corporate.getByRole('menuitem', { name: 'Export' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(corporate.getByRole('menuitem', { name: 'Download PDF' })).toHaveFocus();
    const luna = within(canvas.getByRole('region', { name: 'Luna' }));
    luna.getByRole('menuitem', { name: 'Export' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(luna.getByRole('menuitem', { name: 'Download PDF' })).toHaveFocus();
  },
};
export const KeyboardRoundTrip: Story = {
  render: () => <ProjectMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Project actions' });
    trigger.focus();
    await userEvent.keyboard('{Enter}{ArrowDown}{ArrowRight}');
    await expect(canvas.getByRole('menuitem', { name: 'Download PDF' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(canvas.getByRole('menuitem', { name: 'Export' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
  },
};
export const DeepBranches: Story = { render: () => <AdvancedMenu /> };
export const Controlled: Story = { render: () => <ControlledMenu /> };
export const KeepOpen: Story = { render: () => <ProjectMenu closeOnSelect={false} /> };
export const Empty: Story = { args: { items: [], defaultOpen: true } };
export const Narrow: Story = {
  render: () => <ProjectMenu />,
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
