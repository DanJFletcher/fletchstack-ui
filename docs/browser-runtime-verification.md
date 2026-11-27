# Browser verification simplification evidence

Date: 2026-11-10. Change: `simplify-browser-verification`. Measurements use the session working tree based on `b7d219f`, including pre-existing uncommitted component work. No production component, token or stylesheet changes are part of this simplification.

## Measurement conditions

- macOS arm64, Node 22.23.4, Playwright 1.65.0, installed Chromium provider, three Playwright workers, retries zero, traces retained on failure and screenshots only on failure.
- Storybook 10.6.6 served at port 6007. Benchmarks reuse the server. A separate fresh server-process observation measured **2,219ms** from process spawn to successful iframe HTTP response; existing disk caches were retained. This excludes token generation, npm invocation and first-story rendering.
- Raw JSON/HTML/logs and the pre-change working-tree hashes were retained locally under `.verification/browser-runtime/`. These are generated scratch artifacts, not required inputs to ordinary tests.
- Runner wall time includes discovery/setup/test scheduling. Summed test and fixture durations overlap across workers and are not elapsed-time savings.

## Staged workload results

| Stage                                            | Tests | Result                                                | Runner time |
| ------------------------------------------------ | ----: | ----------------------------------------------------- | ----------: |
| Complete original browser suite                  |   594 | Passed, including independent exact 100% browser gate |     648.95s |
| Frozen first-removal batch                       |   578 | Passed, including the same exact 100% gate            |     701.63s |
| Complete focused suite                           |   346 | Passed, coverage-free                                 |     280.47s |
| Initial complete diagnostic suite                |   346 | 345 passed; one served-navigation timing failure      |     431.28s |
| Complete diagnostic suite after readiness repair |   346 | Passed; informational coverage                        |     423.76s |

The first batch removes four Select smoke cases and twelve Stack smoke cases already opened by focused assertions. It was verified using a frozen copy of the old fixture/reporter with its own cache/output, so ongoing configuration edits could not change the running gate. Some independent verification ran during this stage: its elapsed result is **not** a controlled speed comparison. It was slower despite fewer tests, illustrating why test counts do not establish a runtime improvement.

The historical Card readiness failure did not recur in either complete strict-gate run. The older 593/594 passing report remains historical evidence, not the passing baseline used here.

## Bounded comparisons

The original five-case sample covers Select's controlled-story smoke and native typeahead, nested Stack geometry, Spinner motion preferences, and the default Container contract. Both pre-change and first-removal samples collect coverage but disable final coverage reporting to isolate the workload. Three repetitions use identical test filters and three workers.

| Sample                                   | Seconds, in execution order | Median |
| ---------------------------------------- | --------------------------- | -----: |
| Original five cases                      | 9.034, 5.385, 5.447         | 5.447s |
| Frozen first-removal five cases          | 10.064, 7.088, 6.476        | 7.088s |
| Four retained cases, collection disabled | 4.036, 4.168, 4.262         | 4.168s |
| Same four cases, collection enabled      | 6.349, 7.440, 6.127         | 6.349s |

Final-code repetitions after the served-navigation repair (same four retained checks, same three-worker reporter overrides):

| Mode                | Seconds             | Median |
| ------------------- | ------------------- | -----: |
| Collection disabled | 6.600, 4.423, 4.594 | 4.594s |
| Collection enabled  | 6.176, 6.304, 5.406 | 6.176s |

The four-case comparisons exclude the retired smoke case and run an identical retained workload, first without collection, then with the diagnostic fixture enabled. They use `--reporter=list,json`, excluding final Monocart report generation. The earlier pair differed by 2.181s and the final-code pair by 1.583s; neither is an estimate of full-suite savings. Ordering and cache effects remain possible; no universal multiplier is claimed.

The retained filter is:

```text
corporate Select supports native keyboard typeahead|nested Stacks own|corporate Spinner rotates|default Container stays
```

Run it with `npx --no-install playwright test --workers=3 --reporter=list,json --grep '<filter>'`, adding `--config=playwright.coverage.config.ts` for collection. The full diagnostic command additionally generates reports and records `reportGenerationMs`: the final complete report took **2.124s** to generate, separate from runner time. The reporting override is solely for the controlled experiment; ordinary diagnostics use `npm run test:e2e:coverage`.

Three coverage-free sample runs preserved all existing diagnostic file bytes **and mtimes**, for the existing report artifacts. A subsequent probe seeded a cache sentinel and verified its bytes/mtime and every existing report remained unchanged after a normal run; the next diagnostic run removed the sentinel. Disabled-mode lifecycle tests also prove no collection/report factory calls occur.

Startup is measured separately above. Browser navigation, rendering, play execution and readiness waits remain combined in these wall times: they are not mislabeled as separately measured phases. Existing HTML reports expose fixture timings, but cannot measure all V8 instrumentation impact. Final diagnostic reporting time is explicitly recorded in its summary.

The complete coverage-free run took 4.67 minutes versus 10.82 minutes for the original strict-gate run, an observed 56.8% reduction. These are single complete runs with different intentionally simplified workloads; this is not a statistical performance guarantee. The frozen first-batch result above is not used to infer speedup.

HTML step observations (summed across workers, overlapping other test time): original coverage fixture setup/teardown totaled 189.704s; coverage-free setup/teardown totaled 0.043s. Navigation-call sums were 557.507s versus 209.653s, and combined preview visibility/readiness assertion sums were 844.504s versus 425.481s. These expose repeated-work reduction but do not isolate rendering from play execution or add up to wall time.

## Confidence retained

See the required [behavior matrix](../tests/browser-behavior-matrix.md) and original-case [audit](../tests/browser-check-audit.json). The audit accounts for all 594 original cases, with retained owners and rationales for every removed/consolidated case. Geometry consolidations keep original assertions as named steps rather than substituting snapshots or removing presets.

