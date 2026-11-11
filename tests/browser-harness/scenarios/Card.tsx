import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle } from '../../../src/components/card/Card';
import { Button } from '../../../src/components/button/Button';
import { Icon } from '../../../src/components/icon/Icon';
import { PlusIcon } from '../../../src/components/icon/named/PlusIcon';
import type { CardProps } from '../../../src/components/card/Card';
import type { Scenario } from '../gallery/types';
import '../../../src/components/card/card.css';
import '../../../src/components/button/button.css';
import '../../../src/components/icon/icon.css';
import '../../../src/components/card/stories/card.stories.css';

/**
 * An independently interactive footer without making the card a control.
 **/
function SaveCollection() {
  const [saved, setSaved] = useState(false);

  return <Card padding="large"><CardContent><CollectionCopy /><Metadata /></CardContent><CardFooter divided><span>Keep it for later</span><Button onClick={() => setSaved(!saved)} aria-pressed={saved}><PlusIcon />{saved ? 'Saved collection' : 'Save collection'}</Button></CardFooter></Card>;
}

/**
 * Supplementary metadata arranged by its own parent layout.
 **/
function Metadata() {
  return <div className="card-demo__metadata"><span>◉ Two themes</span><span>〈 〉 React</span></div>;
}

/**
 * Shared copy from the supplied reference compositions.
 **/
function CollectionCopy() {
  return <><span className="card-demo__eyebrow"><Layers />Design system</span><CardTitle>A foundation for every interface.</CardTitle><CardDescription>Shared components, thoughtful defaults, and room to make it your own.</CardDescription></>;
}

/**
 * Decorative layers artwork composed through the existing Icon foundation.
 **/
function Layers() {
  return <Icon><path d="m3 7 9-4 9 4-9 4-9-4Zm0 5 9 4 9-4M3 17l9 4 9-4" /></Icon>;
}

const Playground: Scenario<CardProps> = { render: args => <Card {...args}><CardContent><CollectionCopy /><Metadata /></CardContent></Card> };

const VariantsAndPadding: Scenario<CardProps> = { render: () => <div className="stack">{(['outlined', 'filled', 'plain'] as const).map(variant => <div key={variant} className="theme-grid">{(['none', 'small', 'medium', 'large'] as const).map(padding => <Card key={padding} variant={variant} padding={padding}><CardHeader><CardTitle>{variant}</CardTitle></CardHeader><CardContent><CardDescription>{padding} padding. Every region is optional.</CardDescription></CardContent><CardFooter><Button variant="secondary">Explore</Button></CardFooter></Card>)}</div>)}</div> };

const WithFooter: Scenario<CardProps> = { render: () => <SaveCollection /> };

const WithMedia: Scenario<CardProps> = { render: args => <Card {...args} orientation="horizontal"><CardMedia className="card-demo__media"><span className="card-demo__art"><Layers /></span></CardMedia><CardContent><CollectionCopy /><CardFooter divided><details className="card-demo__details"><summary>Collection details</summary><p>Reusable React components with Corporate and Luna themes.</p></details></CardFooter></CardContent></Card> };

const ReferenceLayouts: Scenario<CardProps> = { theme: 'luna', render: () => <div className="stack card-demo"><Card padding="large"><CardContent><CollectionCopy /><Metadata /></CardContent></Card><SaveCollection /><Card padding="large" orientation="horizontal"><CardMedia className="card-demo__media"><span className="card-demo__art"><Layers /></span></CardMedia><CardContent><CollectionCopy /><CardFooter divided><details className="card-demo__details"><summary>Collection details</summary><p>Reusable components and semantic design tokens.</p></details></CardFooter></CardContent></Card></div> };

const ConsumerOverride: Scenario<CardProps> = { render: () => <Card style={{ '--fs-card-radius': '32px', '--fs-card-padding-medium': '32px', '--fs-card-title-font-size': '2rem', '--fs-card-border-width': '2px' }}><CardContent><CollectionCopy /></CardContent><CardFooter divided><Button>Custom collection</Button></CardFooter></Card> };

const BothThemes: Scenario<CardProps> = { render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <div data-theme={theme} key={theme} className="theme-panel"><Card><CardContent><CollectionCopy /></CardContent><CardFooter divided><Button>Save collection</Button></CardFooter></Card></div>)}</div> };

const LongContent: Scenario<CardProps> = { render: () => <div style={{ maxWidth: '320px' }}><Card orientation="horizontal"><CardMedia className="card-demo__media"><Layers /></CardMedia><CardContent><CardTitle>A very long title with room to wrap and grow</CardTitle><CardDescription>CollectionWithAnExtremelyLongUnbrokenNameThatMustNeverForceHorizontalScrolling</CardDescription><CardFooter divided><Button>Save this collection for another day</Button></CardFooter></CardContent></Card></div> };

const LunaFooter: Scenario<CardProps> = { render: () => <SaveCollection />, theme: 'luna' };

const LunaMedia: Scenario<CardProps> = { render: args => <Card {...args} orientation="horizontal"><CardMedia className="card-demo__media"><span className="card-demo__art"><Layers /></span></CardMedia><CardContent><CollectionCopy /><CardFooter divided><details className="card-demo__details"><summary>Collection details</summary><p>Reusable React components with Corporate and Luna themes.</p></details></CardFooter></CardContent></Card>, theme: 'luna' };

export const component = Card;
export const defaults: CardProps = { variant: 'outlined', padding: 'large', orientation: 'vertical' };
export const scenarios = { Playground, VariantsAndPadding, WithFooter, WithMedia, ReferenceLayouts, ConsumerOverride, BothThemes, LongContent, LunaFooter, LunaMedia };
