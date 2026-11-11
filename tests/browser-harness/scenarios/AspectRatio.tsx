import { AspectRatio } from '../../../src/components/aspect-ratio/AspectRatio';
import { Button } from '../../../src/components/button/Button';
import { Card, CardContent, CardDescription, CardTitle } from '../../../src/components/card/Card';
import { Container } from '../../../src/components/container/Container';
import { SimpleGrid } from '../../../src/components/simple-grid/SimpleGrid';
import { Stack } from '../../../src/components/stack/Stack';
import type { AspectRatioProps } from '../../../src/components/aspect-ratio/AspectRatio';
import type { Scenario } from '../gallery/types';
import '../../../src/components/aspect-ratio/aspect-ratio.css';
import '../../../src/components/button/button.css';
import '../../../src/components/card/card.css';
import '../../../src/components/container/container.css';
import '../../../src/components/simple-grid/simple-grid.css';
import '../../../src/components/stack/stack.css';
import '../../../src/components/aspect-ratio/stories/aspect-ratio.stories.css';

/**
 * Keep card captions and native actions outside proportional media frames.
 **/
function MediaCards() {
  return <>{['Mountain collection', 'Project landscape', 'Illustration study'].map(name => <Card key={name} as="article"><figure className="aspect-demo-figure"><AspectRatio><Artwork /></AspectRatio><figcaption className="aspect-demo-caption">{name}: mountain peaks beneath a blue sun. This caption can wrap and grow independently.</figcaption></figure><CardContent><CardTitle as="h3">{name}</CardTitle><CardDescription>SimpleGrid owns columns; Card owns its surface; the media child chooses fitting.</CardDescription><Button>Open {name}</Button></CardContent></Card>)}</>;
}

/**
 * Supply fitted consumer media with meaningful alternative text and no wrapper-owned presentation.
 **/
function Artwork() {
  return <img className="aspect-demo-media aspect-demo-cover" src={new URL('../../../src/components/aspect-ratio/stories/landscape.svg', import.meta.url).href} alt="Illustration of mountain peaks beneath a blue sun" />;
}

const Playground: Scenario<AspectRatioProps> = { render: args => <Stack><p>The wrapper reserves geometry only. This image supplies its own cover fitting.</p><div className="aspect-demo-wide"><AspectRatio {...args} data-testid="default-frame" /></div></Stack> };

const Ratios: Scenario<AspectRatioProps> = { render: () => <div className="theme-grid">{([['square', 1], ['landscape', 16 / 9], ['portrait', 3 / 4]] as const).map(([name, ratio]) => <section key={name}><h2>{name}</h2><div className="aspect-demo-small"><AspectRatio ratio={ratio} data-testid={`ratio-${name}`}><Artwork /></AspectRatio></div></section>)}</div> };

const Responsive: Scenario<AspectRatioProps> = { render: () => <Stack gap="group">{([['wide', 640], ['narrow', 240]] as const).map(([name, width]) => <section key={name}><h2>{name} parent</h2><div style={{ inlineSize: width, maxInlineSize: '100%' }}><AspectRatio data-testid={`responsive-${name}`}><Artwork /></AspectRatio></div></section>)}</Stack> };

const MediaFitting: Scenario<AspectRatioProps> = { render: () => <div className="theme-grid">{(['cover', 'contain'] as const).map(fit => <figure key={fit} className="aspect-demo-figure"><h2>{fit}</h2><div className="aspect-demo-small"><AspectRatio ratio={1} className="aspect-demo-guide" data-testid={`fit-${fit}`}><img className={`aspect-demo-media aspect-demo-${fit}`} src={new URL('../../../src/components/aspect-ratio/stories/landscape.svg', import.meta.url).href} alt="Mountain peaks beneath a blue sun" /></AspectRatio></div><figcaption>{fit} is chosen on the image. Cropping or empty space belongs to the fitting choice.</figcaption></figure>)}</div> };

const Composition: Scenario<AspectRatioProps> = { render: () => <Container><section aria-labelledby="media-title"><Stack gap="group"><header><h2 id="media-title">Project media</h2><p>Captions grow outside the frame. The ratio never fixes the height of an entire card.</p></header><SimpleGrid data-testid="media-grid"><MediaCards /></SimpleGrid></Stack></section></Container> };

