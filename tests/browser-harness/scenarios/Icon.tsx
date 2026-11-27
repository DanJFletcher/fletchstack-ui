import { HelpIcon } from '../../../src/components/icon/named/HelpIcon';
import { InboxIcon } from '../../../src/components/icon/named/InboxIcon';
import { HomeIcon } from '../../../src/components/icon/named/HomeIcon';
import { useRef, useState } from 'react';
import { ArrowRightIcon } from '../../../src/components/icon/named/ArrowRightIcon';
import { Button } from '../../../src/components/button/Button';
import { CheckIcon } from '../../../src/components/icon/named/CheckIcon';
import { CloseIcon } from '../../../src/components/icon/named/CloseIcon';
import { Icon } from '../../../src/components/icon/Icon';
import { MoonIcon } from '../../../src/components/icon/named/MoonIcon';
import { SunIcon } from '../../../src/components/icon/named/SunIcon';
import { ChevronDownIcon } from '../../../src/components/icon/named/ChevronDownIcon';
import { ExternalLinkIcon } from '../../../src/components/icon/named/ExternalLinkIcon';
import { PlusIcon } from '../../../src/components/icon/named/PlusIcon';
import type { IconProps, IconStyle } from '../../../src/components/icon/Icon';
import type { Scenario } from '../gallery/types';
import '../../../src/components/icon/icon.css';
import '../../../src/components/button/button.css';

const catalog = [
  { name: 'HelpIcon', use: 'Help destination', Artwork: HelpIcon, keywords: ['help'] },
  { name: 'InboxIcon', use: 'Inbox destination', Artwork: InboxIcon, keywords: ['inbox'] },
  { name: 'HomeIcon', use: 'Home destination', Artwork: HomeIcon, keywords: ['home'] },
  { name: 'MoonIcon', use: 'Night mode', Artwork: MoonIcon, keywords: ['night', 'dark', 'theme'] },
  { name: 'SunIcon', use: 'Light mode', Artwork: SunIcon, keywords: ['day', 'light', 'theme'] },
  {
    name: 'CheckIcon',
    use: 'Success and confirmation',
    Artwork: CheckIcon,
    keywords: ['confirm', 'done', 'complete'],
  },
  {
    name: 'CloseIcon',
    use: 'Dismiss or cancel',
    Artwork: CloseIcon,
    keywords: ['dismiss', 'cancel', 'remove'],
  },
  {
    name: 'ChevronDownIcon',
    use: 'Expand a section or menu',
    Artwork: ChevronDownIcon,
    keywords: ['down', 'expand', 'dropdown'],
  },
  {
    name: 'ArrowRightIcon',
    use: 'Continue or navigate forward',
    Artwork: ArrowRightIcon,
    keywords: ['next', 'forward', 'navigate'],
  },
  { name: 'PlusIcon', use: 'Add or create', Artwork: PlusIcon, keywords: ['add', 'create', 'new'] },
  {
    name: 'ExternalLinkIcon',
    use: 'External destination',
    Artwork: ExternalLinkIcon,
    keywords: ['external', 'link', 'open'],
  },
];

/**
 * Inspect a forwarded SVG ref after the artwork has mounted.
 **/
function RefExample() {
  const ref = useRef<SVGSVGElement>(null);
  const [result, setResult] = useState('Not inspected');

  return (
    <div className="stack">
      <h1>Native SVG access</h1>
      <SunIcon label="Reference sun" ref={ref} className="reference-art" data-source="named" />
      <Button onClick={() => setResult(String(ref.current instanceof SVGSVGElement))}>
        Inspect SVG ref
      </Button>
      <output aria-label="Ref result">{result}</output>
    </div>
  );
}

/**
 * Show that Button owns activation, naming, and spacing around decorative artwork.
 **/
