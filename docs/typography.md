# Typography

The supplied Typography design sheet is the approved pattern for page content. Heading and Text are passive native elements; Container owns width and gutters, Stack owns sibling spacing. Neither adds margins, padding, a surface, fixed height, clipping, a keyboard stop or a font-loading dependency.

## Heading

`Heading` defaults to `as="h2"` and `size="section"`. Choose `as="h1"` through `as="h6"` for document structure independently of the visual size. A page heading can be an h1 with section-sized presentation. Preserve logical heading order; the component does not infer the document outline.

| Size       | Font size | Line height |
| ---------- | --------- | ----------- |
| page       | 2rem      | 1.25        |
| section    | 1.5rem    | 1.25        |
| subheading | 1.125rem  | 1.25        |

Use a system sans-serif face and weight 700 in both themes, as illustrated. Theme controls foreground; Luna's serif control typography does not apply to page headings.

## Text

`Text` defaults to `as="p"`, `size="body"`, and `tone="default"`. Use `as="span"` for inline content, including inside a paragraph. Choose `tone="muted"` for supporting information; meaning must not depend on color alone. Use existing Link for navigation and native strong/em for emphasis rather than turning Text into an interactive control.

| Size  | Font size | Line height |
| ----- | --------- | ----------- |
| lead  | 1.125rem  | 1.5         |
| body  | 1rem      | 1.5         |
| small | 0.875rem  | 1.5         |

Text uses weight 400 and the shared sans-serif family in both themes. Sizes use rem and line heights remain unitless so browser font preferences, enlargement and text-spacing overrides work. Long words can wrap; there is no truncation or automatic reading-width restriction.

Both components support their native attributes, children, className, forwarded native refs and typed `--fs-*` style overrides. The initial API has no arbitrary element polymorphism, breakpoint objects, automatic heading levels, alignment, line-clamp or font-weight props. Consumers retain native style access.

## Composition and customization

```tsx
import { Container, Heading, Stack, Text } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/container.css';
import 'fletchstack-ui/stack.css';
import 'fletchstack-ui/typography.css';

<Container size="reading">
  <Stack gap="group">
    <Heading as="h1" size="page">
      Project settings
    </Heading>
    <Text size="lead">Manage your workspace.</Text>
    <Stack>
      <Heading>Notifications</Heading>
      <Text>Choose which updates arrive in your inbox.</Text>
      <Text size="small" tone="muted">
        Updated yesterday
      </Text>
    </Stack>
  </Stack>
</Container>;
```

Semantic roles live under `--fs-typography-heading-*` and `--fs-typography-text-*`. They refer directly to primitives in each theme; the existing `--fs-text` and `--fs-font-*` roles remain intact. Scoped overrides inherit until a nested explicit theme resets them. Override after the library stylesheet and preserve contrast. Default and muted text require at least 4.5:1 against the containing surface. Container's reading preset is a maximum width, not a guarantee of optimal line length.

Load the combined stylesheet instead when appropriate. Storybook demo panels and outlines belong to the examples, not Typography. No role, tabindex, live region or focus management is added; interactive children keep their own behavior and need visible focus clearance.
