# Locators and asynchronous behavior

Use this reference when choosing a target, awaiting a result, or investigating an interaction race. Inspect the rendered UI or existing application code before choosing names and selectors; a plausible locator is not evidence that the control exists.

## Express the intended target

Prefer a role and accessible name for controls, a label for form fields, and meaningful text for content. Use a stable test ID when semantics cannot distinguish the target reliably. Scope repeated controls to the relevant row, dialog, or region. Locators resolve against the current DOM, so prefer them to storing element handles across updates. Single-target actions reject ambiguous matches: refine the scope or name rather than adding `.first()` automatically. Position is legitimate when order itself is the requirement. [Locators](https://playwright.dev/docs/locators)

This fragment assumes a Playwright Test `page`, an imported `expect`, and a table with a cell identifying the test-owned invoice. Adapt the names to the actual application:

```ts
const invoiceRow = page.getByRole('row').filter({
  has: page.getByRole('cell', { name: 'Invoice 42', exact: true }),
});

await expect(invoiceRow).toHaveCount(1);
await invoiceRow.getByRole('button', { name: 'Edit', exact: true }).click();
await expect(page.getByRole('dialog', { name: 'Edit invoice' })).toBeVisible();
```

## Separate interaction readiness from success

Actions wait for their applicable actionability checks, such as visibility, stability, and whether a click can receive events. A completed click does not establish that a save, payment, or navigation succeeded. Assert the promised outcome separately. `force`, `dispatchEvent`, and JavaScript evaluation bypass parts of ordinary user interaction; use them only when the intended test mechanism calls for that behavior, not to conceal an obstructed or unusable control. [Actionability](https://playwright.dev/docs/actionability)

A control can appear enabled before hydration attaches its listeners. If early clicks vanish or input values reset, investigate application readiness. Properly disabling controls until they are ready can expose the correct contract to Playwright. Adding a sleep would hide this user-visible defect. [Navigations](https://playwright.dev/docs/navigations)

## Wait for the required observation

| Need | Appropriate operation |
| --- | --- |
| A UI condition should eventually hold | Await a locator assertion such as `expect(locator).toHaveText(...)`. |
| A collection should reach its expected state | Assert its count or text array directly before further processing. |
| An eventual non-DOM value should satisfy a condition | Use a bounded `expect.poll` over a read operation. |
| Several observations must eventually agree | Consider `expect(...).toPass` with an explicit timeout and a repeat-safe callback. |

`expect(await locator.isVisible()).toBe(true)` compares one observation. It does not acquire the retry behavior of `await expect(locator).toBeVisible()`. Await asynchronous assertions. Because polling and `toPass` repeat their callbacks, keep non-idempotent writes such as purchases outside them. `toPass` has its own timeout behavior; do not assume a configured assertion timeout bounds it. [Assertions](https://playwright.dev/docs/test-assertions)

`isVisible()` and `locator.all()` return current observations without waiting for the desired state. In particular, iterating the result of `all()` while a list is loading can miss items. Establish the expected list condition first, or assert the collection directly. Do not add an extra wait before every action; use one where the requirement introduces a condition that actionability does not establish. [Locator API](https://playwright.dev/docs/api/class-locator)

For absence assertions, establish the relevant precondition and completion signal. An error that has not appeared yet is not proof of success. See [test design](test-design.md) for false-pass examples.

## Subscribe before triggering transient events

Create the event promise before the action, then await both the action and the event. Awaiting the event before triggering it deadlocks; registering afterward can miss a fast event. This pattern applies to popups, downloads, and relevant network events. [Events](https://playwright.dev/docs/events)

This fragment assumes a link named `View receipt` opens a popup with a `Receipt` heading; those are illustrative application contracts:

```ts
const receiptPromise = page.waitForEvent('popup');
await page.getByRole('link', { name: 'View receipt', exact: true }).click();
const receiptPage = await receiptPromise;

await expect(receiptPage.getByRole('heading', { name: 'Receipt', exact: true }))
  .toBeVisible();
```

When waiting for a response, match the method, relevant path, and entity or request details where needed so an unrelated concurrent request cannot satisfy the wait. Inspect the response when it matters to the contract, then verify the visible result. An HTTP response alone does not prove that the UI handled it correctly. [Network](https://playwright.dev/docs/network)

## Avoid generic readiness guesses

Use requirement-specific UI conditions or URL assertions instead of fixed sleeps or `networkidle`. A page may keep background connections open or become usable before unrelated traffic settles. Also, `page.goto()` resolving does not guarantee a successful HTTP status: responses such as 404 and 500 do not automatically make it throw. Verify the required page state and response status where relevant. [Page API](https://playwright.dev/docs/api/class-page)

For file completion, dialog handling, and frame scope, use [specialized checks](specialized-checks.md). For evidence-driven timeout changes and tracing, use [debugging and CI](debugging-and-ci.md).
