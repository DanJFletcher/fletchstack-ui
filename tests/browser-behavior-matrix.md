# Browser behavior ownership

This is the required review matrix for browser verification. New components must assign applicable rows to concrete assertions, or explain why a row does not apply. Test counts and JavaScript coverage do not prove these guarantees.

## Layer contracts

| Guarantee | Primary owner | Distinct boundary retained |
| --- | --- | --- |
| Props, attributes, classes, refs, state/callback wiring, message relationships | Component `__tests__/` DOM tests | Representative browser accessibility-tree and label activation checks |
| Deterministic server markup and no browser globals | Node SSR tests | Browser integration before hydration and actual hydration where applicable |
| Token values, aliases, validation, CSS generation, package/types | Node unit/integration and package checks | Generated CSS cascade and built-package browser verification |
| Every eligible CSF story renders, plays successfully, and passes configured axe checks | `npm run test:storybook` | Served story-index discovery and representative preview lifecycle checks |
| Native keyboard/default actions, geometry and browser preferences | Focused Chromium integration/E2E assertions below | These are not replaced by jsdom or simulated `selectOptions` |

## Component and integration matrix

All listed suite paths are relative to [e2e/components/](e2e/components/). Every retained test in these files continues to own its named assertion. The [case audit](browser-check-audit.json) records each original standalone check and the rationale/owner for removal or consolidation. It is a migration record, not a frozen future test-count requirement.

