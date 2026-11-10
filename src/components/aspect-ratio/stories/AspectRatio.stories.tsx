import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { AspectRatio, Button, Card, CardContent, CardDescription, CardTitle, Container, SimpleGrid, Stack } from '../../../index';
import landscape from './landscape.svg';
import './aspect-ratio.stories.css';

const meta = {
  id: 'components-aspectratio', title: 'Components/Layout/AspectRatio', component: AspectRatio, tags: ['autodocs'],
  args: { children: <img className="aspect-demo-media aspect-demo-cover" src={landscape} alt="Illustration of mountain peaks beneath a blue sun" /> },
  argTypes: { ratio: { control: { type: 'number', min: 0.01, step: 0.1 } } },
  parameters: { a11y: { test: 'error' }, docs: { description: { component: 'Passive proportional media geometry. Default numeric ratio 16/9; use 1 for square or 3/4 for portrait. Full available width, height=width/ratio, no automatic clipping, surface, border, radius or keyboard behavior. Children own fitting, alternative text, video controls and embed titles; keep captions outside. Finite positive ratios are supported; invalid numbers fall back to 16/9. Native style.aspectRatio overrides the prop. Not intended for text sections.' } } },
} satisfies Meta<typeof AspectRatio>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Supply fitted consumer media with meaningful alternative text and no wrapper-owned presentation.
 **/
function Artwork() {
  return <img className="aspect-demo-media aspect-demo-cover" src={landscape} alt="Illustration of mountain peaks beneath a blue sun" />;
}

/**
 * Keep card captions and native actions outside proportional media frames.
 **/
function MediaCards() {
  return <>{['Mountain collection', 'Project landscape', 'Illustration study'].map(name => <Card key={name} as="article"><figure className="aspect-demo-figure"><AspectRatio><Artwork /></AspectRatio><figcaption className="aspect-demo-caption">{name}: mountain peaks beneath a blue sun. This caption can wrap and grow independently.</figcaption></figure><CardContent><CardTitle as="h3">{name}</CardTitle><CardDescription>SimpleGrid owns columns; Card owns its surface; the media child chooses fitting.</CardDescription><Button>Open {name}</Button></CardContent></Card>)}</>;
}