function IconActions() {
  const [activations, setActivations] = useState(0);

  return (
    <div className="stack">
      <h1>Artwork inside an action</h1>
      <div className="actions">
        <Button onClick={() => setActivations((value) => value + 1)}>
          <CheckIcon />
          <span>Save changes</span>
        </Button>
        <Button
          variant="secondary"
          aria-label="Close dialog"
          onClick={() => setActivations((value) => value + 1)}
        >
          <CloseIcon />
        </Button>
        <Button variant="ghost">
          <ArrowRightIcon />
          <span>Continue</span>
        </Button>
        <Button disabled>
          <CheckIcon />
          <span>Saved</span>
        </Button>
      </div>
      <output aria-label="Activations">{activations}</output>
      <div className="narrow">
        <Button>
          <MoonIcon />
          <span>Save all changes and return to your account settings</span>
        </Button>
      </div>
    </div>
  );
}

const Playground: Scenario<IconProps> = {};

const Sizes: Scenario<IconProps> = {
  render: () => (
    <div className="stack">
      <h1>One drawing, three sizes</h1>
      <div className="actions">
        {(['small', 'medium', 'large'] as const).map((size) => (
          <div key={size} className="stack">
            <span>{size}</span>
            <MoonIcon label={`${size} moon`} size={size} />
          </div>
        ))}
        <Icon label="Default size">
          <path d="m12 3 9 9-9 9-9-9Z" />
        </Icon>
      </div>
    </div>
  ),
};

const Composition: Scenario<IconProps> = { render: () => <IconActions /> };

const Customization: Scenario<IconProps> = {
  render: () => (
    <section data-theme="corporate" className="theme-panel stack" aria-label="Icon customization">
      <h1>Local tokens, predictable scopes</h1>
      <div
        className="theme-panel stack"
        style={{ '--fs-icon-size-medium': '32px', '--fs-icon-stroke-width': 3 } as IconStyle}
      >
        <MoonIcon label="Scoped moon" />
        <SunIcon label="Local square size" style={{ '--fs-icon-size-medium': '36px' }} />
        <section data-theme="luna" className="theme-panel stack">
          <MoonIcon label="Nested theme reset" />
        </section>
      </div>
      <MoonIcon label="Unaffected sibling" />
    </section>
  ),
};

const CustomArtwork: Scenario<IconProps> = {
  render: () => (
    <div className="stack">
      <h1>Your SVG, one consistent wrapper</h1>
      <Icon
        label="Wide custom artwork"
        viewBox="0 0 32 32"
        className="consumer-art"
        data-source="consumer"
        fill="currentColor"
        stroke="none"
        style={{ '--fs-icon-size-medium': '28px' }}
      >
        <g>
          <path d="M4 4h24v24H4Z" />
        </g>
      </Icon>
      <p>
        Fill, stroke, viewBox and SVG children stay under consumer control. Dimensions use semantic
        tokens.
      </p>
    </div>
  ),
};

const Catalog: Scenario<IconProps> = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} aria-label={theme} className="theme-panel stack">
          <h1>{theme === 'corporate' ? 'Corporate icon catalog' : 'Luna icon catalog'}</h1>
          {catalog.map(({ name, use, Artwork }) => (
            <div key={name} className="stack">
              <h2>{name}</h2>
              <p>{use}</p>
              <div className="actions">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <Artwork key={size} label={`${name} ${size}`} size={size} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  ),
};

const Accessibility: Scenario<IconProps> = {
  render: () => (
    <div className="stack">
      <h1>Decoration and meaning</h1>
      <div className="actions">
        <Icon data-testid="decorative-default">
          <path d="m12 3 9 9-9 9-9-9Z" />
        </Icon>
        <MoonIcon label="" data-testid="decorative-empty" />
        <SunIcon label="   " data-testid="decorative-blank" />
        <MoonIcon label=" Night mode " />
      </div>
      <p>Only the labeled moon is exposed as an image. Decorative artwork has no keyboard stop.</p>
    </div>
  ),
};

const RefAccess: Scenario<IconProps> = { render: () => <RefExample /> };

export const component = Icon;
export const defaults: IconProps = {
  label: 'Custom diamond',
  children: <path d="m12 3 9 9-9 9-9-9Z" />,
};
export const scenarios = {
  Playground,
  Sizes,
  Composition,
  Customization,
  CustomArtwork,
  Catalog,
  Accessibility,
  RefAccess,
};
