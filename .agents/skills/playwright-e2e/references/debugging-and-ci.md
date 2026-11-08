# Debugging and CI

Read this when diagnosing a failure, checking execution evidence, or changing how browser tests run.

## Reproduce the actual failing configuration

Inspect the installed `@playwright/test` version, lockfile, package scripts, configuration, fixtures, application startup and CI command. Reuse the project's package manager and commands. Online documentation can describe APIs newer than the installed release; verify support before adopting an option. Playwright runs TypeScript by transforming it, so run the project's type check separately. [TypeScript](https://playwright.dev/docs/test-typescript)

Narrow the reproduction with an existing file, test title or project. Record the environment, browser project, test data and original failure before changing anything. For an intermittent failure, use a bounded `--repeat-each` run and compare the test alone with the relevant suite or concurrency. A passing rerun is evidence to investigate, not proof of repair. Do not repeatedly run unrelated suites without a new hypothesis. [Command line](https://playwright.dev/docs/test-cli)

## Classify the failure

| Evidence | Investigate before changing the assertion |
| --- | --- |
| The expected operation is rejected or the durable result is wrong | Product behavior, requirements and the specific test-owned data. Preserve a valid regression test. |
| Wrong element, multiple matches or missing result | Actual DOM semantics, scope, asynchronous completion and whether the expected behavior exists. |
| Passes alone, fails together | Shared accounts, backend residue, cleanup, worker/shard collisions and hidden ordering dependencies. |
| Click is delivered but ignored | Application readiness or hydration; an enabled control may exist before its listeners are attached. |
| Browser fails to launch or server is unavailable | Browser dependencies, version alignment, startup command, base URL and environment configuration. |

Use [locators and async](locators-and-async.md) for targeting and waits, and [fixtures, authentication and data](fixtures-auth-and-data.md) for ownership failures. Hydration can be a product defect; adding a sleep or forcing a click does not establish that users can interact reliably. [Navigations](https://playwright.dev/docs/navigations)

Change the test when its setup, targeting or expectation is wrong. When the requirement is valid and the product violates it, fix the product within the authorized scope or report the defect with the failing evidence. Do not silently weaken assertions, swallow failures, skip coverage, or accept a new baseline to make a run green. An intentional requirement change or temporary quarantine needs an explicit rationale and visible remaining coverage gap.

## Capture useful failure evidence

Inspect the failing action and assertion together with trace DOM snapshots, network requests, console output and application logs. Screenshots show appearance; traces help explain the sequence. Choose recording deliberately:

- `on-first-retry` records the first retry, not the original failed attempt, and produces nothing if retries are disabled.
- `retain-on-failure` records runs and retains failed-run traces, which helps when the original failure is the useful evidence.
- `--trace on` is useful for a focused local reproduction; recording every test continuously can be expensive.

Check the installed version for additional modes. Keep traces and reports in the project's intended artifact storage; they can contain application data, credentials or source. [Trace Viewer](https://playwright.dev/docs/trace-viewer), [UI Mode](https://playwright.dev/docs/test-ui-mode)

Playwright distinguishes first-attempt passes, flaky results that pass on retry, and failures. A failed worker is replaced, so setup hooks can run again; teardown and shared resources must tolerate this. Retries can collect evidence, but they do not remove the underlying defect. Keep flaky outcomes visible; consider `failOnFlakyTests` only when supported by the installed version and appropriate for the project's CI policy. [Retries](https://playwright.dev/docs/test-retries), [TestConfig](https://playwright.dev/docs/api/class-testconfig)

Identify which budget expired: test, assertion, action, navigation, fixture, server startup or overall run. Increase the relevant timeout only when measured behavior justifies it; a larger unrelated timeout can leave the real failure untouched. [Timeouts](https://playwright.dev/docs/test-timeouts)

## Fit execution to the project

Use configured projects for supported browsers, device profiles or authentication states. Start with the relevant project during development, then verify the matrix required by the change. Do not silently reduce the project's supported coverage or multiply every case across a new matrix. [Projects](https://playwright.dev/docs/test-projects)

For CI work, ensure browser binaries and system dependencies are installed for the locked Playwright version. Align a Playwright Docker image with the package version. Let the existing `webServer` setup own application startup where appropriate; check readiness and avoid accidentally reusing a different build. Keep reports available after failures and leave time for their generation before the job is killed. [CI](https://playwright.dev/docs/ci), [Docker](https://playwright.dev/docs/docker), [Web server](https://playwright.dev/docs/test-webserver)

Tune workers to available resources and backend capacity. Reducing concurrency can distinguish contention from a functional failure; permanent serialization should not conceal unsafe shared state. When sharding, account for resource identities across independent jobs and merge reports. Without `fullyParallel`, sharding is normally at file granularity; with it, individual tests can be distributed. Enabling it requires independent tests. [Sharding](https://playwright.dev/docs/test-sharding)

## Report what the run established

Give the exact commands, selected tests/projects, observed pass/fail/flaky/skip results, and relevant trace or report locations. State whether the original defect was reproduced and whether the same check passed after the correction. Separate lint/type checks, browser execution and manual checks. If execution is blocked, identify the concrete blocker and label the result unverified; do not infer a green run from generated code or a successful build.

Codegen and Playwright's planner/generator/healer agents can assist with exploration and authoring. Review their results against the requirement and run them through the same checks; a healer's skipped test is a coverage decision to review, not evidence that the product works. [Test Agents](https://playwright.dev/docs/test-agents)
