# Fletchstack UI

A small, server-renderable React component library with two CSS themes: **Corporate** (default) and **Luna**. The initial public component is `Button`.

## Install and import

Use Node 22.23.4+ and React/React DOM **^18.2.0 or ^19.0.0**, with matching React and React DOM versions. The package is ESM and includes TypeScript declarations. React is a peer dependency and is not bundled.

This repository is ready to pack; it has not been published to npm:

```sh
npm ci
npm pack
# In your website:
npm install /path/to/fletchstack-ui-0.0.1.tgz
```

```tsx
import { Button } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

<Button onClick={() => console.log('Saved')}>Save changes</Button>
```

Import the combined stylesheet once in your app entry or layout. Alternatively import `fletchstack-ui/tokens.css` followed by `fletchstack-ui/button.css`. JavaScript deliberately does not import CSS, so Node server rendering needs no CSS loader. CSS exports are marked as side effects for bundlers. No provider, browser storage, theme effect, external font, or browser global is required by the library.

## Button contract

| Prop | Options / default | Purpose |
| --- | --- | --- |
| `variant` | `primary` (default), `secondary`, `ghost` | Main action, alternative, low-emphasis action |
| `size` | `small`, `medium` (default), `large` | Padding, minimum target size, relative label size |
| `type` | `button` (default), `submit`, `reset` | Explicit native form behavior |
| `disabled` | Native boolean | Prevents activation and removes the button from tab order |
| `ref` | `HTMLButtonElement` | Native focus and DOM access |
| `className`, `style` | Native customization; style also accepts `--fs-*` | Scoped semantic overrides |

All other native button attributes, ARIA attributes, children, and event handlers pass through. Use visible label text, or an accessible name for an icon-only control. Decorative icons should have `aria-hidden="true"`; SVGs should also use `focusable="false"`.

```tsx
<div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--fs-space-inline)' }}>
  <Button type="submit"><span aria-hidden="true">✓</span><span>Save changes</span></Button>
  <Button variant="secondary">Cancel</Button>
  <Button variant="ghost">Learn more</Button>
  <Button variant="secondary" aria-label="Close dialog"><span aria-hidden="true">×</span></Button>
</div>
```

Button owns its padding and label/icon gap. Parents own external spacing and placement. It has a minimum size, no fixed height, and wraps long labels. Do not clip its focus ring with a parent's overflow rule. A disabled action is styled without reducing the opacity of its text.

## Themes and scoped customization

Corporate is applied at `:root:not([data-theme])`. Set the stable attribute on a document or any containing element. An explicit document theme takes precedence regardless of theme filename ordering. A theme attribute sets tokens; use the surface/text roles to paint a region.

```html
<html data-theme="corporate">
```

```tsx
<div className="theme-surface" data-theme="corporate">
  <Button>Corporate action</Button>
  <section className="theme-surface" data-theme="luna">
    <Button>Luna action</Button>
    <div className="theme-surface" data-theme="corporate"><Button>Nested Corporate</Button></div>
  </section>
</div>
```

```css
.theme-surface {
  background: var(--fs-surface);
  color: var(--fs-text);
  padding: var(--fs-space-inset);
  font-family: var(--fs-font-body);
  font-size: var(--fs-font-size);
  line-height: var(--fs-font-line-height);
}
```

Siblings can use different themes. Each explicit theme boundary redeclares all 59 semantic properties, so nested themes reset inherited theme values and overrides. There are no runtime aliases to resolve against an ancestor: primitive aliases resolve to literal semantic values during generation.

[Every public token and its purpose](docs/tokens.md) is generated from the authoritative token source. Load scoped overrides after the library stylesheet:

```css
.brand-actions {
  --fs-button-radius: 24px;
  --fs-button-primary-default-background: #14623d;
  --fs-button-primary-default-border: #14623d;
  --fs-button-primary-default-text: #fff;
  --fs-button-primary-hover-background: #104f31;
  --fs-button-primary-hover-border: #104f31;
  --fs-button-primary-hover-text: #fff;
  --fs-button-primary-active-background: #0b3c25;
  --fs-button-primary-active-border: #0b3c25;
  --fs-button-primary-active-text: #fff;
}
```

```tsx
<div className="brand-actions"><Button>Branded action</Button></div>
<Button style={{ '--fs-button-radius': '0px' }}>Square action</Button>
```

