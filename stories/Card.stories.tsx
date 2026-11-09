import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle, Button, Icon, PlusIcon } from '../src';

const meta = {
  title: 'Components/Card', component: Card, tags: ['autodocs'],
  args: { variant: 'outlined', padding: 'large', orientation: 'vertical' },
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'filled', 'plain'] },
    padding: { control: 'select', options: ['none', 'small', 'medium', 'large'] },
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
    as: { control: 'select', options: ['div', 'article', 'section'] },
  },
  parameters: { docs: { description: { component: 'A passive, composable surface. Use Header, Content, Media, Title, Description, and Footer in any combination. Horizontal layouts wrap intrinsically. Card owns internal layout; parents own width and placement. Actions retain native semantics. Customize card.* semantic tokens through scoped CSS or typed style props. See docs/card.md for the public contract.' } } },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Decorative layers artwork composed through the existing Icon foundation.
 **/
function Layers() {
  return <Icon><path d="m3 7 9-4 9 4-9 4-9-4Zm0 5 9 4 9-4M3 17l9 4 9-4" /></Icon>;
}

/**
 * Shared copy from the supplied reference compositions.
 **/
function CollectionCopy() {
  return <><span className="card-demo__eyebrow"><Layers />Design system</span><CardTitle>A foundation for every interface.</CardTitle><CardDescription>Shared components, thoughtful defaults, and room to make it your own.</CardDescription></>;
}

/**
 * Supplementary metadata arranged by its own parent layout.
 **/
function Metadata() {
  return <div className="card-demo__metadata"><span>◉ Two themes</span><span>〈 〉 React</span></div>;
}

export const Playground: Story = {
  render: args => <Card {...args}><CardContent><CollectionCopy /><Metadata /></CardContent></Card>,
};

/**
 * An independently interactive footer without making the card a control.
 **/
function SaveCollection() {
  const [saved, setSaved] = useState(false);

  return <Card padding="large"><CardContent><CollectionCopy /><Metadata /></CardContent><CardFooter divided><span>Keep it for later</span><Button onClick={() => setSaved(!saved)} aria-pressed={saved}><PlusIcon />{saved ? 'Saved collection' : 'Save collection'}</Button></CardFooter></Card>;
}

export const WithFooter: Story = {
  render: () => <SaveCollection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Save collection' });

    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('button', { name: 'Saved collection' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('button', { name: 'Save collection' })).toHaveAttribute('aria-pressed', 'false');
  },
};

export const WithMedia: Story = {
  render: args => <Card {...args} orientation="horizontal"><CardMedia className="card-demo__media"><span className="card-demo__art"><Layers /></span></CardMedia><CardContent><CollectionCopy /><CardFooter divided><details className="card-demo__details"><summary>Collection details</summary><p>Reusable React components with Corporate and Luna themes.</p></details></CardFooter></CardContent></Card>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const summary = canvas.getByText('Collection details');

    await userEvent.tab();
    await expect(summary).toHaveFocus();
    await userEvent.click(summary);
    await waitFor(() => expect(canvas.getByText('Reusable React components with Corporate and Luna themes.')).toBeVisible());
  },
};

export const ReferenceLayouts: Story = {
  globals: { theme: 'luna' },
  render: () => <div className="stack card-demo"><Card padding="large"><CardContent><CollectionCopy /><Metadata /></CardContent></Card><SaveCollection /><Card padding="large" orientation="horizontal"><CardMedia className="card-demo__media"><span className="card-demo__art"><Layers /></span></CardMedia><CardContent><CollectionCopy /><CardFooter divided><details className="card-demo__details"><summary>Collection details</summary><p>Reusable components and semantic design tokens.</p></details></CardFooter></CardContent></Card></div>,
};

export const VariantsAndPadding: Story = {
  render: () => <div className="stack">{(['outlined', 'filled', 'plain'] as const).map(variant => <div key={variant} className="theme-grid">{(['none', 'small', 'medium', 'large'] as const).map(padding => <Card key={padding} variant={variant} padding={padding}><CardHeader><CardTitle>{variant}</CardTitle></CardHeader><CardContent><CardDescription>{padding} padding. Every region is optional.</CardDescription></CardContent><CardFooter><Button variant="secondary">Explore</Button></CardFooter></Card>)}</div>)}</div>,
};

export const BothThemes: Story = {
  render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <div data-theme={theme} key={theme} className="theme-panel"><Card><CardContent><CollectionCopy /></CardContent><CardFooter divided><Button>Save collection</Button></CardFooter></Card></div>)}</div>,
};

export const ConsumerOverride: Story = {
  render: () => <Card style={{ '--fs-card-radius': '32px', '--fs-card-padding-medium': '32px', '--fs-card-title-font-size': '2rem', '--fs-card-border-width': '2px' }}><CardContent><CollectionCopy /></CardContent><CardFooter divided><Button>Custom collection</Button></CardFooter></Card>,
};

export const LongContent: Story = {
  render: () => <div style={{ maxWidth: '320px' }}><Card orientation="horizontal"><CardMedia className="card-demo__media"><Layers /></CardMedia><CardContent><CardTitle>A very long title with room to wrap and grow</CardTitle><CardDescription>CollectionWithAnExtremelyLongUnbrokenNameThatMustNeverForceHorizontalScrolling</CardDescription><CardFooter divided><Button>Save this collection for another day</Button></CardFooter></CardContent></Card></div>,
};

export const LunaFooter: Story = { ...WithFooter, globals: { theme: 'luna' } };
export const LunaMedia: Story = { ...WithMedia, globals: { theme: 'luna' } };
