# Field browser harness migration

This extends the [feedback/actions migration](feedback-actions-harness-migration.md). The two original Field suites at `55f3345` supply the audit baseline.

## Coverage and retained boundaries

The [Field suite](../tests/browser-harness/specs/field/Field.spec.ts) moves all eight cases into the harness. The [atom suite](../tests/browser-harness/specs/field/FieldAtoms.spec.ts) moves eleven component cases covering FieldLabel, FieldDescription and FieldError. Their three documentation journeys remain in the [Storybook atom suite](../tests/e2e/components/field/FieldAtoms.spec.ts), including prop tables, label activation inside documentation, manager navigation and links to composed Field.

A one-time TypeScript syntax-tree audit verified that all 28 original assertion statements remain identical across the migrated and retained suites. The harness adds one assertion in the parameterized atom journey: Tab must focus the following Next action button before Shift+Tab returns to the input. The total remains 404 browser cases; none were deleted or skipped.

The 15 private scenarios preserve the source defaults, Field render/args definitions and atom example bodies, with two deliberate atom adaptations:

- The Storybook documentation link becomes a native Next action button supplying the following keyboard stop. Its navigation contract remains covered in the retained documentation journeys. The harness exercises input label activation, typing, Tab/Shift+Tab, focus styling, accessible descriptions, invalid state, enlarged text, inline messages and theme comparisons without a Storybook URL dependency.
- Hook-bearing examples render through named React components. The gallery invokes scenario callbacks outside React, so `useId` must run inside those components. Unique input/message IDs and both-theme scopes are retained.

Fixtures import implementation modules, Field/control CSS and the atom demonstration CSS directly. The [historical relocation map](../tests/fixtures/component-organization-paths.json) points Field to its new owner. Production source, source stories, global styles, browser configuration, retries, timeouts and coverage thresholds remain unchanged.

## Measured result

The same 19 component cases ran on the same machine in Chromium with three workers, zero retries and ordinary coverage-disabled configuration. No other test workload ran concurrently with either measurement.

```sh
npm run test:e2e:storybook -- tests/e2e/components/field --grep-invert 'documents public props' --workers=3
npm run test:e2e:components -- tests/browser-harness/specs/field --workers=3
```

| Measurement | Storybook | Harness |
| --- | ---: | ---: |
| Passing cases | 19 | 19 |
| Command wall time | 16.61s | 6.51s |
| Runner duration | 15.9s | 5.9s |

Observed wall time fell **60.8% (2.55×)**. This is one before/after observation with existing caches and ordinary managed-server startup, not a median, cold-start benchmark or full-suite speedup claim. The retained documentation cases are excluded from both measurements. Logs are under ignored `.verification/field-migration/`.

## Ownership and verification

Scenario-only edits select Field or the shared atom suite as appropriate. The atom demonstration stylesheet selects the atom suite plus retained Storybook suites. Checkbox CSS and TextInput implementation selection now include the new Field composition. Five additional selection cases test the four scenario modules and atom stylesheet. The catalog edit and deleted legacy Field path require complete browser fallback for this migration.

The complete inventory is **278 harness cases in 21 files** plus **126 Storybook cases in 13 files**: 404 cases across 34 files. The additional file results from splitting atom component behavior from documentation navigation. Remote CI remains pending.

Final local verification passed:

- Lint and both TypeScript checks.
- 697 unit tests in 51 files and 385 integration tests in 53 files, independently reaching 100% production statement, branch, function and line coverage. Integration includes historical path checks, dependency selection and reconciliation against real Playwright discovery.
- Complete E2E with three workers: all 278 harness cases passed in 32.3s and all 126 retained Storybook cases passed in 1.4m, including the three documentation journeys. There were no failures or retries. These runner times cover a broader workload than the matched measurement above.
- All 338 Storybook render/play/accessibility tests in 29 files.
- Library and static Storybook builds, built-style browser verification, and packed exports/types/CSS/bundling/React 18 and 19 SSR checks.
- `git diff --check`; production source, tokens, dependencies, browser configurations and CI files remain unchanged.
