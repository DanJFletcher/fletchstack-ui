import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Kbd } from '../Kbd';
import { KbdGroup } from '../KbdGroup';
import { CommandKey, KbdExample, KbdButtonExample, KbdTooltipExample, KbdInputExample, KbdOverrides } from './kbd-examples';
import './kbd.stories.css';

const description = `Keyboard input displayed with a native kbd element. KbdGroup is an unboxed outer kbd for combinations or sequences. Both stay out of the tab order by default and install no shortcut listeners. Supply key labels, readable names for decorative symbols, and any separators as children.

Use Kbd inside a Button or Tooltip to hint at an application-owned command. The actual control owns focus, activation and aria-keyshortcuts. Do not nest interactive controls inside a keycap. Native attributes, refs, className and scoped style variables are forwarded. No variants or platform guessing.

Import kbd.css plus tokens, or styles.css. See docs/kbd.md for props, token roles, accessibility and composition.

Example: import Kbd and KbdGroup, then wrap individual keys in Kbd within a KbdGroup.`;
const meta = { id: 'components-kbd', title: 'Components/Typography/Kbd', component: Kbd, subcomponents: { KbdGroup }, tags: ['autodocs'], args: { children: 'Ctrl' }, parameters: { a11y: { test: 'error' }, docs: { description: { component: description } } } } satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Composition: Story = { render: () => <KbdExample /> };
export const Group: Story = { render: () => <p>Press <KbdGroup><Kbd>Ctrl</Kbd> + <Kbd>B</Kbd></KbdGroup> to format text.</p> };
export const Sequence: Story = { render: () => <p>Press <KbdGroup><Kbd>G</Kbd><span>then</span><Kbd>I</Kbd></KbdGroup> to open the inbox.</p> };
export const Symbols: Story = { render: () => <KbdGroup><CommandKey /><Kbd><span aria-hidden="true">⇧</span><span className="kbd-demo__sr-only">Shift</span></Kbd><Kbd>P</Kbd></KbdGroup> };
export const InButton: Story = { render: () => <KbdButtonExample />, play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.tab();
  await expect(canvas.getByRole('button', { name: 'Accept Enter' })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await expect(canvas.getByRole('status')).toHaveTextContent('Accepted 1 times');
} };
export const InTooltip: Story = { render: () => <KbdTooltipExample /> };
export const SearchHint: Story = { render: () => <KbdInputExample /> };
export const Customization: Story = { render: () => <KbdOverrides /> };
export const LongLabel: Story = { args: { children: 'VeryLongLocalizedKeyboardInputWithoutSpaces' }, decorators: [Story => <div style={{ maxWidth: 160 }}><Story /></div>] };
export const Rtl: Story = { render: () => <p dir="rtl">اختصار <KbdGroup dir="ltr"><Kbd>Ctrl</Kbd> + <Kbd>K</Kbd></KbdGroup></p> };
export const Hidden: Story = { args: { hidden: true }, render: args => <p>Hidden key: <Kbd {...args} /></p> };
export const Luna: Story = { globals: { theme: 'luna' } };