const BothThemes: Scenario<AspectRatioProps> = { render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel"><Stack><h2>{theme}</h2><figure className="aspect-demo-figure"><AspectRatio data-testid={`theme-${theme}`}><Artwork /></AspectRatio><figcaption>Same geometry; the surrounding surface belongs to the theme.</figcaption></figure></Stack></section>)}</div> };

const CustomRatio: Scenario<AspectRatioProps> = { args: { ratio: 2.4 }, render: args => <Stack><p>A finite positive custom width/height ratio.</p><div className="aspect-demo-wide"><AspectRatio {...args} data-testid="custom-frame" /></div></Stack> };

const NativeStyleOverride: Scenario<AspectRatioProps> = { render: () => <Stack><p>Native style.aspectRatio takes precedence over ratio=1.</p><div className="aspect-demo-small"><AspectRatio ratio={1} style={{ aspectRatio: '4 / 3' }} data-testid="override-frame"><Artwork /></AspectRatio></div></Stack> };

const InvalidRatios: Scenario<AspectRatioProps> = { render: () => <div className="theme-grid">{[0, -1, NaN, Infinity, -Infinity].map((ratio, index) => <section key={index}><h2>{String(ratio)} falls back</h2><div className="aspect-demo-small"><AspectRatio ratio={ratio} data-testid={`invalid-${index}`}><Artwork /></AspectRatio></div></section>)}</div> };

const Video: Scenario<AspectRatioProps> = { render: () => <Stack><p>Native video controls and a consumer poster. No media source is loaded in this offline example.</p><div className="aspect-demo-wide"><AspectRatio data-testid="video-frame"><video controls preload="none" poster={new URL('../../../src/components/aspect-ratio/stories/landscape.svg', import.meta.url).href} className="aspect-demo-media aspect-demo-contain" aria-label="Project overview video" /></AspectRatio></div></Stack> };

const Embed: Scenario<AspectRatioProps> = { render: () => <Stack><p>Supply an embed title and size the child. This local document makes no remote requests.</p><div className="aspect-demo-wide"><AspectRatio data-testid="embed-frame"><iframe className="aspect-demo-media aspect-demo-embed" title="Project overview embed" srcDoc={'<!doctype html><html lang="en"><head><title>Local project preview</title></head><body><p>Project overview preview</p></body></html>'} /></AspectRatio></div></Stack> };

const Overflow: Scenario<AspectRatioProps> = { render: () => <Stack gap="group"><p>Unfitted oversized children stay visible. The dashed frame is a demonstration guide.</p><div className="aspect-demo-small"><AspectRatio ratio={1} className="aspect-demo-guide" data-testid="overflow-frame"><img className="aspect-demo-oversized" src={new URL('../../../src/components/aspect-ratio/stories/landscape.svg', import.meta.url).href} alt="Oversized illustration" /></AspectRatio></div></Stack> };

const NativeFocus: Scenario<AspectRatioProps> = { render: () => <Stack><p>The frame adds no tab stop or clipping. Native controls retain their order.</p><Button>Before media</Button><div className="aspect-demo-small"><AspectRatio className="aspect-demo-guide" data-testid="focus-frame"><Button>Play preview</Button></AspectRatio></div><Button>After media</Button></Stack> };

const Nested: Scenario<AspectRatioProps> = { render: () => <Stack><p>Each frame derives its own geometry. Consumer width controls the inner frame.</p><div className="aspect-demo-wide"><AspectRatio ratio={1} className="aspect-demo-guide" data-testid="outer-frame"><div className="aspect-demo-small"><AspectRatio data-testid="inner-frame"><Artwork /></AspectRatio></div></AspectRatio></div></Stack> };

const NarrowParents: Scenario<AspectRatioProps> = { render: () => <Stack><div className="aspect-demo-flex"><div className="aspect-demo-fixed">Flex sibling</div><AspectRatio style={{ flex: '1 1 0%' }} data-testid="flex-frame"><Artwork /></AspectRatio></div><div className="aspect-demo-grid"><AspectRatio data-testid="grid-frame"><Artwork /></AspectRatio></div></Stack> };

const Empty: Scenario<AspectRatioProps> = { render: () => <Stack><p>An empty frame still reserves geometry. Outline is demo-only.</p><div className="aspect-demo-small"><AspectRatio className="aspect-demo-guide" data-testid="empty-frame" /></div></Stack> };

const Hidden: Scenario<AspectRatioProps> = { args: { hidden: true }, render: args => <div><p>The native hidden attribute suppresses the frame and its contents.</p><AspectRatio {...args} /></div> };

export const component = AspectRatio;
export const defaults: AspectRatioProps = { children: <img className="aspect-demo-media aspect-demo-cover" src={new URL('../../../src/components/aspect-ratio/stories/landscape.svg', import.meta.url).href} alt="Illustration of mountain peaks beneath a blue sun" /> };
export const scenarios = { Playground, Ratios, Responsive, Composition, MediaFitting, CustomRatio, NativeStyleOverride, InvalidRatios, Video, Embed, Overflow, NativeFocus, BothThemes, Nested, NarrowParents, Empty, Hidden };
