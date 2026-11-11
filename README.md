# Fletchstack UI

A small, server-renderable React component library with two CSS themes: **Corporate** (default) and **Luna**. Public components include `Button`, `Field` and its label/message atoms, `FormGroup`, `Checkbox`, `Select`, `TextInput`, `Textarea`, composable `Card` parts, `Icon`, and eight opt-in named icons.

## ButtonGroup

`ButtonGroup` names related Button actions, provides separated wrapping or joined edges, and preserves native button interactions. Child size and variant override group defaults; group disabled always wins. Load `button-group.css` and `button.css` with tokens, or combined styles. See the [ButtonGroup contract](docs/button-group.md).

## Typography

`Heading` provides native h1–h6 semantics independently of page, section, and subheading visual sizes. `Text` provides paragraph or inline span content with lead, body, and small sizes and default or muted tones. Compose with Container for reading width and Stack for spacing. Import `typography.css` with tokens, or use combined styles. See the [Typography contract](docs/typography.md).

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

## Field primitives

`FieldLabel`, `FieldDescription`, and `FieldError` expose the shared form text patterns. `Field` composes a label and helper/error messages around a consumer-owned native control through a render prop. Existing TextInput and Select compose Field; Checkbox and FormGroup share the atoms and internal accessibility wiring. Existing props and separate stylesheet imports remain supported. For custom controls, import tokens.css and field.css, or the combined stylesheet. See the [Field usage and contract](docs/field.md) and **Components / Field** in Storybook.

## FormGroup contract

`FormGroup` uses a native fieldset and visible legend for related controls. It supports shared description, helper/error messages, native disabled behavior, vertical or wrapping horizontal layouts, refs, and semantic token overrides. Use its children render prop to pass shared accessibility relationships to each control. See the [FormGroup contract](docs/form-group.md) and **Components / FormGroup** in Storybook. Separate-style consumers import tokens.css, form-group.css, and the styles for their controls.

## Checkbox contract

`Checkbox` wraps a native independent choice with a required visible `label`, optional `description`/`error`, native checked/defaultChecked and form behavior, disabled state, and a forwarded input ref. `indeterminate` synchronizes the native mixed property on client mount and prop changes. Group related choices with fieldset/legend and derive Select all state in the parent.

Corporate/Luna themes expose independent `--fs-checkbox-*` tokens. Defaults match the reference: 20px control, 44px minimum clickable label, and 8px label gap. The combined stylesheet includes Checkbox; separate-style consumers import tokens.css, icon.css, and checkbox.css. See the [Checkbox contract](docs/checkbox.md) and **Components / Checkbox** in Storybook.

## Textarea contract

`Textarea` composes Field around a native multiline textarea. It supports controlled/uncontrolled string values, linked helper/errors, vertical resizing, read-only selection, disabled editing, native form attributes, refs, and optional `showCount` length guidance. Default minimum height is 120px with 16px text and 12px padding. The counter follows native UTF-16/maxLength semantics and form resets. See the [Textarea contract](docs/textarea.md) and **Components / Textarea** in Storybook. Separate-style consumers import tokens.css and textarea.css.

## TextInput contract

`TextInput` is a labeled native single-line field with `helperText`, `error`, textual `prefix`/`suffix`, and small/medium/large sizing. It supports text, email, password, search, tel, and url types; controlled/uncontrolled values; read-only selection; disabled editing; native form attributes; and refs. Corporate/Luna themes expose independent `--fs-text-input-*` tokens. Use `wrapperStyle` for the enclosing control's border, shape, and spacing. Adornments are described to assistive technology and excluded from the submitted value.

See the [TextInput usage and contract](docs/text-input.md) and **Components / TextInput** in Storybook. The combined stylesheet includes TextInput; separate-style consumers import tokens.css and text-input.css.

## Select contract

`Select` is a labeled native single-choice field. Pass `label` and native `option`/`optgroup` children; use `placeholder`, `helperText`, and `error` for prompts and linked descriptions. Controlled `value`/`onChange`, uncontrolled `defaultValue`, native form attributes, disabled options, and refs are supported. `size` accepts `small`, `medium` (default), or `large`.

Corporate and Luna share independent `--fs-select-*` tokens. Native popup styling follows the browser/OS. The combined stylesheet includes Select; separate-style consumers import tokens.css, icon.css, and select.css. See the [Select contract and usage](docs/select.md) and **Components / Select** in Storybook.

