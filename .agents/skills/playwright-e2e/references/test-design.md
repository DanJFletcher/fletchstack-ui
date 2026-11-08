# Test design and useful evidence

Read this when selecting journeys, choosing a boundary or deciding whether an assertion can catch the intended regression.

## Select coverage by risk and fidelity

Name the failure that would matter to a user and why the browser adds evidence. Critical journeys, browser navigation, cross-layer wiring and persisted outcomes often warrant E2E tests. Use lower-level tests for suitable validation or calculation permutations instead of repeating them all through a long UI flow. Choose the smallest boundary that retains the necessary fidelity; there is no universal ratio of test types. [Google: Larger Testing](https://abseil.io/resources/swe-book/html/ch14.html)

UI execution and E2E scope are different dimensions. A browser can drive a frontend with a simulated backend; an integrated test can start at an API. Describe the boundary being exercised rather than assigning assurance based on the tool name. [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)

| Scenario intent | Useful boundary choice |
| --- | --- |
| A customer completes an order | Keep the application path responsible for creating the order real; control an external payment provider when appropriate and state the missing provider assurance. |
| A form explains a server rejection | A targeted response stub can exercise that UI state; it does not verify the server's rejection logic. |
| Shipping-price combinations | Prefer focused rule/API tests when the browser does not add relevant fidelity; retain a journey proving the chosen value reaches the user. |
| Login, session expiry or role transitions | Exercise the relevant authentication transition rather than bypassing the feature with a pre-authenticated session. |

Use realistic, maintained test doubles where control is useful. A stub can diverge from a real service; identify the integration or contract coverage that supplies the missing evidence when that contract matters. [Google: Test Doubles](https://abseil.io/resources/swe-book/html/ch13.html)

## Make the test contract visible

Before writing, be able to state:

- The actor and the initial state this test owns.
- The meaningful action or connected journey.
- The expected observable result and how it differs from the initial state.
- The systems exercised and any replaced dependency.
- The regression that should fail this test and the cleanup owner.

For example: an authenticated editor renames a document created for this test; after saving, a fresh server-backed read shows the new name. Login and document creation are prerequisites here. Renaming through a setup API would bypass the subject of the test.

Use APIs or factories for prerequisites where appropriate and keep expected results independent of the computation being tested. A setup helper should verify success and identify the created resource. An API response is useful supporting evidence, but retain UI assertions when the user-visible result is the requirement. [API testing](https://playwright.dev/docs/api-testing)

## Prevent tests that pass without proving the result

| Weak evidence | Stronger evidence when required by the contract |
| --- | --- |
| A success toast after Save | Establish a different original value, save a test-owned value, then verify persisted state through a fresh load or appropriate independent read. Ensure the observation cannot be satisfied solely by optimistic client state. |
| No rows after Delete | Create and identify the resource, confirm it is present, delete that resource, then assert its absence after the operation completes. |
| An error is absent immediately | First establish a meaningful terminal state; then assert the prohibited outcome is absent where relevant. |
| Some matching text exists | Scope the result to this test's entity/account/value so existing data cannot satisfy the check. |
| A protected button is hidden | Verify hiding for the UI contract; test rejection at the server boundary when authorization enforcement is the requirement. |
| Navigation or a request succeeded | Assert the specific content or state that the journey promises; a successful interaction alone does not prove its business result. |

These checks are contextual. Do not add persistence reads to purely transient UI behavior or turn every browser scenario into a security audit. Assert what the requirement promises, with enough evidence to exclude its plausible failure modes. Playwright's behavior-focused guidance supports resilient, user-facing assertions. [Best Practices](https://playwright.dev/docs/best-practices)

## Keep scenarios readable and independently useful

Use one coherent purpose per test. A checkout can require several actions and connected assertions; unrelated profile editing should be a separate scenario with its own setup. Split by meaningful outcome rather than a mechanical assertion count. Test error handling and recovery when they represent important risk, without chaining tests so that one creates another's prerequisites.

Reuse fixtures and stable domain helpers when they remove incidental setup or repeated interactions. Keep the essential behavior and outcome apparent at the test's call site; do not require a page-object hierarchy for a small suite. Page objects are an available organization technique, not a correctness condition. [Page object models](https://playwright.dev/docs/pom)

For a regression fix, run the focused test against the faulty behavior where feasible and confirm that its failure identifies the expected defect, rather than broken setup or a locator typo. Then rerun against the correction. For coverage of already-working behavior, a controlled fault in a disposable fixture can assess assertion strength when useful; do not mutate a live system just to demonstrate red. Report when only the final behavior was verified.
