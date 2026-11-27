# Progress

A compact completion bar inspired by [shadcn Progress](https://ui.shadcn.com/docs/components/base/progress). Use Progress for task completion; use Spinner for activity without a measured amount when an inline icon is more appropriate.

```tsx
import { Progress } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/progress.css';

<Progress value={56} label="Upload progress" showValue />
<Progress value={3} max={8} label="Files uploaded" showValue
  getValueLabel={(value, max) => `${value} of ${max} files`} />
<Progress value={null} label="Preparing files" showValue />
```

| Prop                        | Type and default                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| value                       | number or null; omitted/null/nonfinite means indeterminate                                                    |
| max                         | Positive finite number; default 100, invalid inputs fall back to 100                                          |
| label                       | Optional visible text and default accessible name                                                             |
| showValue                   | boolean, default false; display the formatted completion text                                                 |
| size                        | small, medium (default), large; 4/8/12px bar thickness                                                        |
| getValueLabel               | Optional `(value, max) => string`; value is a number or null; formats visible text and default aria-valuetext |
| aria-valuetext              | Optional screen-reader-only alternative to formatted value text                                               |
| aria-label, aria-labelledby | Name overrides, with aria-labelledby taking precedence; fallback name is Progress                             |
| style, className            | Scoped semantic overrides and consumer class merged with the base class                                       |
| ref                         | Forwarded HTMLDivElement reference to the progressbar root                                                    |

Native div attributes and handlers, including id, hidden, dir, data attributes and aria-describedby, are forwarded. Progress owns children, role and numeric ARIA values. Values below 0 or above max are clamped; zero is measured progress, not loading. Fractional values are preserved in aria-valuenow and fill while default percentage text is rounded. Exported types: ProgressProps, ProgressStyle and ProgressSize. Unlike the reference's compound parts, this library exposes its visible label and value via props, consistent with its status components.

## Accessibility and task state

The root exposes one named progressbar with minimum 0, maximum and current value. Unknown progress omits aria-valuenow and reports In progress by default; no fake numeric completion is reported. Optional visual text duplicates its accessible name/value and is hidden from assistive technology to avoid repetition. Supply a meaningful task name, especially if several bars appear together. Use aria-describedby for task context or errors outside the bar. Progress is passive: no tab stop, interaction, live region, timer, task initiation, busy-region management or error state is installed. Do not rely on a continuously changing percentage to announce success or failure; the application should announce meaningful outcomes and control aria-busy on the relevant region. A completed bar remains visible until its parent removes it.

## Layout and themes

Parents own width, placement and spacing between bars. Labels and value text wrap rather than clipping at narrow widths, and fill begins at the logical inline start in RTL. Both themes inherit semantic track/indicator/text colors. Component tokens: --fs-progress-track, --fs-progress-indicator, --fs-progress-text, --fs-progress-radius, --fs-progress-gap, --fs-progress-height-{small,medium,large}, --fs-progress-font-{family,size,line-height}. Set --fs-progress-height to override one instance's resolved thickness.

```tsx
<Progress
  value={60}
  label="Export"
  style={{ '--fs-progress-height': '16px', '--fs-progress-radius': '0px' }}
/>
```

Determinate changes use standard motion timing/easing, with semantic values updating immediately. Indeterminate work moves a segment with 1.5 spinner durations. Live reduced-motion preferences remove movement and retain a static centered segment plus readable text. Forced colors retain a boundary and system-color fill. Storybook motion controls are preview-only. Import styles.css instead of split styles when preferred.
