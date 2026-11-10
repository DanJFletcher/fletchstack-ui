import { createRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ArrowRightIcon, Button, ExternalLinkIcon, Link } from '../../../index';

const meta = {
  id: 'components-link', title: 'Components/Navigation/Link', component: Link, tags: ['autodocs'],
  args: { href: '#documentation', children: 'View documentation' },
  parameters: { a11y: { test: 'error' }, docs: { description: { component: 'Native navigation with inherited typography and a visible underline. Supports inline/standalone use, optional decorative icons, native anchor refs/attributes, and independent link.* tokens. External icons do not infer a new tab. Explicit _blank targets announce their behavior and preserve caller descriptions and rel values with noopener. Omit href for unavailable text. Browser history owns :visited; privacy restrictions prevent reliable automated inspection of visited colors. Parents own sibling spacing.' } } },
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Standalone: Story = { args: { variant: 'standalone', children: 'View all components', icon: <ArrowRightIcon /> } };
export const ExternalDestination: Story = { args: { href: 'https://example.com/docs', children: 'Read documentation', icon: <ExternalLinkIcon /> } };
export const NewTab: Story = {
  render: () => <div className="stack"><p id="reference-context">Reference material.</p><Link href="#documentation" target="_blank" rel="noreferrer" aria-describedby="reference-context" icon={<ExternalLinkIcon />}>Read documentation</Link><section id="documentation"><h2>Documentation</h2><p>This example opens in a new tab only when explicitly activated.</p></section></div>,
};
export const Unavailable: Story = { args: { href: undefined, children: 'Unavailable documentation' } };
export const States: Story = {
  render: () => <div className="stack"><Link href="#states">View documentation</Link><Link href="#states" target="_blank">Documentation in a new tab</Link><Link>Unavailable documentation</Link><p id="states">Hover, focus, or press a link to see its native interaction state. Browser history controls visited styling.</p></div>,
};
export const Usage: Story = {
  render: () => <div className="stack"><p>Review our <Link href="#privacy">privacy policy</Link> before continuing.</p><Link href="#components" variant="standalone" icon={<ArrowRightIcon />}>View all components</Link><section id="privacy"><h2>Privacy policy</h2><p>Inline links wrap with the surrounding paragraph.</p></section><section id="components"><h2>Component index</h2></section></div>,
};
export const Keyboard: Story = {
  render: () => <div className="stack"><Link href="#keyboard-destination">First destination</Link><Link tabIndex={0}>Unavailable destination</Link><Link href="#keyboard-destination">Second destination</Link><section id="keyboard-destination"><h2>Keyboard destination</h2></section></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'First destination' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Second destination' })).toHaveFocus();
  },
};
export const BothThemes: Story = {
  render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel stack"><h2>{theme}</h2><p>Review our <Link href={`#${theme}-privacy`}>privacy policy</Link> before continuing.</p><Link href={`#${theme}-components`} variant="standalone" icon={<ArrowRightIcon />}>View all components</Link><Link href="#documentation" target="_blank" icon={<ExternalLinkIcon />}>Read documentation</Link><Link>Unavailable documentation</Link></section>)}</div>,
};
export const Customization: Story = { args: { className: 'custom-link', variant: 'standalone', icon: <ArrowRightIcon />, style: { '--fs-link-icon-gap': '12px', '--fs-link-underline-width': '2px' } } };
export const Download: Story = { args: { href: 'data:text/plain,Component%20guide', download: 'component-guide.txt', children: 'Download component guide' } };
export const EmptyDestination: Story = { args: { href: '', children: 'Current page' } };
export const NamedTarget: Story = { args: { href: '#documentation', target: 'documentation-window', rel: 'author', children: 'Documentation window' } };
export const RefAccess: Story = {
  render: () => {
    const link = createRef<HTMLAnchorElement>();

    return <div className="stack"><Button onClick={() => link.current?.focus()}>Focus documentation</Button><Link href="#documentation" ref={link}>View documentation</Link></div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Focus documentation' }));
    await expect(canvas.getByRole('link', { name: 'View documentation' })).toHaveFocus();
  },
};
export const LongText: Story = { args: { children: 'Read the complete documentation for every shared component in this workspace before continuing', icon: <ArrowRightIcon /> } };
