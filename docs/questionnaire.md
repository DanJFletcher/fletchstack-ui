# Questionnaire

A data-driven form showing one question at a time. The supplied [design sheet](../../output/pdf/questionnaire-design.pdf) and [shadcn/ui reference](https://ui.shadcn.com/docs/components/base/questionnaire) establish the pattern; this library uses its own typed, data-driven API and semantic tokens.

```tsx
import { Questionnaire, type QuestionnaireItem } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

const items = [
  {
    id: 'direction', type: 'single', title: 'What should we build next?',
    options: [{ value: 'history', label: 'Searchable history' }],
    other: { label: 'Another feature', placeholder: 'Describe your idea' },
  },
  {
    id: 'context', type: 'multiple', required: false,
    title: 'Which context should we include?',
    options: [{ value: 'tests', label: 'Tests' }, { value: 'docs', label: 'Documentation' }],
  },
] satisfies readonly QuestionnaireItem[];

<Questionnaire aria-label="Plan the next feature" items={items}
  labels={{ submit: 'Save plan' }} onSubmit={savePlan} />
```

`savePlan` is application code receiving a validated snapshot; it may return a promise. The application owns transport, storage, branching, cancellation and the success destination. The component never automatically advances on selection or replaces itself on success.

## Public contract

All public types are exported at the package root: `QuestionnaireProps`, `QuestionnaireStyle`, `QuestionnaireItem`, `QuestionnaireOption`, `QuestionnaireTextField`, `QuestionnaireAnswer`, `QuestionnaireAnswers`, `QuestionnaireErrors`, and `QuestionnaireLabels`.

| Prop | Type / default | Behavior |
| --- | --- | --- |
| `items` | readonly `QuestionnaireItem[]`, required | Ordered single, multiple or text questions, keyed by stable `id`. |
| `answers`, `onAnswersChange` | `QuestionnaireAnswers`, callback | Controlled drafts; requests do not override the supplied prop. |
| `defaultAnswers` | `QuestionnaireAnswers`, `{}` | Mount-time uncontrolled defaults. |
| `value`, `onValueChange` | question ID, callback | Independently controlled navigation. Focus moves after the active ID changes. |
| `defaultValue` | question ID, first item | Mount-time resume position. |
| `onSubmit` | `(answers) => void \| Promise<void>`, required | Validated, normalized full snapshot. |
| `validate` | synchronous `(answers) => QuestionnaireErrors` | Pure application validator after built-in rules; receives normalized answers. |
| `shortcuts` | `none` (default), `letters`, `numbers` | Optional focused-question choice shortcuts. |
| `labels` | partial `QuestionnaireLabels` | Previous, Next, Skip, Submit, pending/error/empty copy, and `progress(position, total)`. |
| `className`, `style` | native class, `QuestionnaireStyle` | Instance-scoped CSS and semantic `--fs-questionnaire-*` overrides. |
| native form props / ref | native attributes / `HTMLFormElement` | Naming, IDs, handlers and native reset. Document-navigation form props and children are owned by the component. |

Questions have a nonempty unique `id`, visible `title`, optional `description`, and `required` (default true). Single/multiple questions have unique nonempty option values, visible option labels, optional descriptions/disabled states, and optional `other: QuestionnaireTextField`. Text questions use `input: QuestionnaireTextField`. Text fields have a visible `label`, optional `placeholder`, `multiline` and nonnegative integer `maxLength`. Choice questions need an enabled option or a usable custom field. Malformed definitions throw descriptive errors.

## Drafts, validation and navigation

Answers are keyed by question ID. Missing means unanswered; `{ kind: 'skipped' }` is an explicit optional skip. Choice answers use `{ kind: 'choice', values: ['history'], other?: '...' }`; text uses `{ kind: 'text', value: '...' }`. Keep draft strings as typed. Single-choice custom text is exclusive with selected options; multiple-choice custom text is additive. Focusing a field never changes an answer.

Previous preserves drafts without validating. Next validates only the current question. Optional questions need an answer or explicit Skip. Skip clears the answer and advances, except at the last question, where explicit submission is still required. Final submission checks every current question and focuses the first invalid answer. Built-in validation precedes custom validation; unknown and blank custom errors are ignored. Displayed errors revalidate during editing.

Submission creates a fresh snapshot: only current IDs, enabled choices in option order without duplicates, trimmed text, no blank `other`, and explicit skips. Removed or disabled values cannot satisfy required questions. Incompatible answer kinds, invalid single-choice combinations and overlong supplied drafts are rejected. Consumer objects are never mutated.

Answers and navigation can be controlled separately. Reordering preserves the active ID; removing it shows the former position clamped to remaining bounds. Empty questionnaires show a message without navigation or submission. Defaults initialize once; later default changes do not reset. Use the forwarded form's `reset()` method to restore initial defaults, or request them through callbacks in controlled mode. Consumer `onReset.preventDefault()` is honored.

## Saving and accessibility

An in-flight guard prevents overlapping saves, including synchronous reentry. Pending submission exposes `aria-busy` and disables editing/navigation/shortcuts. Reset is prevented while pending. Success releases the lock and retains answers; sync exceptions and rejected promises announce friendly error copy and allow retry without exposing exception details. Unmounted instances ignore late completion.

The active question is a fieldset/legend with associated descriptions and errors. Native radios and checkboxes retain their keyboard behavior and instance-specific groups/IDs. The full card label is clickable. Inactive steps are absent from the accessibility tree and Tab order. Navigation focuses the new fieldset; validation focuses the first enabled answer. Focus has a separate ring from selected paint. One live status describes position, not completion percentage.

Enter advances from single-line inputs; textarea Enter remains a newline. Shortcuts are scoped to this focused form and active question; A–Z or 1–9 follow enabled options in display order. They pause in editable text, during composition/repeat and with Ctrl/Meta/Alt. Remaining choices have no hint. They select/toggle and focus, never advance. Native Space/arrows remain available.

## Styling and examples

Corporate and Luna supply surface, selected/disabled paint, borders, typography, spacing and focus through semantic tokens. Apply `style={{ '--fs-questionnaire-min-height': '560px' }}` to size one instance. The parent owns outer placement. Text and actions wrap at narrow widths. No animation is added.

For granular CSS imports, include tokens plus `field.css`, `radio.css`, `checkbox.css`, `text-input.css`, `textarea.css`, `button.css`, `icon.css`, `kbd.css`, and `questionnaire.css`; the bundled `styles.css` includes them all.

Storybook **Forms / Questionnaire** includes the three-step composition and interactive flow, multiple/custom/text answers, optional skip, controlled state, saved defaults/reset, validation, pending resolution/rejection, retry, shortcuts, long labels, narrow layouts, empty state and both themes. Save examples use local promises, with application-owned receipts.
