---
name: playwright-e2e
description: Design, write, review, and debug browser end-to-end tests with Playwright Test in JavaScript or TypeScript. Use for user journeys, browser integration coverage, and unreliable Playwright tests.
---

# Playwright E2E

Produce tests that detect an important regression, own their state, and make clear what a passing result proves. Use the project's JavaScript or TypeScript conventions with `@playwright/test`; its runner provides fixtures, isolation and reporting beyond the browser automation library. [Playwright Test versus Library](https://playwright.dev/docs/library)

## Establish the task

Inspect the relevant requirements, existing tests, installed Playwright version, configuration, fixture imports, package scripts, application startup and CI. Reuse the working setup and the project's package manager. Inspect actual UI semantics through available browser tools, traces or source; do not present invented selectors, routes or APIs as verified facts. Check version-sensitive APIs against the installed version before using them.

- **Author:** Add the smallest coherent scenario that proves the requested outcome. Choose test cadence and evidence under the shared [development policy](../../guidelines/testing-guidelines.md#development-policy), including meaningful pre-fix reproduction for bugs where feasible.
- **Review:** Stay read-only. Identify concrete missed regressions, false passes, races or isolation problems with locations and consequences; distinguish demonstrated failures from suspected risks.
- **Diagnose:** Reproduce the focused failure and classify it as product, test or environment related before changing code. Preserve the behavioral requirement when the product is broken.

## Design a meaningful journey

Identify the actor, initial state, important failure, action, expected result, and real versus replaced system boundaries. Keep this lightweight in the test name, clear setup and necessary comments; a separate test-plan document is optional. Read [test design](references/test-design.md) when choosing coverage, mocks or assertions.

Use browser E2E coverage where browser behavior or cross-layer fidelity matters. A coherent journey may need multiple actions and assertions. Apply unit-test rules within their unit-test scope; real browser journeys need not fit a single function call or replace all I/O.

Prepare prerequisites through existing APIs or factories when those operations are outside the behavior under test. Exercise the target behavior through its intended entry point. Correlate assertions with this test's data, establish preconditions that prevent an empty pass, and verify the promised result. A persistence requirement needs evidence of persisted state; a toast alone is insufficient.

## Author reliable interactions

Prefer locators based on roles, accessible names, labels or other meaningful contracts. Scope repeated controls to the intended item or region. Test IDs are appropriate when semantic targeting is impractical. Use position when order matters, rather than adding `.first()` merely to silence ambiguity.

Await interactions and asynchronous assertions. Actionability establishes that an action can occur; retrying assertions establish the outcome. Read [locators and asynchronous behavior](references/locators-and-async.md) for dynamic lists, navigation, eventual results or event races. Register waits for transient events before the triggering action. Poll observations without repeating non-idempotent writes.

Use observable readiness instead of arbitrary sleeps or generic network-idle waits. Investigate an overlay, hydration failure or ambiguous target before bypassing it with a force click, DOM event or evaluated script. Use those mechanisms only when they express the intended test boundary.

## Own state and dependencies

Each test must establish its own prerequisites and work independently of test order. Fresh browser contexts do not isolate shared server data. Read [fixtures, authentication and data](references/fixtures-auth-and-data.md) for mutable accounts, setup APIs, cleanup, network replacement or controlled time.

Choose resource ownership for the actual concurrency: tests, workers, retries, shards and simultaneous runs where relevant. Reuse authenticated state only when server-side effects cannot interfere. Use synthetic data; protect authentication state and sensitive test artifacts. Keep the behavior under test real and state what a controlled dependency removes from coverage.

## Diagnose and verify

Read [debugging and CI](references/debugging-and-ci.md) for failures, retries, traces, environment differences or execution configuration. Use failure evidence to choose a repair. Do not weaken assertions, suppress errors, silently skip coverage, raise retries/timeouts or rebaseline screenshots solely to obtain green. Report an actual product regression and change the product only within the requested scope.

Run the focused test through the project's normal command and relevant related suites. Follow the shared [execution policy](../../guidelines/testing-guidelines.md#repository-test-execution): development checks stay coverage-free, unit/integration code coverage gates wait for final verification, and browser coverage remains an explicit diagnostic. Check concurrency or repeat a test a bounded number of times when the change or failure warrants it. A pass after retry remains flaky. Run the applicable type check separately; Playwright transpilation does not establish type correctness.

Use [specialized checks](references/specialized-checks.md) for visual comparisons, accessibility and keyboard/focus behavior, frames, files, dialogs or device emulation. State their limits: semantic locators or a successful scan do not certify accessibility, and emulation is not real-device verification.

Report the behavior covered, actual commands and browser projects, observed results, and what remains unverified. If execution is blocked, name the concrete blocker. Distinguish reviewed/generated tests from tests actually run, and a final passing run from an observed red-to-green regression check. Treat code generation and agent suggestions as drafts to inspect and verify.
