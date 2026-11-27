# Component browser harness evidence

Change: `add-component-browser-harness`. Implementation began with existing uncommitted agent-testing guidance and OpenSpec work; the starting status and diff are retained under ignored `.verification/component-harness/`. Those earlier changes are preserved.

## Assertion ownership

The [pilot audit](../tests/browser-harness/pilot-audit.json) records every test declaration and assertion statement from the original Button, Stack and CodeBlock suites, including parameterized cases. The complete bodies are retained in the local baseline snapshots. All component assertions are assigned to matching harness suites; Button's Storybook-args forwarding test remains served through Storybook. This is an assertion-level migration record, not a future fixed test-count requirement.

The existing [behavior matrix](../tests/browser-behavior-matrix.md) remains authoritative for native keyboard/default actions, geometry, theme scopes, focus, reflow/enlargement/text spacing, RTL, browser preferences and distinct SSR/package/Storybook boundaries. No SSR/hydration, packaged-style, Storybook play/a11y or other component-family owner is removed by the pilot.

## Measurement protocol

Compare the same 52 component cases in the three pilot families; exclude only the explicitly retained Storybook-args case from both performance workloads. Use Chromium, three workers, zero retries, retained failure traces, failure-only screenshots and no JavaScript coverage. Record three warm-server invocations, command wall time and runner duration separately. Fresh-server observations keep existing disk caches and exclude token generation; report that limitation rather than calling them cache-cold builds.

Run baseline tests against a dedicated Storybook process on port 6009, separate from interactive Storybook. No production, story, style or test edits are made during baseline measurement. Results and exact environment information are recorded under `.verification/component-harness/`; final measurements and acceptance are added here after validation.

Baseline: macOS arm64, Node 22.23.4, checkout `abae1a155c9e29bcce017db0830574dc6f9489a4`, Playwright 1.65.0. All 52 cases passed in each of three runs. Command wall times: **38.949s, 39.183s, 39.874s**, median **39.183s**, range **38.949–39.874s**. Fresh Storybook process readiness: **3.392s**, excluding token generation and first-story rendering.

An initial measurement attempt passed 51/52 and failed when Vite reloaded a preview during `page.evaluate`. The server log identifies Playwright trace HTML written inside the repository's scratch output as the triggering reload. The corrected measurements place trace output in a temporary directory outside the watched repository, retaining unchanged assertions, timeouts and retry settings. That setup failure and trace are retained separately and are not a passing baseline.

## Historical documentation failures

The focused retained-Storybook run of `FieldLabel documents public props` and `the Storybook sidebar and guide link` passed both cases (15.7s total, one worker). The historical navigation failures did not reproduce, so no readiness repair, assertion change, timeout increase or retry was justified. Final full verification must still report any recurrence honestly.

## Matched pilot result

The final harness measurement was run without other validation concurrently. Same 52 cases, Chromium, three workers, zero retries, retained failure traces and coverage disabled. Harness command times: **10.602s, 9.251s, 9.556s**, median **9.556s**, range **9.251–10.602s**. Fresh Vite process readiness: **1.136s**, with disk caches retained and token generation excluded, as in the baseline. The paired workload is **75.6% faster by median command wall time (4.10×)**.

| Measurement                    | Storybook baseline (three runs) | Harness (three runs)   |
| ------------------------------ | ------------------------------- | ---------------------- |
| Passing cases per run          | 52, 52, 52                      | 52, 52, 52             |
| Command wall seconds           | 38.949, 39.183, 39.874          | 10.602, 9.251, 9.556   |
| Runner wall seconds            | 38.119, 38.230, 38.707          | 9.572, 8.369, 8.771    |
| Sum of individual test seconds | 85.897, 85.555, 83.875          | 17.786, 15.282, 16.539 |
| Fresh-server ready seconds     | 3.392                           | 1.136                  |

Summed durations are not elapsed savings. Browser launch, scenario initialization, first-load transforms and teardown are included in each command but were not independently timed. The modes ran in blocks rather than alternating; normal machine variance and warm disk caches limit extrapolation. An earlier exploratory harness measurement overlapped type checking and is excluded from this acceptance table.

**Go for the three-family pilot.** A one-time executable comparison passed for every original assertion against the delivered owner recorded in the [pilot audit](../tests/browser-harness/pilot-audit.json). This historical migration record does not freeze future test text or counts. Harness actions explicitly perform the native form reset and clipboard failure/retry formerly supplied by story play functions. The forced-colors focus case uses real Tab/Enter to establish keyboard focus rather than relying on simulated Storybook clicks. It retains the same outline assertion. Eight additional lifecycle/isolation cases are outside the 52-case performance workload.

## Failure sensitivity and ownership

Each bounded mutation was restored in a `finally` block and its focused checks then passed. The selected full owner lists and filtered probe invocations are retained in local measurement JSON; these probe executions are intentionally filtered evidence, not complete selected-run passes.

| Mutation                                                    | Actual failing checks                                                | Restored result                      |
| ----------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------ |
| Button activation prevents default and replaces the handler | Button native submit/reset and transitive CodeBlock native clipboard | Both pass                            |
| Stack gap becomes 1px and alignment becomes center          | Corporate gap geometry and RTL start alignment                       | Both pass                            |
| CodeBlock copies corrupted text                             | Exact real clipboard text                                            | Pass                                 |
| CodeBlock viewport ignores scoped inset                     | Scoped/reset padding                                                 | Pass                                 |
| Generated shared code-font token becomes 1px                | Corporate literal-code typography                                    | Pass; selection is complete fallback |

