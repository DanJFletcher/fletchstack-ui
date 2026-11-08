# Fixtures, authentication, and test data

Use this reference when tests create data, reuse authenticated state, run concurrently, or replace dependencies. Reuse the project's existing fixtures and provisioning APIs before inventing another setup layer.

## Match ownership to the mutable state

Playwright Test normally gives each test a fresh browser context. This separates cookies and browser storage; it does not reset the database, shared account preferences, message queue, or inbox behind the application. Treat those as separate ownership decisions. [Browser isolation](https://playwright.dev/docs/browser-contexts)

| Resource | Useful lifetime and ownership |
| --- | --- |
| Browser session | Usually the built-in test-scoped context/page. |
| Mutable records and settings | Test-owned resources or a verified reset before use. |
| Expensive reusable infrastructure | Worker scope when sharing cannot contaminate scenarios. |
| Account allocation | Shared only when effects cannot interfere; otherwise allocate at the scope needed by the mutations. |

Use fixtures to keep acquisition and teardown together. Dependencies initialize before their consumers and dispose afterward. Prefer the narrowest practical lifetime for mutable resources; a worker-scoped account still needs state discipline between tests. Preserve setup failures instead of proceeding with missing prerequisites. Make cleanup repeat-safe, target only owned resources, and expose cleanup failures. [Fixtures](https://playwright.dev/docs/test-fixtures)

Namespace resources for the actual topology: simultaneous runs, projects or shards, workers, and tests where they share a backend. `parallelIndex` remains stable across a worker restart, whereas `workerIndex` changes; neither identifies a globally unique CI run. This means a per-worker suffix alone can still collide across independent runs. Design retries to start from a known state, including after an interrupted attempt. [Parallelism](https://playwright.dev/docs/test-parallel)

Use synthetic values. Unique identifiers prevent collisions; predictable semantic values make assertions understandable. Assert against the specific entity created for the scenario instead of any pre-existing matching row.

## Reuse authentication without sharing unsafe state

- A shared authenticated account is suitable when tests do not interfere through server-side mutations. Separate accounts or stronger resource isolation are needed when they do.
- Reuse saved authentication for scenarios where login is only a prerequisite; exercise login normally when authentication is the behavior under test.
- Wait for authentication to finish before saving state. Refresh expired state, and keep authentication files out of version control.
- Use separate contexts for distinct actors in a collaboration scenario.
- UI mode does not run the authentication setup project by default; refresh it deliberately when needed.
- Applications using session storage need explicit handling rather than assuming `storageState` captures it.

[Authentication](https://playwright.dev/docs/auth)

Inspect what the app stores and the installed Playwright version. For example, including IndexedDB with `storageState({ indexedDB: true })` requires v1.51 or later and is relevant when authentication relies on that storage. Do not copy newer storage options into an older project or capture extra state without a reason. [BrowserContext API](https://playwright.dev/docs/api/class-browsercontext)

## Prepare prerequisites through the right boundary

An API can create a customer or inventory needed by a checkout test, while the checkout itself remains a UI action. Check setup responses and preserve the identifiers needed for assertions and cleanup. Do not pre-create the order whose creation the test claims to verify.

`page.request` and `context.request` share the browser context's cookie storage; a separately created API request context has independent cookies. Choose intentionally so setup requests use the expected identity and do not unexpectedly change the browser session. API reads can verify persisted postconditions when that is the requirement. [API testing](https://playwright.dev/docs/api-testing)

## Make replaced dependencies explicit

Keep the capability under test real. Routing can control third-party responses and hard-to-reach failure states. Register routes before navigation or the triggering action, match narrowly enough to avoid unrelated traffic, and use realistic response shapes. State which integration assurance is lost and where a real contract or integration check belongs.

`route.fulfill()` supplies the response without calling that endpoint. `route.fetch()` calls it and allows modifying the response. HAR replay is also controlled network behavior, not proof that the live dependency works; inspect recordings for sensitive headers and cookies before retaining them. [Mock APIs](https://playwright.dev/docs/mock)

If routing unexpectedly misses traffic, investigate service workers. Blocking them is a documented troubleshooting option, but it changes the test boundary. Do not block the very service-worker behavior the scenario needs to verify. [Network](https://playwright.dev/docs/network)

## Control the clock that owns the behavior

For time-dependent browser behavior, use supported clock controls instead of waiting through real durations. `setFixedTime` fixes the perceived date while timers keep running; clock installation enables timer control and must precede the timer usage it replaces. Browser clock control does not change server time, token issuance, or external schedules. Choose a server-side test seam when those clocks own the requirement, and fix locale/timezone when formatting is part of the expected result. Verify API availability against the installed version. [Clock](https://playwright.dev/docs/clock)

If tests still interfere or pass only on retry, use [debugging and CI](debugging-and-ci.md) to investigate evidence before changing concurrency or retry policy.
