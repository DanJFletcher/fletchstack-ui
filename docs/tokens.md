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

Override these properties on a containing element or on Button via style/className. Load override styles after the library. A nested explicit theme resets the contract. Do not use internal primitive names.