## Card contract

Compose `CardHeader`, `CardContent`, `CardMedia`, `CardTitle`, `CardDescription`, and `CardFooter` inside `Card`. All parts are optional and accept native attributes, refs, className, and typed style overrides.

| Prop | Options / default | Purpose |
| --- | --- | --- |
| `variant` | `outlined` (default), `filled`, `plain` | Surface treatment |
| `padding` | `none`, `small`, `medium` (default), `large` | Internal region padding |
| `orientation` | `vertical` (default), `horizontal` | Stacked or intrinsically wrapping media/content layout |
| `as` | `div` (default), `article`, `section` | Document semantics; provide a name where appropriate |

`CardTitle` supports `as="h1"` through `"h6"` or `"p"`; `CardFooter divided` adds a rule. Cards are passive surfaces: place native links, disclosures, or Button inside for interaction. Customize the `--fs-card-*` tokens to adjust colors, typography, media width, spacing, and shape. The combined stylesheet includes Card; separate-style consumers import `fletchstack-ui/card.css` after tokens. See the [full contract and example](docs/card.md), or **Components / Card** in Storybook for the supplied reference layouts and theme examples.

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
import { Button, CheckIcon } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

export default function SettingsPage() {
  return (
    <main data-theme="corporate">
      <h1>Settings</h1>
      <Button onClick={() => window.alert('Saved')}><CheckIcon /><span>Save changes</span></Button>
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
import { Button, CheckIcon } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';
import SaveAction from '../components/SaveAction';
---
<html lang="en" data-theme="luna">
  <body style="background:var(--fs-surface);color:var(--fs-text);padding:var(--fs-space-inset)">
    <form action="/preferences" method="post">
      <Button type="submit"><CheckIcon />Save without JavaScript</Button>
    </form>
    <SaveAction client:load />
  </body>
</html>
```

Own interactive handlers inside the React island so no function crosses Astro's serialized props boundary:

```tsx
// src/components/SaveAction.tsx
import { useState } from 'react';
import { Button, CheckIcon } from 'fletchstack-ui';

export default function SaveAction() {
  const [saved, setSaved] = useState(false);
  return <Button disabled={saved} onClick={() => setSaved(true)}><CheckIcon /><span>{saved ? 'Saved' : 'Save changes'}</span></Button>;
}
```

`client:load` hydrates promptly for an immediately available action. `client:visible` is appropriate when hydration can wait until a below-the-fold island is visible. The static Button itself does not need either directive. The complete small fixture is in [examples/astro](examples/astro); see [verification evidence](docs/verification.md) for versions and actual checks.

## Development and verification

Storybook's **Design System → Foundation** and **Design System → Tokens** pages render the authoritative Markdown documents directly, keeping the in-app guidance and repository documentation in sync.

See the [test guide](tests/README.md) for suite boundaries, file naming, shared fixtures, and commands for running a single test or feature. Tests are grouped by suite (`unit`, `integration`, or `e2e`), then by feature (`components`, `tokens`, `themes`, or `build`).

```sh
npm ci
npx playwright install chromium
npm run storybook          # http://localhost:6006; Corporate/Luna toolbar
npm run tokens             # validate sources; generate CSS and token reference
npm run lint
npm run typecheck
npm test                   # unit tests, browser regressions, Storybook interactions and axe
npm run test:unit           # unit suite only; enforces 100% coverage per production file
npm run test:integration    # integration suite only; independently enforces the same 100% gate
npm run test:unit:affected -- --base origin/main        # coverage-free related development feedback
npm run test:integration:affected -- --base origin/main --dry-run  # explain selection without execution
npm run test:storybook
npm run test:e2e            # Focused Chromium journeys; coverage-free
npm run test:e2e:coverage   # Opt-in diagnostic JavaScript coverage; no percentage gate
npm run build              # ESM, declarations, and explicit CSS exports
npm run build-storybook    # static site in storybook-static
npm run verify:browser     # built CSS contrast, focus, reflow; screenshots in .verification
npm run verify:package     # temporary packed consumer, React 18/19, types and CSS bundling
npm pack                   # installable tarball; prepack rebuilds everything
```

Package verification installs dependencies into a temporary directory and deletes it afterward; it needs npm registry access. Chromium checks run headlessly. Storybook's `a11y.test: 'error'` is wired into its Vitest addon; accessibility violations fail tests. A temporary unnamed-button probe confirmed that behavior.

Unit coverage uses V8 and requires **100% statements, branches, functions, and lines for every included file**. The target includes all TypeScript library source and the token compiler, token generator, and stylesheet packaging scripts. Unimported production files are included in the denominator. Unit tests mock filesystem boundaries and do not launch browsers, use the network, or write generated files.

The re-export-only [public entry point](src/index.ts) has no executable coverage counters. V8 displays 0% for that empty row; all executable code and the aggregate totals reach 100%.

Run `npm run test:unit` or `npm run test:integration` to enforce the thresholds independently. The [unit report](coverage/unit/index.html) and [integration report](coverage/integration/index.html) have separate HTML and JSON outputs. CI runs both coverage gates separately from Storybook, so one suite cannot inflate another's result. Both suites use the same production-code scope; verification harnesses (`scripts/verify-*.mjs`), stories, examples, configuration, declarations, and generated assets are excluded. The re-export-only entry point remains included despite having no executable counters.

Integration tests exercise real JSON parsing, filesystem operations, token compilation, CSS generation, documentation output, and stylesheet packaging. Synthetic token projects use temporary directories that are removed after each test. A command-entry smoke test regenerates the repository's checked-in token CSS and reference and checks that they are unchanged. Token generation's callable operation accepts a project directory URL; the existing CLI still builds the repository's tokens.

Chromium integration tests verify hidden and disabled behavior, theme selection, server rendering followed by React hydration, keyboard activation, form submission/reset, forwarded refs, accessible icon composition, semantic overrides, and visible focus in both themes. Coverage measures JavaScript/TypeScript execution in the Vitest process, including server rendering; the separately bundled browser fixture validates client behavior but does not contribute to those counters. CSS behavior is asserted in the browser, not measured by JavaScript coverage. Storybook interaction and accessibility tests remain necessary even with 100% unit and integration coverage.

### TypeScript strictness

[tsconfig.json](tsconfig.json) enables the complete `strict` family plus checked indexed access, exact optional properties, explicit index-signature access, override checks, exhaustive return paths, unused-code checks, and errors for unreachable code, unused labels, and switch fallthrough. Module checks require type-only imports where appropriate, isolated compilation, erasable TypeScript syntax, consistent filename casing, and resolvable side-effect imports. Emission is blocked on errors. These additional checks are separate from [`strict` in TypeScript](https://www.typescriptlang.org/tsconfig/#strict).

`npm run typecheck` checks both the development project and [tsconfig.build.json](tsconfig.build.json). The library build additionally requires explicit public declaration types through `isolatedDeclarations` and fully checks dependency declarations (`skipLibCheck: false`). The development project retains `skipLibCheck: true` because Storybook 10.6.6's declarations currently fail `exactOptionalPropertyTypes` internally; our TypeScript source, stories, tests, and configuration still receive all strict checks. JavaScript utilities and tests remain ESLint/Vitest checked, outside the TypeScript project (`allowJs: false`). Packed-consumer checks separately verify React 18/19 declarations under NodeNext resolution.

## Planning with OpenSpec

OpenSpec is pinned as a development dependency and restored by `npm ci`. Run its CLI locally with `npx openspec`; no global installation is required. The [project configuration](openspec/config.yaml) uses the `spec-driven` schema. [Specs](openspec/specs) describe accepted behavior; [changes](openspec/changes) hold proposals, designs, spec deltas, and implementation tasks before archiving.

Start a proposal with `$openspec-propose "your idea"` in Codex or `/opsx-propose "your idea"` in GitHub Copilot. Review the generated artifacts, then use `$openspec-apply-change` or `/opsx-apply` to implement the change. Restart the IDE to discover the generated skills and commands.

```sh
npx openspec list                              # active changes
npx openspec list --specs                      # accepted specs
npx openspec validate --all --strict --no-interactive
npx openspec update                            # refresh generated tool integrations
```

The initial setup contains no proposals or accepted specs. For future work, consult the existing [foundation](docs/foundation.md) and repository guidelines when writing artifacts; implementation continues to use the existing test and verification commands above. See the [official OpenSpec setup documentation](https://openspec.dev/docs/setup) for the workflow and tool integrations.

[Foundation](docs/foundation.md) · [Implementation plan](docs/implementation-plan.md) · [Verification results and gaps](docs/verification.md)

## Icon and optional named artwork

`Icon` owns one SVG root; supply trusted SVG children such as paths/groups, not a nested SVG or a markup string. It defaults to a 24×24 viewBox, medium (20px) dimensions, no fill, and a currentColor outline. Custom artwork can change viewBox, fill, and stroke. It adds no margin or parent gap.

```tsx
import { Button, Icon, MoonIcon, CheckIcon, type IconStyle } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

<Icon label="Custom shape" viewBox="0 0 32 32" fill="currentColor" stroke="none">
  <path d="M4 4h24v24H4Z" />
</Icon>
<Button><CheckIcon /><span>Save changes</span></Button>
<Button aria-label="Switch to night mode"><MoonIcon /></Button>
<MoonIcon label="Night mode" size="large" />
```

Omit `label` for decoration. Omitted, empty, and whitespace-only labels produce `aria-hidden="true"`. A nonblank label is trimmed and exposes `role="img"` with that accessible name. SVGs stay non-focusable; name an icon-only Button on the Button itself. Icon owns role, naming/focus attributes, and width/height, so these are excluded from its native SVG props and stripped from untyped inputs. Compatible native SVG attributes, handlers, SVG refs, className, and style pass through. Consumer artwork must avoid focusable descendants and conflicting title-based naming; consumers own unique IDs used by their artwork.

| Prop | Contract |
| --- | --- |
| `children` | Consumer SVG artwork; available on Icon only |
| `viewBox` | Defaults to `0 0 24 24`; customizable on Icon only |
| `size` | `small` 16px, `medium` 20px (default), `large` 24px |
| `label` | Optional accessible image name; omit for decoration |
| `ref` | Native `SVGSVGElement` access |
| `className`, `style` | SVG customization and public semantic overrides |

All named artwork uses a shared 24×24 outline convention with round caps/joins. Each export composes Icon, supports the same size/label/ref/customization contract, and owns its artwork and viewBox. Import only what you need; unused artwork is removable from production bundles. There is no runtime name registry or icon collection dependency.

| Export | Intended use |
| --- | --- |
| `MoonIcon` | Night mode and celestial accents |
| `SunIcon` | Light mode |
| `CheckIcon` | Success and confirmation |
| `CloseIcon` | Dismiss or cancel |
| `ChevronDownIcon` | Expand a section or menu |
| `ArrowRightIcon` | Continue or navigate forward |
| `PlusIcon` | Add or create |
| `ExternalLinkIcon` | Indicate an external destination |

For selective CSS, import `fletchstack-ui/tokens.css` then `fletchstack-ui/icon.css`, adding `button.css` when composing Button. Combined `styles.css` includes all three. JavaScript imports no styles or browser globals, so SSR needs no CSS loader. Corporate and Luna share icon geometry; icons inherit the context's semantic color, including Button interaction states.

```tsx
const brandIconStyle: IconStyle = {
  '--fs-icon-size-medium': '28px',
  '--fs-icon-stroke-width': 3,
};
<div style={brandIconStyle}><MoonIcon /><SunIcon label="Daytime" /></div>
```

Public tokens are `--fs-icon-size-small`, `--fs-icon-size-medium`, `--fs-icon-size-large`, and `--fs-icon-stroke-width`. Dimensions use fixed CSS pixels; text enlargement does not double the artwork. Stroke width is unitless SVG user units and scales with the viewBox. Scoped overrides inherit until a nested explicit theme resets them. Keep icon/text contrast appropriate to the containing surface when overriding colors.

To add a named icon, create a small ref-forwarding component that renders Icon with fixed 24×24 SVG children, export it individually, and extend the catalog stories and contract tests. Keep artwork within the viewBox with stroke clearance. Preserve unused-icon removal through the packed-bundle checks. See [Icon stories](src/components/icon/stories/Icon.stories.tsx) for custom artwork and the catalog.

### Search the icon collection

Open **Components → Icon → Gallery** in Storybook to browse named artwork, export names, and intended uses. Search names, uses, or curated synonyms (for example, `new` finds PlusIcon). Matching is an immediate literal substring, ignoring case and surrounding whitespace; blank input shows all eight icons. The result count announces updates, and **Clear search** restores all results and focus to search. Cards have no actions. Use the existing **Catalog** story to compare all three sizes in both themes; Gallery follows the Corporate/Luna toolbar selection by default; its Theme selector can also set a local Corporate or Luna preview. Use the Preview size radio group to compare 16, 20, and 24px artwork.

Gallery metadata and search UI are Storybook-only and introduce no React library export or runtime dependency. The semantic `--fs-gallery-*` properties style the documentation surface and controls; see the generated [token reference](docs/tokens.md).

### Spatial system

See the [spatial guide](docs/spatial-system.md) and **Design System → Spatial System** in Storybook for the 4px working rhythm, precision exceptions, and choosing semantic roles. The runnable Spatial Examples demonstrate parent-owned gaps, scoped/nested overrides, and responsive section spacing. Use `--fs-space-gap-actions` for sibling actions, `--fs-space-inset-container` for container padding, and `--fs-layout-section-gap` for major sections. Existing spacing names and defaults remain supported; the guide records gallery padding/height coupling corrections.

## Contributing component examples and tests

See [component organization](docs/component-organization.md) for family ownership, stable Storybook links, and development/package boundaries, and the [test guide](tests/README.md) for focused and complete verification commands.

## Radio

[Radio](docs/radio.md) is a native mutually exclusive choice with a visible label, optional descriptions/errors, controlled or uncontrolled selection, and Corporate/Luna styles. Compose related options with FormGroup and a shared name. Import the combined stylesheet or tokens.css + field.css + radio.css. See Components → Forms → Radio in Storybook.

## Link

[Link](docs/link.md) preserves native navigation, inherited typography, underlines, and explicit new-tab announcements. Omit href for unavailable text; external icons do not change the target. Find inline/standalone and Corporate/Luna examples under Components → Navigation → Link. Import combined styles or tokens.css + link.css.

## Switch

[Switch](docs/switch.md) turns a setting on or off with a stable label, native keyboard/form behavior, controlled or uncontrolled state, and Corporate/Luna styles. Find it under Components → Forms → Switch. Import combined styles or tokens.css + field.css + switch.css.

## Spinner

[Spinner](docs/spinner.md) shows unknown-duration loading with inherited color, 16/20/24px sizes, status text, decorative reuse, and reduced-motion support. Consumers own pending/busy state and removal on completion. Find it under Components → Feedback → Spinner. Import combined styles or tokens.css + spinner.css.

## Badge

Passive status, category, and exact-count pills with five semantic tones, optional decorative artwork, and Corporate/Luna themes. Import `Badge` from the package and load `badge.css` with the tokens, or use `styles.css`. See the [Badge contract](docs/badge.md).

## Separator

Horizontal and vertical rules with decorative grouping or opt-in semantic separation, theme tokens, and parent-owned spacing. Import `Separator` and load `separator.css` with tokens, or use `styles.css`. See the [Separator contract](docs/separator.md).

## Container

Optional centered reading/content/wide page widths with responsive inline gutters and no surface or child layout. Load `container.css` with tokens or use combined styles. Ordinary wrappers remain supported; see the [Container contract](docs/container.md) and [spatial guide](docs/spatial-system.md).

## Stack

Optional vertical direct-child layout with existing semantic gap roles and logical cross-axis alignment. Preserves child margins/order and composes with Container and fields. Load `stack.css` plus tokens, or combined styles. See the [Stack contract](docs/stack.md) and [spatial guide](docs/spatial-system.md).

## Cluster

Optional intrinsic wrapping rows with existing semantic gaps, per-row alignment and logical justification. Preserves child widths, margins and native interactions; composes with Container and Stack. Load `cluster.css` plus tokens, or combined styles. See the [Cluster contract](docs/cluster.md) and [spatial guide](docs/spatial-system.md).

## SimpleGrid

Optional equal-width auto-fit collection columns with a 240px preferred minimum and related/group/zero semantic gaps. Responds to parent width and shrinks to fit narrow parents. Load `simple-grid.css` plus tokens, or combined styles. See the [SimpleGrid contract](docs/simple-grid.md).

## AspectRatio

Optional proportional media frame, defaulting to 16:9 with positive numeric ratios. The child owns fitting and accessibility; captions remain outside and overflow stays visible. Load `aspect-ratio.css` or combined styles. See the [AspectRatio contract](docs/aspect-ratio.md).

## Section

Optional native page topic with compact 32px, default 64px or spacious 96px block padding; use `as="div"` for a visual wrapper. Container owns width/gutters; child layouts and parent gaps remain independent. Load `section.css` plus tokens, or combined styles. See the [Section contract](docs/section.md).
