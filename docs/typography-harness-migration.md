# Typography browser harness migration

Follow-up: the [Link migration](link-harness-migration.md) now moves the remaining inline-link focus case with conservative forwarded-destination analysis. The measurements and scope below describe the original Typography batch.

This continues the [AspectRatio migration](aspect-ratio-harness-migration.md). The original Typography suite at `8e7bdb5` is the audit baseline.

## Preserved coverage and remaining boundary

Seven of eight cases move to the [Typography harness suite](../tests/browser-harness/specs/typography/Typography.spec.ts). They cover both-theme rem sizes and line heights, child margins, enlarged/spaced copy at 320px, RTL, contrast, inherited/nested theme overrides and native hiding. A one-time syntax-tree audit confirmed exact preservation of all 22 migrated assertion statements and test bodies, except the fixture import/opening calls and added mount argument. All eight scenario args/render definitions, defaults and the size-label helper match their source stories. These scenarios need no Storybook play prerequisites.

The private [Heading](../tests/browser-harness/scenarios/Heading.tsx) and [Text](../tests/browser-harness/scenarios/Text.tsx) modules import implementations and scoped CSS directly. They do not import CSF, the public barrel or unused Link dependencies. Source stories and their plays remain unchanged.

The [inline-link focus case](../tests/browser-harness/specs/typography/Typography.spec.ts) remains intact in Storybook. Link forwards a dynamic `href` to a native anchor; the current dependency graph cannot prove the target's resource ownership. Including that implementation in a harness graph would trigger full fallback for every affected selection. This is a temporary migration limitation, not a claim that focus behavior intrinsically requires Storybook. Link migration needs sound navigation/resource ownership support first. No dynamic-resource fallback was relaxed.

Six added selection cases cover each private module, the Heading and Text implementations, component CSS and demo CSS. Expected consumers include ButtonGroup, CodeBlock and the harness lifecycle suite where appropriate; Container selection now also includes Typography. An initial expected-consumer list missed CodeBlock/lifecycle, which import the typography composition; that expectation was corrected after checking the source and catalog. Actual discovery still reconciles both projects against Playwright's inventory.

## Measurement

The same seven cases ran in Chromium with three workers, zero retries and ordinary coverage disabled. No other test workload ran concurrently with either timing measurement.

```sh
npm run test:e2e:storybook -- tests/e2e/components/typography/Typography.spec.ts --grep-invert 'copy preserves native tab order' --workers=3
npm run test:e2e:components -- tests/browser-harness/specs/typography --workers=3
```

| Measurement       | Storybook | Harness |
| ----------------- | --------: | ------: |
| Passing cases     |         7 |       7 |
| Command wall time |    13.78s |   5.33s |
| Runner duration   |     13.1s |    4.7s |

Observed command wall time fell **61.3% (2.59×)**. This is one before/after observation using existing caches and ordinary managed-server startup, not a cold-start benchmark, repeat-run median or full-suite speedup claim. Logs are under ignored `.verification/typography-migration/`.

## Completion scope

The catalog change requires complete local browser verification. Total coverage remains 404 cases, now across 35 files: **329 harness cases in 25 files** and **75 retained Storybook cases in 10 files**. Production components, source stories/assets, tokens, runner configuration, timeouts/retries, coverage thresholds and CI configuration are unchanged. Remote CI remains pending.

Final local verification passed:

- Lint and both TypeScript checks.
- 697 unit tests in 51 files and 409 integration tests in 53 files, independently reaching 100% production statement, branch, function and line coverage. The integration run includes the corrected selection expectations and real Playwright inventory reconciliation.
- Affected-selection dry run: complete fallback for the catalog infrastructure change and unowned documentation/integration paths; private Heading/Text scenario changes individually select only the Typography harness suite.
- Complete E2E with three workers: 329 harness cases passed in 37.0s and 75 retained Storybook cases passed in 1.2m, with no failures or retries. Total command wall time, including startup, was **108.65s (1m 48.65s)**.
- All 338 Storybook render/play/accessibility tests in 29 files.
- Library and static Storybook builds, built-style browser verification, and packed exports/types/CSS/bundling/React 18 and 19 SSR checks.
- Exact test/scenario preservation audit and `git diff --check`.
