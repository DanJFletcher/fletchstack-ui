# Design tokens

Use [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/format/) as the interchange format. Keep two layers.

- **Primitives** hold raw design values such as palette colors, spacing steps, and font sizes. Keep them internal to the token system.
- **Semantics** assign a purpose to those values through aliases or compositions. Name them by use, such as `space.control.inline` or `color.action.background.hover`. A component-specific role belongs here when it needs an independent design decision.

Components and consumers use semantic names for design values. Choose a token by its meaning and supported states. Two roles can resolve to the same value today and diverge in another theme. If a role is missing, bring it to the design system before adding it. Validate types, missing references, and alias cycles before generating outputs.

Use CSS pixels for spatial dimensions such as gaps, padding, and radii. Reserve `rem` and `em` for typography. Default to `rem` for tokenized font sizes and use unitless line height where appropriate. DTCG dimensions support `px` and `rem`. If CSS typography needs `em`, document the output transform and its font-size basis.

```json
{
  "primitive": {
    "space": {
      "12": { "$type": "dimension", "$value": { "value": 12, "unit": "px" } }
    },
    "font-size": {
      "16": { "$type": "dimension", "$value": { "value": 1, "unit": "rem" } }
    }
  },
  "semantic": {
    "space": {
      "control-inline": { "$type": "dimension", "$value": "{primitive.space.12}" }
    },
    "font-size": {
      "body": { "$type": "dimension", "$value": "{primitive.font-size.16}" }
    }
  }
}
```

## Design tool exchange

Record the authoritative authoring source and the direction of each import or export. Check a representative sample for names, values, types, aliases, and any supported modes. Compare the results with the authoritative data before adopting the workflow.

For the sample above, map the spacing primitive to a numeric Figma variable and preserve the semantic alias. Figma native import expects dimensions in `px`. A web font token of `1rem` can have a Figma preview value of `16px` if the team documents a 16px design reference. Preserve `1rem` in the authoritative web mapping so the preview number cannot silently replace it. Check the chosen tool's supported types before mapping composite typography. [Figma variable import and export](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables/)
