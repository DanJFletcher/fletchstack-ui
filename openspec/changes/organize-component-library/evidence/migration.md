# Migration evidence

The [initial working tree](initial-working-tree.txt) records pre-existing component additions and edits. These are preserved by relocation, not reset or replaced. The frozen [baseline](../../../../tests/fixtures/component-organization-baseline.json) records 133 story/docs IDs and their meanings, 20 production modules, 33 browser runtime modules, 52 test files, the public export declarations, package entrypoints, source hashes, and combined CSS order. The [path map](../../../../tests/fixtures/component-organization-paths.json) tracks moves.

Before editing, `npm run test:unit` passed 322 tests across 21 files, and `npm run test:integration` passed 115 tests across 18 files. Each independently reported 100% statements, branches, functions, and lines. Logs were captured locally at `/tmp/fletchstack-baseline-{unit,integration}.log`.

Representative Textarea previews were captured from the live local Storybook in both theme globals: [Corporate](textarea-corporate-before.png), [Luna](textarea-luna-before.png). These include the side-by-side theme composition. Screen-reader testing has not been performed.

Production component behavior, CSS contents, published CSS filenames and order, runtime/type exports, and test assertions are compatibility contracts. Visible Storybook titles intentionally change; IDs and corresponding examples do not.

## Implementation verification

- The relocation-only comparison matched all 20 pre-existing production TypeScript modules after reversing import-path relocation. The subsequently approved controlled Textarea fix is the sole intentional runtime exception; see [runtime comparison](runtime-comparison.json). Public runtime/type export declarations and package entrypoints match the baseline. All ten source stylesheets, including generated tokens, retain their hashes; existing separate/combined publication assertions pass.
- All 52 pre-existing test files retain a unique mapped destination. All 133 legacy story/docs IDs retain their type, name, and owning family. Actual legacy documentation routes, category placement, canonical pattern links, and Card prop tabs have browser checks in addition to index assertions.
- Unit: 335 tests across 22 files passed, independently at 100% statements/branches/functions/lines. Integration: 131 tests across 19 files passed, independently at the same per-file thresholds. The additional post-review inventory assertion passed in its focused run.
- Storybook: 128 interaction/accessibility checks across 13 CSF files passed after relocation, new atom pages, and example ordering. This includes all existing examples and eight new field-atom examples.
- Lint, development/build type checks, package build, and static Storybook build passed. Packed-package verification passed runtime/type/CSS imports, React 18/19 deterministic SSR, stylesheet bundling, and single-icon/Button-only bundle isolation.
- Representative Textarea PNG buffers are identical before/after for both theme globals; see [visual comparison](visual-comparison.json), [Corporate after](textarea-corporate-after.png), and [Luna after](textarea-luna-after.png). The [new atom documentation](storybook-field-label-after.png) was inspected visually. Both-theme atom browser checks passed native label/message associations, keyboard editing/focus, and 320px reflow with 200% text and the prescribed spacing overrides.

## Verification limits and resolved failures

New navigation/inventory checks were added after their implementation; they prove the final contract, without an observed red-first failure for every added scenario. Screen-reader and non-Chromium platform testing were not performed.

During staging, a moved Icon hydration fixture exposed a relative stylesheet URL error; correcting the extra directory level restored its ten browser integration checks. A new Card docs assertion initially queried a button rather than Storybook's actual tab role; inspecting the rendered markup and testing each tab restored the check, including visible prop tables. Storybook's sort parser requires inline literals, so the repeated order arrays remain inline intentionally. The existing development server needed restarting after its discovery configuration changed.

The first concurrent form browser checks reached rendered controls but timed out while awaiting the full story/play lifecycle. The shared adapter now waits for the visible preview decorator before polling the existing successful lifecycle event; no assertion, retry policy, or timeout was relaxed. Subsequent full-suite results are recorded below.

## Previously blocking verification issue

The full browser run passed 222/223 checks; the existing Foundation → Tokens navigation journey failed once, then both documentation journeys passed on a focused run with a fresh server. Final full-suite verification is still pending. The new documentation-order assertion also required matching Storybook's heading permalink accessible name; its focused check now passes. The atom documentation regression is scoped to its demo controls rather than the prop editor, and all three focused checks pass with instance-specific IDs.

The complete browser coverage gate correctly failed on an unexercised controlled Textarea change callback. Moving its interactive examples into a colocated module made the missing callback coverage explicit. The old test changed only whitespace and used a whitespace-normalizing text assertion, allowing an unchanged controlled value to pass. The strengthened keyboard journey now checks distinct multiline text, its exact value, and the derived counter, and fails against the existing component.

Diagnosis: `useTextareaCount` observed native input even for a controlled value. Its state update could restore the controlled DOM value before React dispatched the consumer change callback. The owner subsequently approved the proposed fix: skip the native listener for controlled values, which already derive their count from `value`, and include controlled ownership in the effect dependencies for cleanup. This narrow runtime correction is recorded in the proposal, design, and controlled-example scenario.

## Final verification after the approved fix

The Chromium controlled-counter regression failed before the production edit and passed after the guard/dependency change, with its exact multiline value and derived length assertions retained. Its full E2E coverage now includes both Corporate and Luna. Added unit and jsdom hydration checks verify a real consumer-owned React value and its count; existing uncontrolled input/reset/canceled-reset cases remain intact.

- `npm run test:unit`: 336 tests passed across 22 files, independently at 100% per-file statements, branches, functions, and lines.
- `npm run test:integration`: 132 tests passed across 19 files, independently at the same 100% per-file thresholds.
- `npm run test:storybook`: all 128 interaction/accessibility checks passed across 13 CSF files.
- `npm run test:e2e`: all 224 Chromium tests passed; every scoped library and Storybook module reached 100% statements, branches, functions, and lines. The controlled example callback and family entrypoints are included; no coverage exclusions or thresholds were relaxed.
- Lint, development/build type checks, packed-package verification (including the package build), and the static Storybook build passed before the served browser suites. Packed React 18/19 SSR, public types/CSS consumers, and icon bundle isolation passed.

The formerly intermittent Foundation → Tokens journey passed in the final complete run. All 24 migration tasks are complete. Screen-reader and non-Chromium testing remain unperformed; this change adds no visual styling or semantic markup changes.