- All 286 Storybook Chromium tests pass, including plays and configured accessibility failures. All 207 former smoke-loop story IDs remain present and testable in the served index; source-discovery integration checks cover their CSF owners. Each ID was additionally matched through the CSF parser to an actual passed assertion in the Vitest Browser Mode JSON report.
- Native Select typeahead is retained once; both themes retain styling/focus/reflow checks. Field's default spacing is measured once; real label behavior remains in browser integration and plays, with exhaustive ARIA/slot contracts in DOM tests.
- Pre-hydration CSS, actual hydration, selective stylesheet loading, built-package styles, responsive geometry, 320px/200% text/user spacing, RTL, focus clearance and native hidden/disabled behavior remain distinct browser boundaries.
- Spinner motion/reduced motion and forced-color checks remain. Passive wrappers do not acquire artificial keyboard or preference tests.
- Served manager links, toolbar changes, public IDs and a synthetic failed-play rejection check remain separate from portable story execution.

## Controlled regression probes

Each probe used a disposable browser page against the actual story: verify the owning assertion, inject a DOM/CSS/input fault, observe an assertion failure, reload to remove the fault, and verify it again. No component files were edited.

| Probe                           | Injected fault                                       | Result                  |
| ------------------------------- | ---------------------------------------------------- | ----------------------- |
| Field label association         | Label targets a missing control ID                   | Detected; restored pass |
| Native Select typeahead         | Prevent the native keydown default action            | Detected; restored pass |
| Stack direct-child gap          | Force the outer gap to zero                          | Detected; restored pass |
| Container breakpoint            | Force 16px gutter at 600px instead of 24px           | Detected; restored pass |
| RTL Stack alignment             | Force end alignment for a start-aligned fixture      | Detected; restored pass |
| Focus clearance safety contract | Add overflow clipping to composed Stacks             | Detected; restored pass |
| Nested theme reset              | Remove the explicit inner Corporate boundary         | Detected; restored pass |
| Reduced motion                  | Force animation despite reduced preference           | Detected; restored pass |
| Forced-color indicator          | Reduce track opacity below its system-color contract | Detected; restored pass |

The focus probe verifies the existing visible-outline/overflow safety assertions, not a pixel-level proof of every possible clipping case. Preference emulation is not a real-OS accessibility session.

## Served-preview readiness repair

The first complete diagnostic run correctly failed when the documentation journey changed the top-level manager URL before the target preview iframe was ready. The trace showed that the exact CSS assertion started while the manager was still initializing its new iframe; the isolated coverage run passed. The journey now registers the specific iframe-navigation wait before clicking the real link, then requires the same successful render/play lifecycle as direct previews before asserting the exact color. Test/assertion timeouts and retries are unchanged. Three concurrent coverage reproductions passed after this repair, followed by the normal-mode documentation and failed-play checks (2 passed). The complete diagnostic rerun is recorded above.

## Diagnostic failure sensitivity

Disposable Playwright fixtures verified the actual diagnostic CLI exits 1 both when a request-only run collects no browser JavaScript and when a test intentionally fails after loading a real component story. Missing data produced the expected collection error; the failing assertion remained a failure even though diagnostic report generation ran. Neither probe changed component files or permanent test catalogs.

## Other verification and limitations

- Unit: **544 passed**, unchanged independent 100% per-file production gate.
- Integration: **234 passed** at `--maxWorkers=3`, unchanged independent 100% per-file production gate.
- Initial unrestricted integration execution timed out in the Corporate Badge standalone-CSS case while other work was active. That unchanged file passed both cases in isolation, followed by the complete three-worker passing run. No retry, timeout increase, skip or assertion change was introduced.
- Lint and both TypeScript configurations passed during implementation; final integration/build outcomes are recorded below when complete.
- Coverage lifecycle/configuration/reporter tests cover disabled mode, inherited settings, incomplete percentages, unloaded-file categorization, stale-cache cleaning, missing data, collection/reporting/write errors and preservation of failed test status.

The filtered official diagnostic command also passed with one selected native Select check, labeled its selection, cleared stale cache, and retained the actually unloaded AspectRatio story module at 0%. The local current diagnostic report is this filtered measurement; full-run summaries were retained separately in the local evidence folder.

The complete diagnostic inventory remained **53 production + 28 story/demo + 1 preview files**, matching the original inventory. Its one unexecuted production statement is Select's controlled-value initialization guard. That path remains covered by DOM/SSR tests and the actual passed Controlled Storybook browser test; no replay was restored solely to raise the standalone percentage.

Diagnostic percentages are informational and separated by production, story/demo and preview scope. Independent unit/integration counters and scopes are unchanged. This intentionally replaces the former browser 100% gate; it does not claim equivalent execution of every demo branch. The matrix, story inventory/a11y and targeted browser assertions now own browser confidence.

Final lint, both TypeScript checks, library build, built-CSS contrast/focus/reflow, static Storybook build, installed-package runtime/types/CSS/bundling checks, and React 18/19 SSR all passed. The on-demand workflow was parsed and its required commands/failure-artifact upload verified locally; remote GitHub Actions was not dispatched.

All pre-existing production source, component stories, token inputs, generated styles and build scripts remain byte-identical to their task-start hashes. Changes to pre-existing user files are limited to the approved test, README/package-script and task-tracking edits.

Affected-test selection remains deferred. A 4.7-minute complete local browser run still leaves a useful case for a separate selector proposal, but manual suite filters and the approximately 15-second all-story project already provide fast focused feedback. Any future selector must still account for compositions, URL resources and shared CSS/tokens; no selector or monorepo dependency was added.