Disposable browser suites also proved that an uncaught page error fails fixture teardown, a legacy assertion fails, and a setup exception fails. Mixed harness/legacy execution continued through both failures and returned status 1; the disposable suites were removed. Unit tests cover launch failure and signal exit propagation. Unknown IDs, failed imports and React render errors reject mount, and subsequent clean scenarios work. Clipboard success/unavailable behavior passes in both orders; fresh contexts reset preferences and permissions.

Retained Storybook suites conservatively own all authored source, story, preview and shared test resources. This deliberately broad declaration accounts for the all-component preview stylesheet and public barrel. A production edit still runs all retained Storybook E2E plus its harness consumers. Scenario-only changes can be narrow; no export-level or cross-stylesheet precision is claimed.

## Selector runtime

A disposable Git copy of the current implementation measured the real CLI against a committed baseline, including Node/TypeScript startup and Git/graph discovery. A CodeBlock scenario-only edit selected exactly the CodeBlock suite and the lifecycle suite that exercises its clipboard scenario: **33 cases passed**, with **14.472s** total discovery plus execution and fresh-server startup. Three dry runs took **0.652s, 0.797s, 0.772s** (median **0.772s**). The reported project/file list matched execution, and only the harness server started. This workload differs from the 52-case comparison and is not used to calculate its speedup.

Adding a shared generated-token edit selected the **complete 33-file inventory** (29 retained Storybook files and four harness files). Three fallback dry runs took **0.762s, 0.627s, 0.605s** (median **0.627s**). Full execution on the final workspace is recorded below with final verification. Dry runs do no builds, test imports, token generation, browser/server launches or report/cache writes; disposable-repository integration tests verify this with throwing test bodies and artifact checks.

The first disposable measurement lacked the docs directory required by the existing token generator and correctly exited nonzero before tests. The corrected copy includes that directory; this was a measurement setup failure, not a selector pass. No dependencies were installed and the temporary copy was removed.

Opt-in diagnostics were exercised with the `components` project and the single native clipboard test. The test passed; the report records that exact project/suite/test, includes gallery/scenario sources (including unloaded modules), and keeps harness counters separate from production. Tests verify missing data and report/write failures remain nonzero. A content fingerprint of all diagnostic artifacts is checked again after ordinary full verification to prove coverage-free runs preserve them.

## Final verification

The complete CI E2E entry point (`npm run test:e2e -- --workers=3`) passed **60 harness cases plus 344 retained Storybook cases**. Total command wall time was **282.529s**, with **0.410s** in-process full-fallback discovery recorded separately. All 33 files were selected; the harness project took 13.4s including its lifecycle tests and server setup, and retained Storybook took 4.4 minutes. These totals have a different workload from the matched pilot and do not establish a full-suite before/after speedup. Both historical documentation-navigation cases passed in this complete run.

All **338 Storybook render/play/a11y cases in 29 files** passed. Ordinary E2E preserved the six existing diagnostic output files byte-for-byte. Final selector review also added an audited-config fingerprint guard: both complete and affected commands reject configuration drift that could invalidate static discovery, and integration tests compare the final inventory with real Playwright listing. This guard changes discovery only, not the passing component/browser scenarios.

Final independent gates passed:

- `npm run test:unit`: **697 cases / 51 files**, 100% per-file production statements, branches, functions and lines.
- `npm run test:integration -- --maxWorkers=3`: **356 cases / 53 files**, the same independent 100% per-file production gate, including real Git/runner inventory tests and SSR/hydration.
- `npm run lint` and both TypeScript checks.
- Library build, static Storybook build, built-package browser verification (including both-theme focus/contrast and 320px/enlarged/spaced text), packed exports/types/CSS/bundling and React 18/19 SSR.
- Complete command listing through the final guarded runner; strict OpenSpec validation and whitespace checks.

One final integration invocation at default concurrency passed 355/356 but hit the existing five-second timeout in `propagates a real selected setup failure`. That case passed alone in 1.02s; the complete three-worker run then passed in 28.27s runner time. This supports resource contention as a possibility, not a proven root-cause fix. No timeout, retry, assertion, production code or CI setting was changed, and the failed log is retained alongside the passing evidence.

The starting unrelated skill and earlier OpenSpec edits were compared against the saved pre-implementation diff and preserved exactly. The shared testing-policy edits retain the user's prior workflow changes. Production source, tokens, dependency lockfile, existing unit/integration selector scripts and required CI workflow have no diff. Local verification is complete; **remote CI has not been run and remains pending**. No broader component migration is included.

## Migration and rollback

Only the audited component assertions are retired from the three original E2E files after the matched pass and speedup. Button's Storybook-args case stays in its original suite; Stack and CodeBlock keep distinct SSR/hydration/selective-style owners. All Storybook render/play/a11y checks, public-index/docs/manager/toolbar/lifecycle tests and all other component families remain active. The complete npm entry point runs both projects sequentially; required CI invokes it without filters.

Rollback restores the three original suites from the pre-change revision recorded above, restores legacy-only complete command routing, and removes duplicate harness owners from the active complete inventory. Restore the behavior matrix and catalog together. The scoped local-completion policy can remain useful independently. Migration beyond Button, Stack and CodeBlock requires a separate decision.
