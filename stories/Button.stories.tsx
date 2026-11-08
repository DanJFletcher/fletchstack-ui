import { createRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from '../src';

const meta = {
  title: 'Components/Button', component: Button, tags: ['autodocs'],
  args: { children: 'Save changes', onClick: fn() },
  argTypes: { variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] }, size: { control: 'select', options: ['small', 'medium', 'large'] } },
  parameters: { docs: { description: { component: 'Primary commits the main action. Secondary offers an alternative. Ghost is for low-emphasis actions. Use explicit type="submit" in forms. Parents own placement and sibling spacing; Button owns its label/icon gap and padding.' } } },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const VariantsAndSizes: Story = {
  render: () => <div className="stack"><header><h1>One action. Two atmospheres.</h1><p>Choose emphasis by purpose. Each size grows with its label; wrappers supply the spacing.</p></header>
    {(['primary', 'secondary', 'ghost'] as const).map(variant => <section key={variant}><h2>{variant}</h2><div className="actions">
      {(['small', 'medium', 'large'] as const).map(size => <Button key={size} variant={variant} size={size}>{size} action</Button>)}
    </div></section>)}
  </div>,
};

export const KeyboardActivation: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Save changes' });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await expect(button.matches(':focus-visible')).toBe(true);
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: args => <div className="actions"><Button {...args} /><Button variant="secondary" disabled>Cancel</Button><Button variant="ghost" disabled>Learn more</Button></div>,
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Save changes' });
    await userEvent.click(button);
    await userEvent.tab();
    await expect(button).toBeDisabled();
    await expect(button).not.toHaveFocus();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/**
 * Keep native form outcomes visible without navigating the preview.
 **/
function FormExample() {
  const [status, setStatus] = useState('No submission');

  return <form className="stack" onSubmit={event => { event.preventDefault(); setStatus('Submitted'); }} onReset={() => setStatus('Reset')}>
    <div className="actions"><Button>Ordinary action</Button><Button type="submit">Submit changes</Button><Button type="reset" variant="secondary">Reset changes</Button></div>
    <output aria-live="polite">{status}</output>
  </form>;
}

export const NativeForm: Story = {
  render: () => <FormExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Ordinary action' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('No submission');
    await userEvent.click(canvas.getByRole('button', { name: 'Submit changes' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Submitted');
    await userEvent.click(canvas.getByRole('button', { name: 'Reset changes' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Reset');
  },
};

/**
 * A decorative moon that inherits the label color without entering its name.
 **/
function MoonIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.4 15.4A8.5 8.5 0 0 1 8.6 3.6 9 9 0 1 0 20.4 15.4Z" /></svg>;
}

export const Composition: Story = {
  render: () => <div className="stack"><h1>Make room for the next step</h1><p>A parent flex wrapper supplies the gap. Icons are children, not a special Button API.</p><div className="actions">
    <Button><MoonIcon /><span>Save changes</span></Button><Button variant="secondary">Cancel</Button><Button variant="ghost">Learn more</Button><Button variant="secondary" aria-label="Switch to night mode"><MoonIcon /></Button>
  </div></div>,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Switch to night mode' })).toBeVisible();
  },
};

export const LongLabels: Story = {
  render: () => <div className="stack narrow"><h2>Room to grow</h2><Button><MoonIcon /><span>Save all changes and return to your account settings</span></Button><Button variant="secondary">ReviewYourAccountPreferencesBeforeContinuing</Button><Button size="small" variant="ghost">Read more about how these settings work</Button></div>,
};

export const BothThemes: Story = {
  render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel stack"><h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2>
    <div className="actions"><Button>Save changes</Button><Button variant="secondary">Cancel</Button><Button variant="ghost">Learn more</Button><Button disabled>Saved</Button></div>
  </section>)}</div>,
};

export const NestedTheme: Story = {
  render: () => <section data-theme="luna" className="theme-panel stack"><h2>Luna outer region</h2><Button>Outer action</Button><section data-theme="corporate" className="theme-panel stack"><h2>Corporate inner region</h2><Button>Inner action</Button><div data-theme="luna" className="theme-panel"><Button>Nested Luna action</Button></div></section></section>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Outer action' })).backgroundColor).toBe('rgb(199, 181, 255)');
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Inner action' })).backgroundColor).toBe('rgb(36, 75, 176)');
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Nested Luna action' })).backgroundColor).toBe('rgb(199, 181, 255)');
  },
};

export const ConsumerOverride: Story = {
  render: () => <div data-theme="corporate" className="theme-panel stack"><h2>Your brand, same control</h2><div className="actions consumer-brand"><Button>Forest brand action</Button><Button style={{ '--fs-button-radius': '0px' }}>Local square override</Button></div><Button>Unmodified sibling</Button></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Forest brand action' })).backgroundColor).toBe('rgb(20, 98, 61)');
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Local square override' })).borderRadius).toBe('0px');
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Unmodified sibling' })).backgroundColor).toBe('rgb(36, 75, 176)');
  },
};

export const RefAccess: Story = {
  render: () => {
    const ref = createRef<HTMLButtonElement>();

    return <div className="actions"><Button variant="secondary" onClick={() => ref.current?.focus()}>Focus the next action</Button><Button ref={ref}>Target action</Button></div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Focus the next action' }));
    await expect(canvas.getByRole('button', { name: 'Target action' })).toHaveFocus();
  },
};

export const LunaVariants: Story = { ...VariantsAndSizes, globals: { theme: 'luna' } };
export const LunaKeyboard: Story = { ...KeyboardActivation, globals: { theme: 'luna' } };
export const LunaDisabled: Story = { ...Disabled, globals: { theme: 'luna' } };
export const LunaLongLabels: Story = { ...LongLabels, globals: { theme: 'luna' } };
export const InteractionStates: Story = {
  render: () => <div className="stack"><h1>Explore each state</h1><p>Hover for feedback, press and hold for active styling, then use Tab for the visible focus ring. Switch the toolbar to compare themes. Disabled controls ignore activation.</p><div className="actions"><Button>Primary action</Button><Button variant="secondary">Secondary action</Button><Button variant="ghost">Ghost action</Button><Button disabled>Disabled action</Button></div></div>,
};
