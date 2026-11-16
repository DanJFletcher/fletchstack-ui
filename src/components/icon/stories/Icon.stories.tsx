import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ArrowRightIcon, Button, CheckIcon, CloseIcon, Icon, MoonIcon, SunIcon, type IconStyle } from '../../../index';

import { catalog } from './icon-catalog';
import { IconGallery } from './icon-gallery';

const meta = {
  id: 'components-icon', title: 'Components/Visuals/Icon', component: Icon, tags: ['autodocs'],
  args: { label: 'Custom diamond', children: <path d="m12 3 9 9-9 9-9-9Z" /> },
  argTypes: { size: { control: 'select', options: ['small', 'medium', 'large'] }, label: { control: 'text' } },
  parameters: { docs: { description: { component: 'Supply SVG children or opt into named artwork. Omit label for decoration; label standalone meaningful images. Icons inherit color and add no outer spacing. Button owns control semantics, padding, and its label/icon gap.' } } },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Show that Button owns activation, naming, and spacing around decorative artwork.
 **/
function IconActions() {
  const [activations, setActivations] = useState(0);

  return <div className="stack"><h1>Artwork inside an action</h1><div className="actions">
    <Button onClick={() => setActivations(value => value + 1)}><CheckIcon /><span>Save changes</span></Button>
    <Button variant="secondary" aria-label="Close dialog" onClick={() => setActivations(value => value + 1)}><CloseIcon /></Button>
    <Button variant="ghost"><ArrowRightIcon /><span>Continue</span></Button>
    <Button disabled><CheckIcon /><span>Saved</span></Button>
  </div><output aria-label="Activations">{activations}</output>
    <div className="narrow"><Button><MoonIcon /><span>Save all changes and return to your account settings</span></Button></div>
  </div>;
}

/**
 * Inspect a forwarded SVG ref after the artwork has mounted.
 **/
function RefExample() {
  const ref = useRef<SVGSVGElement>(null);
  const [result, setResult] = useState('Not inspected');

  return <div className="stack"><h1>Native SVG access</h1>
    <SunIcon label="Reference sun" ref={ref} className="reference-art" data-source="named" />
    <Button onClick={() => setResult(String(ref.current instanceof SVGSVGElement))}>Inspect SVG ref</Button>
    <output aria-label="Ref result">{result}</output>
  </div>;
}




export const Playground: Story = {};

export const Sizes: Story = {
  render: () => <div className="stack"><h1>One drawing, three sizes</h1><div className="actions">
    {(['small', 'medium', 'large'] as const).map(size => <div key={size} className="stack"><span>{size}</span><MoonIcon label={`${size} moon`} size={size} /></div>)}
    <Icon label="Default size"><path d="m12 3 9 9-9 9-9-9Z" /></Icon>
  </div></div>,
};

export const Composition: Story = {
  render: () => <IconActions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Close dialog' }));
    await expect(canvas.getByLabelText('Activations')).toHaveTextContent('2');
  },
};

export const Customization: Story = {
  render: () => <section data-theme="corporate" className="theme-panel stack" aria-label="Icon customization"><h1>Local tokens, predictable scopes</h1>
    <div className="theme-panel stack" style={{ '--fs-icon-size-medium': '32px', '--fs-icon-stroke-width': 3 } as IconStyle}>
      <MoonIcon label="Scoped moon" /><SunIcon label="Local square size" style={{ '--fs-icon-size-medium': '36px' }} />
      <section data-theme="luna" className="theme-panel stack"><MoonIcon label="Nested theme reset" /></section>
    </div>
    <MoonIcon label="Unaffected sibling" />
  </section>,
};

export const CustomArtwork: Story = {
  render: () => <div className="stack"><h1>Your SVG, one consistent wrapper</h1>
    <Icon label="Wide custom artwork" viewBox="0 0 32 32" className="consumer-art" data-source="consumer" fill="currentColor" stroke="none" style={{ '--fs-icon-size-medium': '28px' }}>
      <g><path d="M4 4h24v24H4Z" /></g>
    </Icon>
    <p>Fill, stroke, viewBox and SVG children stay under consumer control. Dimensions use semantic tokens.</p>
  </div>,
};

export const Catalog: Story = {
  render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} aria-label={theme} className="theme-panel stack">
    <h1>{theme === 'corporate' ? 'Corporate icon catalog' : 'Luna icon catalog'}</h1>
    {catalog.map(({ name, use, Artwork }) => <div key={name} className="stack"><h2>{name}</h2><p>{use}</p><div className="actions">
      {(['small', 'medium', 'large'] as const).map(size => <Artwork key={size} label={`${name} ${size}`} size={size} />)}
    </div></div>)}
  </section>)}</div>,
};

export const Accessibility: Story = {
  render: () => <div className="stack"><h1>Decoration and meaning</h1><div className="actions">
    <Icon data-testid="decorative-default"><path d="m12 3 9 9-9 9-9-9Z" /></Icon>
    <MoonIcon label="" data-testid="decorative-empty" /><SunIcon label="   " data-testid="decorative-blank" />
    <MoonIcon label=" Night mode " />
  </div><p>Only the labeled moon is exposed as an image. Decorative artwork has no keyboard stop.</p></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('img')).toHaveLength(1);
    await expect(canvas.getByRole('img', { name: 'Night mode' })).toBeVisible();
  },
};

export const RefAccess: Story = {
  render: () => <RefExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Inspect SVG ref' }));
    await expect(canvas.getByLabelText('Ref result')).toHaveTextContent('true');
  },
};

export const Gallery: Story = {
  render: () => <IconGallery />,
  parameters: { docs: { description: { story: 'Browse the collection or search export names, intended uses and keywords. Search is a literal substring, ignoring case and surrounding whitespace. Cards have no actions; Catalog compares sizes and themes.' } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox', { name: 'Search icons' });
    await userEvent.type(input, 'new');
    await expect(canvas.getByRole('heading', { name: 'PlusIcon' })).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('1 icon');
    await userEvent.clear(input);
    await userEvent.type(input, 'no-such-icon');
    await expect(canvas.getByRole('status')).toHaveTextContent('0 icons');
    await expect(canvas.getByText('No icons found. Try another term or clear the search.')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(input).toHaveFocus();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(11);
  },
};