| Component/boundary | Browser owner | Required behavior and sampling |
| --- | --- | --- |
| Button | [Button suite](e2e/components/button/Button.spec.ts), [hydration](integration/components/button/Button.hydration.test.ts), [hidden](integration/components/button/Button.hidden.test.ts) | Native Enter/Space, submit/reset, disabled/hidden tab order; real focus and both-theme styling/reflow. DOM/SSR own exhaustive forwarding. |
| ButtonGroup | [ButtonGroup](e2e/components/button-group/ButtonGroup.spec.ts), [SSR CSS](integration/components/button-group/ButtonGroup.ssr.test.tsx) | Named native actions; both-theme joined seams/corners, dynamic hidden edges, RTL, wrapping/width/alignment, offset focus including forced colors, Tab/Enter/Space, external submit/reset, 320px enlarged/spaced labels and scoped gap resets. No animation or group focus management. DOM owns defaults, refs, handlers and standalone Button regression. |
| Select | [Select suite](e2e/components/select/Select.spec.ts) | Native typeahead and focus; invalid hover boundary and 320px enlarged/spaced labels in both themes. DOM owns choice/callback/description combinations; stories retain controlled/form compositions. |
| Field and atoms | [Field suite](e2e/components/field/Field.spec.ts), [atoms](e2e/components/field/FieldAtoms.spec.ts), [SSR browser](integration/components/field/Field.ssr.test.tsx) | Native label activation and actual relationships, inline label content, message palette, reflow and customized CSS gap; DOM owns exhaustive descriptions/slots/tag names. |
| TextInput / Textarea | [TextInput](e2e/components/text-input/TextInput.spec.ts), [Textarea](e2e/components/textarea/Textarea.spec.ts) | Native editing/focus and textarea newline/resize where asserted; reflow and invalid/focus styling in both themes. Keep controlled textarea counter/native input regression. |
| Checkbox / Radio / Switch | [Checkbox](e2e/components/checkbox/Checkbox.spec.ts), [Radio](e2e/components/radio/Radio.spec.ts), [Switch](e2e/components/switch/Switch.spec.ts) | Native selection/toggle/group keyboard behavior, label hit areas, focus, disabled behavior, forced colors, enlarged/spaced text and theme-specific states. |
| FormGroup | [FormGroup](e2e/components/form-group/FormGroup.spec.ts) | Legend relationships, native disabled fieldset behavior, first-legend exception, group error/focus and responsive composition. |
| Card | [Card](e2e/components/card/Card.spec.ts) | Native disclosure, media clipping/radius boundary, responsive composition and theme styling. |
| Link | [Link](e2e/components/link/Link.spec.ts) | Native navigation/tab behavior and unavailable text, focus/underlines, forced colors and reflow. |
| Spinner | [Spinner](e2e/components/spinner/Spinner.spec.ts), [selective CSS](integration/components/spinner/Spinner.ssr.test.tsx) | Rotation and stopped reduced-motion state with status retained, forced colors, inherited paint and focus exclusion. No keyboard activation: passive status. |
| Badge / Separator | [Badge](e2e/components/badge/Badge.spec.ts), [Separator](e2e/components/separator/Separator.spec.ts) | Semantic text/orientation, computed styling/contrast, forced colors and reflow. No activation: display-only components. |
| Container | [Container](e2e/components/container/Container.spec.ts), [pre-hydration CSS](integration/components/container/Container.ssr.test.tsx) | Preset maxima/centering, border-box gutters and 599/600px breakpoint, nesting, flex/grid shrink, RTL, scoped resets, theme parity and focus clearance. |
| Stack | [Stack](e2e/components/stack/Stack.spec.ts), [pre-hydration CSS](integration/components/stack/Stack.ssr.test.tsx) | Actual gaps/alignment, RTL, nested/hidden children, consumer margins, scoped/reset/responsive gaps, shrink, order/focus and 320px form use. |
| Cluster | [Cluster](e2e/components/cluster/Cluster.spec.ts) | Both gap axes, intrinsic wrapping at different parent widths, baseline/mixed-height alignment, wrapped-row justification, RTL/native tab order and clearance. |
| SimpleGrid | [SimpleGrid](e2e/components/simple-grid/SimpleGrid.spec.ts) | Equal tracks/reflow at parent widths, sparse tracks, row heights, hidden children, scoped resets, RTL/order/focus and enlarged cards. |
| AspectRatio | [AspectRatio](e2e/components/aspect-ratio/AspectRatio.spec.ts) | Actual frame proportions, parent sizing, fitting/overflow, video/embed semantics, native focus clearance, RTL and captions outside the frame. |
| Section | [Section](e2e/components/section/Section.spec.ts) | Both padding edges, responsive/scoped roles, margins/nesting, semantic regions versus divs, composition and focus clearance. |
| Typography | [Heading/Text](e2e/components/typography/Typography.spec.ts), [SSR CSS](integration/components/typography/Typography.ssr.test.tsx) | Both-theme rem scale, line height, contrast, nested token resets, hidden content, 320px/enlarged/spaced reflow, RTL and inline-link focus. Story plays own native heading levels and inline composition. No animation or control paint; composed Link owns forced-color focus. |
| Icons/gallery | [Icon](e2e/components/icon/Icon.spec.ts), [gallery](e2e/components/icon/icon-gallery.spec.ts) | Artwork sizing/paint, accessible icon composition, real search controls and narrow/enlarged layout; DOM owns literal search cases. |
| Theme boundaries | [Theme suite](e2e/themes/themes.spec.ts), [token scopes](integration/themes/theme-scoping.test.ts) | Default/explicit/custom roots, sibling/nested reset, scoped overrides; do not substitute equal current values for reset coverage. |
| Served Storybook | [Documentation](e2e/storybook/documentation.spec.ts), [organization](e2e/storybook/organization.spec.ts), [spatial guide](e2e/storybook/spatial-system.spec.ts) | Public IDs/index, docs links, manager navigation, toolbar changes, preview lifecycle/play failure propagation and actual styles. |
| Distribution | [Built CSS](../scripts/verify-browser.mjs), [package](../scripts/verify-package.mjs) | Built-style contrast/focus/reflow and installed exports/types/React SSR; source Storybook is not a substitute. |

## Consolidation rules

- Story render-success loops can be removed only when their IDs remain testable in the served story index and the Storybook project discovers their CSF files. A missing or excluded story fails the retained inventory check.
- Each original case has a recorded decision in the case audit. Pure forwarding stays in DOM/SSR; native input, browser accessibility relationships and CSS remain asserted in a real browser.
- Measure all variants already present in one fixture with named steps rather than reopening the same story for each variant. Keep unrelated journeys isolated.
- Shared layout can use one exhaustive functional matrix with explicit both-theme parity and nested reset checks. Preserve both themes for divergent palettes, focus, typography or state styling.
- Keep distinct 320px, 200% root text and user text-spacing checks for each applicable CSS contract/composition. Passive layouts do not require activation tests, but their descendants' order and focus clearance do.
- Reduced motion applies to animated components; forced colors applies to painted controls/indicators. Transparent layout wrappers do not add preference-specific paint, so their composed controls own those checks.
- Browser coverage is execution evidence, not CSS coverage, screen-reader certification, or proof of this matrix. Chromium emulation does not establish cross-browser or real-OS accessibility behavior.