Override all relevant states when changing an action palette. Consumers remain responsible for contrast, focus, and target size after customization. Use explicit units in custom-property values, e.g. `'8px'`, because React does not append units to CSS custom properties.

To add a source theme, copy [tokens/corporate.json](tokens/corporate.json) to `tokens/your-theme.json`, keep exactly the same semantic names/types, and point its values to primitives in [tokens/primitives.json](tokens/primitives.json). Add raw primitives there as needed, then run `npm run tokens`. The filename becomes the `data-theme` identifier. The generator discovers themes, validates the contract, and writes a full selector. Button source stays unchanged. A downstream website can instead define its own `[data-theme="your-theme"]` selector implementing the complete contract; for a small variation, use a scoped override inside an existing theme.

Tokens follow DTCG 2025.10 with exactly two conceptual layers: raw primitives and intent-bearing semantic aliases. The supported subset and conversion rules are documented in the [foundation](docs/foundation.md). Spatial dimensions use px; font sizes use rem; line heights are unitless. Invalid types, references, cycles, and theme contract mismatches stop the build. Generated files are checked in for inspection and regenerated by every build.

## Gatsby

Current Gatsby 5.16.1 accepts React 18 and 19. A minimal page:

```tsx
import { Button } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

export default function SettingsPage() {
  return (
    <main data-theme="corporate">
      <h1>Settings</h1>
      <Button onClick={() => window.alert('Saved')}>Save changes</Button>
    </main>
  );
}
```

Import CSS in the page/layout, or in both your `gatsby-browser` and `gatsby-ssr` entries when centralizing global styles. Button's initial HTML is deterministic and contains no browser-dependent state. The example's browser API is only accessed by a click handler. Choose the initial theme in server-rendered HTML, and preserve that same attribute through hydration. A full Gatsby site build has not been exercised; React 18/19 SSR and a packed Vite consumer were exercised. The minimal source is in [examples/gatsby](examples/gatsby).

## Astro

Install Astro's React integration and the matching React dependencies (or run `npx astro add react`). Configure it:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
export default defineConfig({ integrations: [react()] });
```

Static React rendering needs no client directive and ships no component hydration code. A native form can still submit:

```astro
---
import { Button } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';
import SaveAction from '../components/SaveAction';
---
<html lang="en" data-theme="luna">
  <body style="background:var(--fs-surface);color:var(--fs-text);padding:var(--fs-space-inset)">
    <form action="/preferences" method="post">
      <Button type="submit">Save without JavaScript</Button>
    </form>
    <SaveAction client:load />
  </body>
</html>
```

Own interactive handlers inside the React island so no function crosses Astro's serialized props boundary:

```tsx
// src/components/SaveAction.tsx
import { useState } from 'react';
import { Button } from 'fletchstack-ui';

export default function SaveAction() {
  const [saved, setSaved] = useState(false);
  return <Button disabled={saved} onClick={() => setSaved(true)}>{saved ? 'Saved' : 'Save changes'}</Button>;
}
```

`client:load` hydrates promptly for an immediately available action. `client:visible` is appropriate when hydration can wait until a below-the-fold island is visible. The static Button itself does not need either directive. The complete small fixture is in [examples/astro](examples/astro); see [verification evidence](docs/verification.md) for versions and actual checks.

## Development and verification

Storybook's **Design System → Foundation** and **Design System → Tokens** pages render the authoritative Markdown documents directly, keeping the in-app guidance and repository documentation in sync.

```sh
npm ci
npx playwright install chromium
npm run storybook          # http://localhost:6006; Corporate/Luna toolbar
npm run tokens             # validate sources; generate CSS and token reference
npm run lint
npm run typecheck
npm test                   # unit tests, browser regressions, Storybook interactions and axe
npm run test:unit
npm run test:storybook
npm run build              # ESM, declarations, and explicit CSS exports
npm run build-storybook    # static site in storybook-static
npm run verify:browser     # built CSS contrast, focus, reflow; screenshots in .verification
npm run verify:package     # temporary packed consumer, React 18/19, types and CSS bundling
npm pack                   # installable tarball; prepack rebuilds everything
```

Package verification installs dependencies into a temporary directory and deletes it afterward; it needs npm registry access. Chromium checks run headlessly. Storybook's `a11y.test: 'error'` is wired into its Vitest addon; accessibility violations fail tests. A temporary unnamed-button probe confirmed that behavior.

[Foundation](docs/foundation.md) · [Implementation plan](docs/implementation-plan.md) · [Verification results and gaps](docs/verification.md)
