# Public semantic tokens

Generated from the Corporate contract; every theme supplies every property. Values resolve from primitives at build time and are redeclared at each theme boundary.

| CSS property | Purpose | DTCG type |
| --- | --- | --- |
| `--fs-surface` | Background of a themed region. | color |
| `--fs-text` | Default text on the themed surface. | color |
| `--fs-font-body` | Body font stack. | fontFamily |
| `--fs-font-size` | Default body size; follows user font preferences. | dimension |
| `--fs-font-line-height` | Body line height, unitless. | number |
| `--fs-space-inline` | inline spacing for consumer layouts. | dimension |
| `--fs-space-stack` | stack spacing for consumer layouts. | dimension |
| `--fs-space-inset` | inset spacing for consumer layouts. | dimension |
| `--fs-space-gap-label` | Gap for closely associated label/control content. | dimension |
| `--fs-space-gap-actions` | Parent-owned gap between sibling actions. | dimension |
| `--fs-space-gap-related` | Gap between related siblings needing more separation. | dimension |
| `--fs-space-stack-group` | Parent-owned separation between related content groups. | dimension |
| `--fs-space-inset-container` | Default padding inside a content container. | dimension |
| `--fs-button-font-family` | Control font stack. | fontFamily |
| `--fs-button-font-weight` | Control label weight. | fontWeight |
| `--fs-button-font-line-height` | Control line height, unitless. | number |
| `--fs-button-radius` | Control corner radius. | dimension |
| `--fs-button-border-width` | Control border thickness. | dimension |
| `--fs-button-gap` | Gap between label and decorative icon. | dimension |
| `--fs-button-focus-color` | Keyboard focus ring on the themed surface. | color |
| `--fs-button-focus-width` | Focus ring thickness. | dimension |
| `--fs-button-focus-offset` | Space between control and focus ring. | dimension |
| `--fs-button-size-small-font` | small label font size. | dimension |
| `--fs-button-size-small-block` | small vertical padding. | dimension |
| `--fs-button-size-small-inline` | small horizontal padding. | dimension |
| `--fs-button-size-small-minimum` | small minimum target width and height. | dimension |
| `--fs-button-size-medium-font` | medium label font size. | dimension |
| `--fs-button-size-medium-block` | medium vertical padding. | dimension |
| `--fs-button-size-medium-inline` | medium horizontal padding. | dimension |
| `--fs-button-size-medium-minimum` | medium minimum target width and height. | dimension |
| `--fs-button-size-large-font` | large label font size. | dimension |
| `--fs-button-size-large-block` | large vertical padding. | dimension |
| `--fs-button-size-large-inline` | large horizontal padding. | dimension |
| `--fs-button-size-large-minimum` | large minimum target width and height. | dimension |
| `--fs-button-primary-default-background` | primary default background. | color |
| `--fs-button-primary-default-text` | primary default label color. | color |
| `--fs-button-primary-default-border` | primary default border color. | color |
| `--fs-button-primary-hover-background` | primary hover background. | color |
| `--fs-button-primary-hover-text` | primary hover label color. | color |
| `--fs-button-primary-hover-border` | primary hover border color. | color |
| `--fs-button-primary-active-background` | primary active background. | color |
| `--fs-button-primary-active-text` | primary active label color. | color |
| `--fs-button-primary-active-border` | primary active border color. | color |
| `--fs-button-secondary-default-background` | secondary default background. | color |
| `--fs-button-secondary-default-text` | secondary default label color. | color |
| `--fs-button-secondary-default-border` | secondary default border color. | color |
| `--fs-button-secondary-hover-background` | secondary hover background. | color |
| `--fs-button-secondary-hover-text` | secondary hover label color. | color |
| `--fs-button-secondary-hover-border` | secondary hover border color. | color |
| `--fs-button-secondary-active-background` | secondary active background. | color |
| `--fs-button-secondary-active-text` | secondary active label color. | color |
| `--fs-button-secondary-active-border` | secondary active border color. | color |
| `--fs-button-ghost-default-background` | ghost default background. | color |
| `--fs-button-ghost-default-text` | ghost default label color. | color |
| `--fs-button-ghost-default-border` | ghost default border color. | color |
| `--fs-button-ghost-hover-background` | ghost hover background. | color |
| `--fs-button-ghost-hover-text` | ghost hover label color. | color |
| `--fs-button-ghost-hover-border` | ghost hover border color. | color |
| `--fs-button-ghost-active-background` | ghost active background. | color |
| `--fs-button-ghost-active-text` | ghost active label color. | color |
| `--fs-button-ghost-active-border` | ghost active border color. | color |
| `--fs-button-disabled-background` | Disabled control background. | color |
| `--fs-button-disabled-text` | Disabled control text. | color |
| `--fs-button-disabled-border` | Disabled control border. | color |
| `--fs-icon-size-small` | Small icon width and height in CSS pixels. | dimension |
| `--fs-icon-size-medium` | Medium icon width and height in CSS pixels. | dimension |
| `--fs-icon-size-large` | Large icon width and height in CSS pixels. | dimension |
| `--fs-icon-stroke-width` | Outline stroke width in SVG user units; scales with the viewBox. | number |
| `--fs-gallery-surface` | Gallery background. | color |
| `--fs-gallery-panel` | Raised documentation panels and selected-control group background. | color |
| `--fs-gallery-text` | Gallery primary text and artwork. | color |
| `--fs-gallery-muted` | Gallery supporting text; maintains AA contrast. | color |
| `--fs-gallery-border` | Decorative card and divider boundaries. | color |
| `--fs-gallery-control-border` | Interactive field boundaries; at least 3:1 against the surface. | color |
| `--fs-gallery-accent` | Selected preview-size fill. | color |
| `--fs-gallery-on-accent` | Text on the selected preview size. | color |
| `--fs-gallery-focus` | Gallery keyboard focus indicator. | color |
| `--fs-gallery-radius` | Gallery card and control corner radius. | dimension |
| `--fs-gallery-border-width` | Gallery boundary thickness. | dimension |
| `--fs-gallery-control-height` | Minimum gallery input and preview-size target height. | dimension |
| `--fs-gallery-card-height` | Minimum gallery card height; grows with content. | dimension |
| `--fs-gallery-column-width` | Minimum preferred gallery column width before wrapping. | dimension |
| `--fs-gallery-gap` | Gallery grid and control spacing. | dimension |
| `--fs-gallery-inset` | Gallery section and card insets. | dimension |
| `--fs-gallery-compact-inset` | Compact gallery control inset. | dimension |
| `--fs-gallery-artwork-gap` | Space below gallery artwork. | dimension |
| `--fs-gallery-focus-width` | Visible keyboard outline thickness. | dimension |
| `--fs-gallery-focus-offset` | Outline clearance around gallery controls. | dimension |
| `--fs-gallery-font-body` | Gallery body text size. | dimension |
| `--fs-gallery-font-caption` | Gallery metadata and export-name size. | dimension |
| `--fs-gallery-font-heading` | Gallery title size. | dimension |
| `--fs-gallery-font-mono` | Gallery export names and code samples. | fontFamily |
| `--fs-gallery-font-weight` | Gallery heading and brand emphasis. | fontWeight |
| `--fs-gallery-font-heading-line-height` | Compact gallery heading line height, unitless. | number |
| `--fs-gallery-clear-size` | Minimum explicit clear-search target size. | dimension |
| `--fs-gallery-search-padding-inline` | Search horizontal padding, independent of minimum control height. | dimension |
| `--fs-gallery-search-padding-block` | Search vertical padding, independent of other compact insets. | dimension |
| `--fs-gallery-heading-gap` | Separation after the gallery heading, independent of container inset. | dimension |
| `--fs-gallery-preview-inset` | Technical edge inset inside preview-size boundaries; not a general spacing step. | dimension |
| `--fs-layout-section-gap` | Separation between major website sections; may be overridden responsively. | dimension |

Override these properties on a containing element or on Button via style/className. Load override styles after the library. A nested explicit theme resets the contract. Do not use internal primitive names.

Choose a role by its purpose rather than its current value. See the [Spatial system](spatial-system.md) for spacing, sizing, layout ownership, and compatibility guidance.
