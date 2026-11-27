# AspectRatio browser harness migration

This extends the [Card/Icon migration](card-icon-harness-migration.md). The original AspectRatio suite at `7d3afb7` supplies the audit baseline.

## Coverage and media ownership

All 20 cases move to the [AspectRatio harness suite](../tests/browser-harness/specs/aspect-ratio/AspectRatio.spec.ts). A one-time TypeScript syntax-tree audit confirmed that all 55 assertion statements remain identical. All 17 scenario render/args definitions, defaults and helpers match their source stories except for the URL syntax used to reference the same SVG asset.

Coverage retains actual frame and image geometry, intrinsic image dimensions, presets/custom/native/invalid ratios, responsive parent widths, enlarged/spaced captions outside the frame, image fitting/overflow, native video attributes, local iframe content, keyboard focus clearance/order, theme parity, nesting, flex/grid shrinking, RTL, empty frames and native hiding. Tests already establish their required focus and state, so no Storybook play prerequisites need copying. Source plays remain covered by the Storybook test project.

The [private scenarios](../tests/browser-harness/scenarios/AspectRatio.tsx) import components and CSS directly. Images and the video poster use `new URL('../../../src/components/aspect-ratio/stories/landscape.svg', import.meta.url).href` instead of an imported identifier. Both forms resolve the same source SVG; the explicit expression lets the selector prove module-relative ownership without general variable/data-flow inference.

The [dependency graph](../tests/browser-harness/selection/graph.mjs) now recognizes that exact expression shape in JSX resource attributes and records the asset through its existing URL visitor. Three new cases first demonstrated the unsupported `src`/`poster`/`href` forms, then passed after the change. Five negative cases preserve full fallback for dynamic names, non-module bases, method calls, conditional URLs and identifier indirection; a missing asset remains unresolved. The existing document-relative-path regression stays intact. No missing or dynamic resource is silently ignored.

Selection checks prove that editing the SVG selects AspectRatio plus retained Storybook suites. Additional checks cover the private scenario, scoped component CSS and SimpleGrid consumers. Existing Button, Container and Card consumer expectations now include the AspectRatio composition.

## Measured result

The same 20 cases ran on the same machine in Chromium with three workers, zero retries and ordinary coverage disabled. No other test workload ran concurrently with either measurement.

```sh
npm run test:e2e:storybook -- tests/e2e/components/aspect-ratio --workers=3
npm run test:e2e:components -- tests/browser-harness/specs/aspect-ratio --workers=3
```

| Measurement       | Storybook | Harness |
| ----------------- | --------: | ------: |
| Passing cases     |        20 |      20 |
| Command wall time |    26.08s |   8.46s |
| Runner duration   |     25.4s |    7.8s |

Observed wall time fell **67.6% (3.08×)**. This is one before/after observation with existing caches and ordinary managed-server startup, not a median, cold-start benchmark or full-suite speedup claim. Logs are under ignored `.verification/aspect-ratio-migration/`.

## Completion scope

The selector change, catalog edits and deleted legacy suite require complete local browser verification. The complete inventory remains 404 cases across 34 files: **322 harness cases in 24 files** and **82 retained Storybook cases in 10 files**. Production components, source stories/assets, tokens, runner configurations, timeouts/retries, coverage thresholds and CI configuration remain unchanged. Remote CI remains pending.

Final local verification passed:

- Lint and both TypeScript checks.
- 697 unit tests in 51 files and 403 integration tests in 53 files, independently reaching 100% production statement, branch, function and line coverage. Integration includes the 13 new resource/selection cases and reconciliation against real Playwright discovery.
- Complete E2E with three workers: 322 harness cases passed in 37.4s and 82 retained Storybook cases passed in 1.2m, with no failures or retries. Total command wall time, including startup, was **109.69s (1m 49.69s)**. This is one local run with existing caches, not a repeat-run median.
- All 338 Storybook render/play/accessibility tests in 29 files.
- Library and static Storybook builds, built-style browser verification, and packed exports/types/CSS/bundling/React 18 and 19 SSR checks.
- `git diff --check`; production source/assets, tokens, dependencies, runner configurations and CI files remain unchanged.
