# Form-control browser harness migration

This extends the [layout migration](layout-harness-migration.md) with Checkbox, Radio, Switch, TextInput, Textarea and Select. The original six suites at `d8712c1` supply the audit baseline; the layout migration was already present in the working tree.

## Coverage and setup

All 60 browser cases move to [the component harness](../tests/browser-harness/specs/). A one-time TypeScript syntax-tree comparison verified that all 143 assertion statements remain identical, and all 40 scenario render/args definitions, defaults and retained helpers match their source stories. Scenarios import implementation modules and required CSS directly. Textarea's relevant example helpers are copied into its private scenario module, keeping the source graph independent of CSF and public barrels.

| Family | Harness owner | Preserved boundary |
| --- | --- | --- |
| Checkbox | [Checkbox](../tests/browser-harness/specs/checkbox/Checkbox.spec.ts) | Native Space/Tab, label activation, mixed selection, error hover, forced colors and reflow |
| Radio | [Radio](../tests/browser-harness/specs/radio/Radio.spec.ts) | Arrow selection, disabled skipping, native validation, external form ownership/reset and theme scopes |
| Switch | [Switch](../tests/browser-harness/specs/switch/Switch.spec.ts) | Stable names, native toggling/forms, thumb geometry/contrast, RTL, fieldset disabling and forced colors |
| TextInput | [TextInput](../tests/browser-harness/specs/text-input/TextInput.spec.ts) | Read-only selection, keyboard editing, linked descriptions, adornments, validation and sizing |
| Textarea | [Textarea](../tests/browser-harness/specs/textarea/Textarea.spec.ts) | Native multiline editing/resize, controlled counters, submission/reset/canceled reset, external ownership, maxLength and read-only selection |
| Select | [Select](../tests/browser-harness/specs/select/Select.spec.ts) | Native typeahead/focus, message relationships, validation boundaries and reflow |

Storybook play functions still run through the unchanged Storybook test project. The harness does not execute them. Three previously implicit prerequisites are now explicit browser actions: Space turns on the Switch before its existing toggle assertion; selecting Collection and submitting the Radio form establishes the existing submitted-value assertion; clicking Use suggested summary establishes Textarea's controlled value. Checkbox tests start from their authored unchecked/mixed state and retain assertions covering both toggle states and none/partial/all selection. Other interactions already establish their own required state.

Textarea's two maxLength overrides now pass numeric values directly, replacing Storybook URL strings. The scenario helper accepts numeric props. Existing assertions still verify negative-limit handling and native enforcement/count synchronization at five characters. Button's retained Storybook args test continues to own Storybook argument delivery.

The [organization relocation map](../tests/fixtures/component-organization-paths.json) points the four applicable historical paths to their harness destinations; its existing inventory test continues to require each historical test exactly once. No assertions or inventory checks are disabled. Production sources, source stories, browser configuration, coverage thresholds and CI configuration remain unchanged.

## Measured result

The same 60 cases ran on the same machine with Chromium, three workers, zero retries, retained failure evidence and ordinary coverage-disabled configuration. No other test workload ran concurrently with either measurement. Commands used `npm run test:e2e:storybook` before and `npm run test:e2e:components` after, with the six explicit suite directories and `--workers=3`.

| Measurement | Storybook | Harness |
| --- | ---: | ---: |
| Passing cases | 60 | 60 |
| Command wall time | 44.11s | 11.08s |
| Runner duration | 43.3s | 10.4s |

Observed wall time fell **74.9% (3.98×)**. This is one before/after observation with existing caches and ordinary managed-server startup, not a median, cold-start benchmark or full-suite speedup claim. Logs are under ignored `.verification/forms-migration/`.

## Ownership and verification

Each scenario-only edit selects its family. Regression checks cover Checkbox CSS consumers in Section, SimpleGrid and Stack; TextInput consumers in Cluster, Container and Stack; and FormGroup consumers in Radio, Stack and Switch. The catalog and removed legacy paths trigger a complete fallback for this migration. Production changes continue to select all retained Storybook suites conservatively.

The complete inventory remains 404 cases across 33 files: **206 harness cases in 15 files**, plus **198 retained Storybook cases in 18 files**. Remote CI remains pending.

Final local verification passed:

- Lint and both TypeScript checks.
- 697 unit tests in 51 files, with 100% production statement, branch, function and line coverage.
- 373 integration tests in 53 files, with the same 100% production coverage gates and three workers. The first run identified the stale relocation destinations; after updating the map, the complete gate passed. It includes real Playwright discovery reconciliation and the nine additional scenario/composition selection cases.
- The complete E2E command with three workers: all 206 harness cases passed in 31.5s and all 198 retained Storybook cases passed in 2.0m, with no failures or retries. These are runner times for a broader workload than the matched measurement above.
- All 338 Storybook render/play/accessibility tests in 29 files.
- Library and static Storybook builds, built-style browser verification, and packed exports/types/CSS/bundling/React 18 and 19 SSR verification.
- `git diff --check`; production sources, tokens, dependencies, browser configurations and CI files remain unchanged.

The prior layout batch's nine intermittent Storybook readiness failures remain documented in its report. This subsequent complete run passed the remaining delivery checks without relaxing timeouts or assertions; it does not establish that their intermittent behavior has been fixed.