export const Playground: Story = { render: args => <Stack><p>The wrapper reserves geometry only. This image supplies its own cover fitting.</p><div className="aspect-demo-wide"><AspectRatio {...args} data-testid="default-frame" /></div></Stack> };
export const Ratios: Story = { render: () => <div className="theme-grid">{([['square', 1], ['landscape', 16 / 9], ['portrait', 3 / 4]] as const).map(([name, ratio]) => <section key={name}><h2>{name}</h2><div className="aspect-demo-small"><AspectRatio ratio={ratio} data-testid={`ratio-${name}`}><Artwork /></AspectRatio></div></section>)}</div> };
export const Responsive: Story = { render: () => <Stack gap="group">{([['wide', 640], ['narrow', 240]] as const).map(([name, width]) => <section key={name}><h2>{name} parent</h2><div style={{ inlineSize: width, maxInlineSize: '100%' }}><AspectRatio data-testid={`responsive-${name}`}><Artwork /></AspectRatio></div></section>)}</Stack> };
export const MediaFitting: Story = { render: () => <div className="theme-grid">{(['cover', 'contain'] as const).map(fit => <figure key={fit} className="aspect-demo-figure"><h2>{fit}</h2><div className="aspect-demo-small"><AspectRatio ratio={1} className="aspect-demo-guide" data-testid={`fit-${fit}`}><img className={`aspect-demo-media aspect-demo-${fit}`} src={landscape} alt="Mountain peaks beneath a blue sun" /></AspectRatio></div><figcaption>{fit} is chosen on the image. Cropping or empty space belongs to the fitting choice.</figcaption></figure>)}</div> };
export const Composition: Story = {
  render: () => <Container><section aria-labelledby="media-title"><Stack gap="group"><header><h2 id="media-title">Project media</h2><p>Captions grow outside the frame. The ratio never fixes the height of an entire card.</p></header><SimpleGrid data-testid="media-grid"><MediaCards /></SimpleGrid></Stack></section></Container>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Open Mountain collection' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Open Project landscape' })).toHaveFocus();
  },
};
export const BothThemes: Story = { render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel"><Stack><h2>{theme}</h2><figure className="aspect-demo-figure"><AspectRatio data-testid={`theme-${theme}`}><Artwork /></AspectRatio><figcaption>Same geometry; the surrounding surface belongs to the theme.</figcaption></figure></Stack></section>)}</div> };
export const CustomRatio: Story = { args: { ratio: 2.4 }, render: args => <Stack><p>A finite positive custom width/height ratio.</p><div className="aspect-demo-wide"><AspectRatio {...args} data-testid="custom-frame" /></div></Stack> };
export const NativeStyleOverride: Story = { render: () => <Stack><p>Native style.aspectRatio takes precedence over ratio=1.</p><div className="aspect-demo-small"><AspectRatio ratio={1} style={{ aspectRatio: '4 / 3' }} data-testid="override-frame"><Artwork /></AspectRatio></div></Stack> };
export const InvalidRatios: Story = { render: () => <div className="theme-grid">{[0, -1, NaN, Infinity, -Infinity].map((ratio, index) => <section key={index}><h2>{String(ratio)} falls back</h2><div className="aspect-demo-small"><AspectRatio ratio={ratio} data-testid={`invalid-${index}`}><Artwork /></AspectRatio></div></section>)}</div> };
export const Video: Story = { render: () => <Stack><p>Native video controls and a consumer poster. No media source is loaded in this offline example.</p><div className="aspect-demo-wide"><AspectRatio data-testid="video-frame"><video controls preload="none" poster={landscape} className="aspect-demo-media aspect-demo-contain" aria-label="Project overview video" /></AspectRatio></div></Stack> };
export const Embed: Story = { render: () => <Stack><p>Supply an embed title and size the child. This local document makes no remote requests.</p><div className="aspect-demo-wide"><AspectRatio data-testid="embed-frame"><iframe className="aspect-demo-media aspect-demo-embed" title="Project overview embed" srcDoc={'<!doctype html><html lang="en"><head><title>Local project preview</title></head><body><p>Project overview preview</p></body></html>'} /></AspectRatio></div></Stack> };
export const Overflow: Story = { render: () => <Stack gap="group"><p>Unfitted oversized children stay visible. The dashed frame is a demonstration guide.</p><div className="aspect-demo-small"><AspectRatio ratio={1} className="aspect-demo-guide" data-testid="overflow-frame"><img className="aspect-demo-oversized" src={landscape} alt="Oversized illustration" /></AspectRatio></div></Stack> };
export const NativeFocus: Story = {
  render: () => <Stack><p>The frame adds no tab stop or clipping. Native controls retain their order.</p><Button>Before media</Button><div className="aspect-demo-small"><AspectRatio className="aspect-demo-guide" data-testid="focus-frame"><Button>Play preview</Button></AspectRatio></div><Button>After media</Button></Stack>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Before media' }));
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Play preview' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'After media' })).toHaveFocus();
  },
};
export const Nested: Story = { render: () => <Stack><p>Each frame derives its own geometry. Consumer width controls the inner frame.</p><div className="aspect-demo-wide"><AspectRatio ratio={1} className="aspect-demo-guide" data-testid="outer-frame"><div className="aspect-demo-small"><AspectRatio data-testid="inner-frame"><Artwork /></AspectRatio></div></AspectRatio></div></Stack> };
export const NarrowParents: Story = { render: () => <Stack><div className="aspect-demo-flex"><div className="aspect-demo-fixed">Flex sibling</div><AspectRatio style={{ flex: '1 1 0%' }} data-testid="flex-frame"><Artwork /></AspectRatio></div><div className="aspect-demo-grid"><AspectRatio data-testid="grid-frame"><Artwork /></AspectRatio></div></Stack> };
export const Empty: Story = { render: () => <Stack><p>An empty frame still reserves geometry. Outline is demo-only.</p><div className="aspect-demo-small"><AspectRatio className="aspect-demo-guide" data-testid="empty-frame" /></div></Stack> };
export const Hidden: Story = { args: { hidden: true }, render: args => <div><p>The native hidden attribute suppresses the frame and its contents.</p><AspectRatio {...args} /></div> };
