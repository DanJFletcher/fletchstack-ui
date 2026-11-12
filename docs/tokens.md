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
| `--fs-card-border-width` | Decorative card boundary thickness. | dimension |
| `--fs-card-padding-small` | Compact region padding. | dimension |
| `--fs-card-padding-medium` | Default region padding. | dimension |
| `--fs-card-padding-large` | Spacious region padding. | dimension |
| `--fs-card-gap` | Vertical separation between content children. | dimension |
| `--fs-card-footer-gap` | Separation between wrapping footer children. | dimension |
| `--fs-card-media-width` | Preferred horizontal media width before wrapping. | dimension |
| `--fs-card-content-width` | Preferred horizontal body width before wrapping. | dimension |
| `--fs-card-surface` | Default card surface. | color |
| `--fs-card-filled-surface` | Filled card surface. | color |
| `--fs-card-text` | Card primary text. | color |
| `--fs-card-muted` | Card supporting text. | color |
| `--fs-card-border` | Decorative card and footer border. | color |
| `--fs-card-media-surface` | Card media background. | color |
| `--fs-card-radius` | Card corner radius. | dimension |
| `--fs-card-font-family` | Card body and title font family. | fontFamily |
| `--fs-card-font-size` | Card body font size. | dimension |
| `--fs-card-font-line-height` | Card body line height. | number |
| `--fs-card-title-font-size` | Card title font size. | dimension |
| `--fs-card-title-font-weight` | Card title emphasis. | fontWeight |
| `--fs-card-title-font-line-height` | Card title line height. | number |
| `--fs-select-surface` | Select closed control and native option surface. | color |
| `--fs-select-text` | Select field and control foreground. | color |
| `--fs-select-muted` | Select helper and placeholder text. | color |
| `--fs-select-border` | Select default control boundary. | color |
| `--fs-select-hover-border` | Select hovered enabled boundary. | color |
| `--fs-select-error` | Select invalid boundary and error message. | color |
| `--fs-select-disabled-surface` | Disabled select background. | color |
| `--fs-select-disabled-text` | Disabled select foreground. | color |
| `--fs-select-disabled-border` | Disabled select boundary. | color |
| `--fs-select-radius` | Select control corner radius. | dimension |
| `--fs-select-border-width` | Select boundary thickness. | dimension |
| `--fs-select-gap` | Select label, control, and message separation. | dimension |
| `--fs-select-padding-inline` | Select horizontal inset. | dimension |
| `--fs-select-chevron-clearance` | Select end padding reserved for decorative chevron. | dimension |
| `--fs-select-chevron-size` | Select chevron dimensions. | dimension |
| `--fs-select-focus-color` | Select keyboard focus indicator. | color |
| `--fs-select-focus-width` | Select focus outline thickness. | dimension |
| `--fs-select-focus-offset` | Select focus outline offset. | dimension |
| `--fs-select-font-family` | Select label, control, and message family. | fontFamily |
| `--fs-select-font-size` | Select body size. | dimension |
| `--fs-select-font-message` | Select supporting text size. | dimension |
| `--fs-select-font-weight` | Select label emphasis. | fontWeight |
| `--fs-select-font-line-height` | Select text line height. | number |
| `--fs-select-size-small-padding` | small select vertical padding. | dimension |
| `--fs-select-size-small-minimum` | small select minimum control height. | dimension |
| `--fs-select-size-medium-padding` | medium select vertical padding. | dimension |
| `--fs-select-size-medium-minimum` | medium select minimum control height. | dimension |
| `--fs-select-size-large-padding` | large select vertical padding. | dimension |
| `--fs-select-size-large-minimum` | large select minimum control height. | dimension |
| `--fs-text-input-surface` | Text input control surface. | color |
| `--fs-text-input-text` | Text input field and control foreground. | color |
| `--fs-text-input-muted` | Text input helper and placeholder text. | color |
| `--fs-text-input-border` | Text input default control boundary. | color |
| `--fs-text-input-hover-border` | Text input hovered enabled boundary. | color |
| `--fs-text-input-error` | Text input invalid boundary and error message. | color |
| `--fs-text-input-disabled-surface` | Disabled text input background. | color |
| `--fs-text-input-disabled-text` | Disabled text input foreground. | color |
| `--fs-text-input-disabled-border` | Disabled text input boundary. | color |
| `--fs-text-input-radius` | Text input control corner radius. | dimension |
| `--fs-text-input-border-width` | Text input boundary thickness. | dimension |
| `--fs-text-input-gap` | Text input label, control, and message separation. | dimension |
| `--fs-text-input-padding-inline` | Text input horizontal padding. | dimension |
| `--fs-text-input-focus-color` | Text input keyboard focus indicator. | color |
| `--fs-text-input-focus-width` | Text input focus outline thickness. | dimension |
| `--fs-text-input-focus-offset` | Text input focus outline offset. | dimension |
| `--fs-text-input-font-family` | Text input label, control, and message family. | fontFamily |
| `--fs-text-input-font-size` | Text input body size. | dimension |
| `--fs-text-input-font-message` | Text input supporting text size. | dimension |
| `--fs-text-input-font-weight` | Text input label emphasis. | fontWeight |
| `--fs-text-input-font-line-height` | Text input text line height. | number |
| `--fs-text-input-size-small-padding` | small text input vertical padding. | dimension |
| `--fs-text-input-size-small-minimum` | small text input minimum control height. | dimension |
| `--fs-text-input-size-medium-padding` | medium text input vertical padding. | dimension |
| `--fs-text-input-size-medium-minimum` | medium text input minimum control height. | dimension |
| `--fs-text-input-size-large-padding` | large text input vertical padding. | dimension |
| `--fs-text-input-size-large-minimum` | large text input minimum control height. | dimension |
| `--fs-text-input-placeholder` | Text input example placeholder foreground. | color |
| `--fs-text-input-adornment-text` | Text input non-editable prefix and suffix text. | color |
| `--fs-text-input-adornment-border` | Text input decorative prefix and suffix separator. | color |
| `--fs-text-input-adornment-gap` | Text input separation around prefix and suffix content. | dimension |
| `--fs-text-input-preferred-width` | Preferred input width before grouped adornments wrap. | dimension |
| `--fs-checkbox-surface` | Unchecked checkbox surface. | color |
| `--fs-checkbox-text` | Checkbox visible label foreground. | color |
| `--fs-checkbox-muted` | Checkbox description foreground. | color |
| `--fs-checkbox-border` | Unchecked checkbox boundary. | color |
| `--fs-checkbox-hover-border` | Hovered checkbox boundary. | color |
| `--fs-checkbox-selected-surface` | Checked or mixed checkbox surface. | color |
| `--fs-checkbox-selected-border` | Checked or mixed checkbox boundary. | color |
| `--fs-checkbox-selected-hover-surface` | Hovered checked or mixed surface. | color |
| `--fs-checkbox-selected-hover-border` | Hovered checked or mixed boundary. | color |
| `--fs-checkbox-mark` | Checkbox tick and mixed dash foreground. | color |
| `--fs-checkbox-error` | Invalid checkbox boundary and error message. | color |
| `--fs-checkbox-disabled-surface` | Disabled unchecked checkbox surface. | color |
| `--fs-checkbox-disabled-selected-surface` | Disabled checked or mixed checkbox surface. | color |
| `--fs-checkbox-disabled-border` | Disabled checkbox boundary. | color |
| `--fs-checkbox-disabled-text` | Disabled checkbox label and description. | color |
| `--fs-checkbox-disabled-mark` | Disabled checkbox tick and dash foreground. | color |
| `--fs-checkbox-control-size` | Checkbox control dimensions. | dimension |
| `--fs-checkbox-mark-size` | Checkbox mark dimensions. | dimension |
| `--fs-checkbox-mark-stroke` | Checkbox mark stroke in SVG user units. | number |
| `--fs-checkbox-hit-area` | Minimum clickable checkbox label height and width. | dimension |
| `--fs-checkbox-label-gap` | Separation between checkbox and label text. | dimension |
| `--fs-checkbox-label-padding` | Vertical checkbox label padding. | dimension |
| `--fs-checkbox-description-gap` | Separation between label and description. | dimension |
| `--fs-checkbox-radius` | Small checkbox control corner radius in both themes. | dimension |
| `--fs-checkbox-border-width` | Checkbox boundary thickness. | dimension |
| `--fs-checkbox-font-family` | Checkbox label and message font family. | fontFamily |
| `--fs-checkbox-font-size` | Checkbox label text size. | dimension |
| `--fs-checkbox-font-description` | Checkbox description and error text size. | dimension |
| `--fs-checkbox-font-weight` | Checkbox label emphasis. | fontWeight |
| `--fs-checkbox-font-line-height` | Checkbox text line height. | number |
| `--fs-checkbox-focus-color` | Checkbox keyboard focus indicator. | color |
| `--fs-checkbox-focus-width` | Checkbox focus outline thickness. | dimension |
| `--fs-checkbox-focus-offset` | Checkbox focus clearance. | dimension |
| `--fs-form-group-text` | Form group legend and default text. | color |
| `--fs-form-group-muted` | Form group description and helper text. | color |
| `--fs-form-group-error` | Form group validation message. | color |
| `--fs-form-group-legend-gap` | Spacing after the shared legend and context. | dimension |
| `--fs-form-group-control-gap` | Spacing between related controls. | dimension |
| `--fs-form-group-message-gap` | Spacing before group helper and error messages. | dimension |
| `--fs-form-group-font-family` | Form group font family. | fontFamily |
| `--fs-form-group-font-size` | Form group legend text size. | dimension |
| `--fs-form-group-font-description` | Form group description and message text size. | dimension |
| `--fs-form-group-font-weight` | Form group legend emphasis. | fontWeight |
| `--fs-form-group-font-line-height` | Form group text line height. | number |
| `--fs-field-text` | Field label and default text. | color |
| `--fs-field-muted` | Field description and helper text. | color |
| `--fs-field-error` | Field validation message. | color |
| `--fs-field-font-family` | Field font family. | fontFamily |
| `--fs-field-font-size` | Field label text size. | dimension |
| `--fs-field-font-description` | Field description and message text size. | dimension |
| `--fs-field-font-weight` | Field label emphasis. | fontWeight |
| `--fs-field-font-line-height` | Field text line height. | number |
| `--fs-field-gap` | Spacing after the field label, control, and messages. | dimension |
| `--fs-textarea-text` | Textarea field and control foreground. | color |
| `--fs-textarea-surface` | Textarea control surface. | color |
| `--fs-textarea-border` | Textarea default control boundary. | color |
| `--fs-textarea-radius` | Textarea control corner radius. | dimension |
| `--fs-textarea-border-width` | Textarea boundary thickness. | dimension |
| `--fs-textarea-padding-inline` | Textarea horizontal padding. | dimension |
| `--fs-textarea-gap` | Textarea label, control, and message separation. | dimension |
| `--fs-textarea-font-family` | Textarea label, control, and message family. | fontFamily |
| `--fs-textarea-font-size` | Textarea body size. | dimension |
| `--fs-textarea-font-message` | Textarea supporting text size. | dimension |
| `--fs-textarea-font-weight` | Textarea label emphasis. | fontWeight |
| `--fs-textarea-font-line-height` | Textarea text line height. | number |
| `--fs-textarea-muted` | Textarea helper and placeholder text. | color |
| `--fs-textarea-error` | Textarea invalid boundary and error message. | color |
| `--fs-textarea-placeholder` | Textarea example placeholder foreground. | color |
| `--fs-textarea-hover-border` | Textarea hovered enabled boundary. | color |
| `--fs-textarea-disabled-surface` | Disabled textarea background. | color |
| `--fs-textarea-disabled-text` | Disabled textarea foreground. | color |
| `--fs-textarea-disabled-border` | Disabled textarea boundary. | color |
| `--fs-textarea-focus-color` | Textarea keyboard focus indicator. | color |
| `--fs-textarea-focus-width` | Textarea focus outline thickness. | dimension |
| `--fs-textarea-focus-offset` | Textarea focus outline offset. | dimension |
| `--fs-textarea-minimum-height` | Textarea minimum height before native rows or resizing. | dimension |
| `--fs-textarea-padding-block` | Textarea vertical content padding. | dimension |
| `--fs-radio-surface` | Unchecked radio surface. | color |
| `--fs-radio-text` | Radio visible label foreground. | color |
| `--fs-radio-muted` | Radio description foreground. | color |
| `--fs-radio-border` | Unchecked radio boundary. | color |
| `--fs-radio-error` | Invalid radio boundary and error message. | color |
| `--fs-radio-disabled-surface` | Disabled unchecked radio surface. | color |
| `--fs-radio-disabled-border` | Disabled radio boundary. | color |
| `--fs-radio-disabled-text` | Disabled radio label and description. | color |
| `--fs-radio-control-size` | Radio control dimensions. | dimension |
| `--fs-radio-hit-area` | Minimum clickable radio label height and width. | dimension |
| `--fs-radio-label-gap` | Separation between radio and label text. | dimension |
| `--fs-radio-label-padding` | Vertical radio label padding. | dimension |
| `--fs-radio-description-gap` | Separation between label and description. | dimension |
| `--fs-radio-border-width` | Radio boundary thickness. | dimension |
| `--fs-radio-font-family` | Radio label and message font family. | fontFamily |
| `--fs-radio-font-size` | Radio label text size. | dimension |
| `--fs-radio-font-description` | Radio description and error text size. | dimension |
| `--fs-radio-font-weight` | Radio label emphasis. | fontWeight |
| `--fs-radio-font-line-height` | Radio text line height. | number |
| `--fs-radio-focus-color` | Radio keyboard focus indicator. | color |
| `--fs-radio-focus-width` | Radio focus outline thickness. | dimension |
| `--fs-radio-focus-offset` | Radio focus clearance. | dimension |
| `--fs-radio-hover-border` | Hovered radio boundary. | color |
| `--fs-radio-selected-border` | Selected radio boundary. | color |
| `--fs-radio-dot` | Selected radio dot. | color |
| `--fs-radio-disabled-dot` | Disabled selected radio dot. | color |
| `--fs-radio-dot-size` | Selected radio dot dimensions. | dimension |
| `--fs-link-text` | Unvisited link text and decorative icon. | color |
| `--fs-link-visited` | Visited link foreground; native browser history owns this state. | color |
| `--fs-link-hover` | Hovered link foreground. | color |
| `--fs-link-active` | Active link foreground. | color |
| `--fs-link-unavailable` | Unavailable destination text. | color |
| `--fs-link-inline-weight` | Inline link weight. | fontWeight |
| `--fs-link-standalone-weight` | Standalone navigation emphasis. | fontWeight |
| `--fs-link-underline-width` | Resting link underline thickness. | dimension |
| `--fs-link-hover-underline-width` | Hovered link underline thickness. | dimension |
| `--fs-link-underline-offset` | Separation between text and underline. | dimension |
| `--fs-link-icon-gap` | Space between link text and destination icon. | dimension |
| `--fs-link-icon-size` | Destination icon dimensions. | dimension |
| `--fs-link-focus-color` | Link keyboard focus outline. | color |
| `--fs-link-focus-width` | Link focus outline thickness. | dimension |
| `--fs-link-focus-offset` | Link focus outline clearance. | dimension |
| `--fs-link-focus-radius` | Link focus outline corner radius. | dimension |
| `--fs-switch-off-surface` | Off-state switch track. | color |
| `--fs-switch-off-border` | Off-state switch boundary. | color |
| `--fs-switch-off-hover-surface` | Hovered off-state track. | color |
| `--fs-switch-off-hover-border` | Hovered off-state boundary. | color |
| `--fs-switch-on-surface` | On-state switch track. | color |
| `--fs-switch-on-border` | On-state switch boundary. | color |
| `--fs-switch-on-hover-surface` | Hovered on-state track. | color |
| `--fs-switch-on-hover-border` | Hovered on-state boundary. | color |
| `--fs-switch-off-thumb` | Off-state thumb foreground. | color |
| `--fs-switch-on-thumb` | On-state thumb foreground. | color |
| `--fs-switch-disabled-off-surface` | Disabled off-state track. | color |
| `--fs-switch-disabled-on-surface` | Disabled on-state track. | color |
| `--fs-switch-disabled-border` | Disabled track boundary. | color |
| `--fs-switch-disabled-off-thumb` | Disabled off-state thumb. | color |
| `--fs-switch-disabled-on-thumb` | Disabled on-state thumb. | color |
| `--fs-switch-track-width` | Switch track width. | dimension |
| `--fs-switch-track-height` | Switch track height. | dimension |
| `--fs-switch-thumb-size` | Circular thumb dimensions. | dimension |
| `--fs-switch-thumb-inset` | Thumb clearance inside the track boundary. | dimension |
| `--fs-switch-radius` | Pill track corner radius. | dimension |
| `--fs-switch-text` | Switch visible label foreground. | color |
| `--fs-switch-muted` | Switch description foreground. | color |
| `--fs-switch-disabled-text` | Disabled switch label and description. | color |
| `--fs-switch-border-width` | Switch boundary thickness. | dimension |
| `--fs-switch-hit-area` | Minimum clickable switch label height and width. | dimension |
| `--fs-switch-label-gap` | Separation between switch and label text. | dimension |
| `--fs-switch-label-padding` | Vertical switch label padding. | dimension |
| `--fs-switch-description-gap` | Separation between label and description. | dimension |
| `--fs-switch-font-family` | Switch label and message font family. | fontFamily |
| `--fs-switch-font-size` | Switch label text size. | dimension |
| `--fs-switch-font-description` | Switch description and error text size. | dimension |
| `--fs-switch-font-weight` | Switch label emphasis. | fontWeight |
| `--fs-switch-font-line-height` | Switch text line height. | number |
| `--fs-switch-focus-color` | Switch keyboard focus indicator. | color |
| `--fs-switch-focus-width` | Switch focus outline thickness. | dimension |
| `--fs-switch-focus-offset` | Switch focus clearance. | dimension |
| `--fs-spinner-stroke-width` | Spinner stroke width in SVG viewBox units. | number |
| `--fs-spinner-label-gap` | Separation between spinner artwork and status text. | dimension |
| `--fs-spinner-track-opacity` | Faint full-circle track opacity. | number |
| `--fs-spinner-rotation-seconds` | Seconds per steady rotation; converted with CSS calc and 1s. | number |
| `--fs-spinner-accent` | Optional spinner accent; default artwork inherits its surrounding text color. | color |
| `--fs-spinner-size-small` | Small spinner artwork dimensions. | dimension |
| `--fs-spinner-size-medium` | Medium spinner artwork dimensions. | dimension |
| `--fs-spinner-size-large` | Large spinner artwork dimensions. | dimension |
| `--fs-badge-neutral-background` | Neutral badge fill. | color |
| `--fs-badge-neutral-text` | Neutral badge text and decorative artwork. | color |
| `--fs-badge-info-background` | Info badge fill. | color |
| `--fs-badge-info-text` | Info badge text and decorative artwork. | color |
| `--fs-badge-success-background` | Success badge fill. | color |
| `--fs-badge-success-text` | Success badge text and decorative artwork. | color |
| `--fs-badge-warning-background` | Warning badge fill. | color |
| `--fs-badge-warning-text` | Warning badge text and decorative artwork. | color |
| `--fs-badge-danger-background` | Danger badge fill. | color |
| `--fs-badge-danger-text` | Danger badge text and decorative artwork. | color |
| `--fs-badge-minimum-height` | Minimum badge height; text can grow. | dimension |
| `--fs-badge-padding-inline` | Badge horizontal padding. | dimension |
| `--fs-badge-padding-block` | Badge vertical padding. | dimension |
| `--fs-badge-radius` | Badge pill radius. | dimension |
| `--fs-badge-icon-size` | Optional badge artwork dimensions. | dimension |
| `--fs-badge-icon-gap` | Badge artwork and label separation. | dimension |
| `--fs-badge-outline-width` | Badge boundary in forced colors. | dimension |
| `--fs-badge-font-family` | Badge font family. | fontFamily |
| `--fs-badge-font-size` | Badge text size. | dimension |
| `--fs-badge-font-weight` | Badge text emphasis. | fontWeight |
| `--fs-badge-font-line-height` | Badge text line height. | number |
| `--fs-separator-color` | Neutral static separator rule. | color |
| `--fs-separator-thickness` | Separator thickness in either orientation. | dimension |
| `--fs-container-max-width-reading` | Reading Container maximum, including inline gutters. | dimension |
| `--fs-container-max-width-content` | Content Container maximum, including inline gutters. | dimension |
| `--fs-container-max-width-wide` | Wide Container maximum, including inline gutters. | dimension |
| `--fs-container-gutter-small` | Container inline gutter below 600px viewport width. | dimension |
| `--fs-container-gutter-large` | Container inline gutter at and above 600px viewport width. | dimension |
| `--fs-simple-grid-min-item-width` | Preferred SimpleGrid item minimum; a single column shrinks below this width to fit its parent. | dimension |
| `--fs-section-padding-compact` | Section compact padding at each block edge; independent of sibling section gaps. | dimension |
| `--fs-section-padding-default` | Section default padding at each block edge; independent of sibling section gaps. | dimension |
| `--fs-section-padding-spacious` | Section spacious padding at each block edge; independent of sibling section gaps. | dimension |
| `--fs-typography-heading-family` | Content heading font family. | fontFamily |
| `--fs-typography-heading-weight` | Content heading emphasis. | fontWeight |
| `--fs-typography-heading-line-height` | Content heading line height, unitless. | number |
| `--fs-typography-heading-color` | Content heading foreground on its themed surface. | color |
| `--fs-typography-heading-font-page` | page content heading font size. | dimension |
| `--fs-typography-heading-font-section` | section content heading font size. | dimension |
| `--fs-typography-heading-font-subheading` | subheading content heading font size. | dimension |
| `--fs-typography-text-family` | Content text font family. | fontFamily |
| `--fs-typography-text-weight` | Content text weight. | fontWeight |
| `--fs-typography-text-line-height` | Content text line height, unitless. | number |
| `--fs-typography-text-color` | Default content text foreground. | color |
| `--fs-typography-text-muted` | Supporting content text foreground with AA contrast. | color |
| `--fs-typography-text-font-lead` | lead content text font size. | dimension |
| `--fs-typography-text-font-body` | body content text font size. | dimension |
| `--fs-typography-text-font-small` | small content text font size. | dimension |
| `--fs-code-block-surface` | Code viewport surface. | color |
| `--fs-code-block-header-surface` | Code metadata header surface. | color |
| `--fs-code-block-text` | Literal source foreground. | color |
| `--fs-code-block-muted` | Supporting language metadata foreground. | color |
| `--fs-code-block-border` | Code panel and header boundary. | color |
| `--fs-code-block-border-width` | Code panel boundary thickness. | dimension |
| `--fs-code-block-radius` | Code panel corner radius. | dimension |
| `--fs-code-block-inset` | Code viewport inset on each edge. | dimension |
| `--fs-code-block-header-padding` | Code metadata header block padding. | dimension |
| `--fs-code-block-header-gap` | Gap between wrapping code metadata and copy action. | dimension |
| `--fs-code-block-font-family` | Literal source monospace family. | fontFamily |
| `--fs-code-block-font-size` | Literal source font size. | dimension |
| `--fs-code-block-font-line-height` | Literal source unitless line height. | number |
| `--fs-code-block-font-weight` | Literal source font weight. | fontWeight |
| `--fs-code-block-label-family` | Code metadata and feedback font family. | fontFamily |
| `--fs-code-block-label-weight` | Filename emphasis. | fontWeight |
| `--fs-code-block-error` | Copy failure text and action boundary. | color |
| `--fs-code-block-error-surface` | Copy failure action surface. | color |
| `--fs-code-block-success-surface` | Successful copy action surface. | color |
| `--fs-code-block-success-text` | Successful copy action foreground. | color |
| `--fs-code-block-success-border` | Successful copy action boundary. | color |
| `--fs-code-block-focus-color` | Keyboard-scrolled code region focus indicator. | color |
| `--fs-code-block-focus-width` | Code region focus indicator width. | dimension |
| `--fs-code-block-focus-offset` | Code region focus indicator offset. | dimension |
| `--fs-code-block-copy-surface` | Default copy action surface. | color |
| `--fs-code-block-copy-text` | Default copy action foreground. | color |
| `--fs-code-block-copy-border` | Default copy action boundary. | color |
| `--fs-code-block-syntax-comment` | Code syntax comment foreground. | color |
| `--fs-code-block-syntax-keyword` | Code syntax keyword foreground. | color |
| `--fs-code-block-syntax-string` | Code syntax string foreground. | color |
| `--fs-code-block-syntax-number` | Code syntax number foreground. | color |
| `--fs-code-block-syntax-function` | Code syntax function foreground. | color |
| `--fs-code-block-syntax-operator` | Code syntax operator foreground. | color |
| `--fs-avatar-background` | Identity fallback fill. | color |
| `--fs-avatar-text` | Contrasting identity initials. | color |
| `--fs-avatar-size-small` | small identity footprint. | dimension |
| `--fs-avatar-size-medium` | medium identity footprint. | dimension |
| `--fs-avatar-size-large` | large identity footprint. | dimension |
| `--fs-avatar-size-xlarge` | xlarge identity footprint. | dimension |
| `--fs-avatar-radius-rounded` | Rounded identity corners. | dimension |
| `--fs-avatar-radius-square` | Square identity corners. | dimension |
| `--fs-avatar-outline-width` | Forced-color identity boundary. | dimension |
| `--fs-avatar-font-family` | Identity font family. | fontFamily |
| `--fs-avatar-font-weight` | Identity initials emphasis. | fontWeight |
| `--fs-avatar-font-size-small` | small identity initials; capped to fit its footprint. | dimension |
| `--fs-avatar-font-size-medium` | medium identity initials; capped to fit its footprint. | dimension |
| `--fs-avatar-font-size-large` | large identity initials; capped to fit its footprint. | dimension |
| `--fs-avatar-font-size-xlarge` | xlarge identity initials; capped to fit its footprint. | dimension |
| `--fs-avatar-group-overlap` | Overlap between ordered group identities. | dimension |
| `--fs-avatar-group-ring-width` | Separating identity ring thickness. | dimension |
| `--fs-avatar-group-ring-color` | Group identity separating surface. | color |
| `--fs-avatar-group-overflow-background` | Overflow identity fill. | color |
| `--fs-avatar-group-overflow-text` | Overflow count foreground. | color |
| `--fs-avatar-group-viewport-inset` | Minimum disclosure clearance from viewport edges. | dimension |
| `--fs-avatar-group-list-width` | Preferred disclosure list width. | dimension |
| `--fs-avatar-group-list-gap` | Disclosure spacing and row artwork gap. | dimension |
| `--fs-avatar-group-list-padding` | Disclosure row padding. | dimension |
| `--fs-avatar-group-list-radius` | Disclosure corner radius. | dimension |
| `--fs-avatar-group-list-border-width` | Disclosure row and panel boundary. | dimension |
| `--fs-avatar-group-list-border` | Disclosure boundary paint. | color |
| `--fs-avatar-group-list-background` | Disclosure surface. | color |
| `--fs-avatar-group-list-text` | Disclosure names. | color |
| `--fs-avatar-group-list-font-size` | Disclosure name size that follows user preferences. | dimension |
| `--fs-avatar-group-focus-color` | Keyboard focus ring on the themed surface. | color |
| `--fs-avatar-group-focus-width` | Focus ring thickness. | dimension |
| `--fs-avatar-group-focus-offset` | Space between control and focus ring. | dimension |
| `--fs-multi-select-surface` | MultiSelect closed control and popup surface. | color |
| `--fs-multi-select-text` | MultiSelect field and control foreground. | color |
| `--fs-multi-select-muted` | MultiSelect helper and placeholder text. | color |
| `--fs-multi-select-border` | MultiSelect default control boundary. | color |
| `--fs-multi-select-hover-border` | MultiSelect hovered enabled boundary. | color |
| `--fs-multi-select-error` | MultiSelect invalid boundary and error message. | color |
| `--fs-multi-select-disabled-surface` | Disabled MultiSelect background. | color |
| `--fs-multi-select-disabled-text` | Disabled MultiSelect foreground. | color |
| `--fs-multi-select-disabled-border` | Disabled MultiSelect boundary. | color |
| `--fs-multi-select-radius` | MultiSelect control corner radius. | dimension |
| `--fs-multi-select-border-width` | MultiSelect boundary thickness. | dimension |
| `--fs-multi-select-gap` | MultiSelect label, control, and message separation. | dimension |
| `--fs-multi-select-focus-color` | MultiSelect keyboard focus indicator. | color |
| `--fs-multi-select-focus-width` | MultiSelect focus outline thickness. | dimension |
| `--fs-multi-select-focus-offset` | MultiSelect focus outline offset. | dimension |
| `--fs-multi-select-font-family` | MultiSelect label, control, and message family. | fontFamily |
| `--fs-multi-select-font-size` | MultiSelect body size. | dimension |
| `--fs-multi-select-font-message` | MultiSelect supporting text size. | dimension |
| `--fs-multi-select-font-weight` | MultiSelect label emphasis. | fontWeight |
| `--fs-multi-select-font-line-height` | MultiSelect text line height. | number |
| `--fs-multi-select-size-small-padding` | small MultiSelect vertical padding. | dimension |
| `--fs-multi-select-size-small-minimum` | small MultiSelect minimum control height. | dimension |
| `--fs-multi-select-size-medium-padding` | medium MultiSelect vertical padding. | dimension |
| `--fs-multi-select-size-medium-minimum` | medium MultiSelect minimum control height. | dimension |
| `--fs-multi-select-size-large-padding` | large MultiSelect vertical padding. | dimension |
| `--fs-multi-select-size-large-minimum` | large MultiSelect minimum control height. | dimension |
| `--fs-multi-select-tag-surface` | MultiSelected tag and active option background. | color |
| `--fs-multi-select-tag-radius` | MultiSelected tag corners. | dimension |
| `--fs-multi-select-target-size` | Minimum removal target size. | dimension |
| `--fs-multi-select-popup-height` | Scrollable popup maximum height. | dimension |
| `--fs-multi-select-query-width` | Preferred minimum query width before wrapping. | dimension |
| `--fs-multi-select-popup-gap` | Space between the control and its popup. | dimension |
| `--fs-multi-select-option-padding` | Option and tag horizontal inset. | dimension |

Override these properties on a containing element or on Button via style/className. Load override styles after the library. A nested explicit theme resets the contract. Do not use internal primitive names.

Choose a role by its purpose rather than its current value. See the [Spatial system](spatial-system.md) for spacing, sizing, layout ownership, and compatibility guidance.
