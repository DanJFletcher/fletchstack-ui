---
name: react-testing-library
description: Write, review, or debug React DOM tests with React Testing Library, using user-facing queries, realistic interactions, and assertions on observable behavior.
---

# React Testing Library

Test what a person can observe and do through the rendered UI. Choose scenarios that remain valid when component internals change. React Testing Library adds React rendering utilities to DOM Testing Library; it works alongside a test runner and a DOM environment. [Introduction](https://testing-library.com/docs/) · [React introduction](https://testing-library.com/docs/react-testing-library/intro/)

## Establish the test boundary

Inspect the existing runner, DOM environment, package versions, setup files, test commands, and render helpers before editing. Reuse the project's conventions and choose test cadence and evidence under the shared [development policy](../../guidelines/testing-guidelines.md#development-policy).

Render the relevant component or composition with the providers it needs. Keep children real when their integration is part of the behavior; isolate external dependencies at their boundaries. Verify visible output, input values, focus, enabled states, navigation, or a public callback whose effect defines the contract. Avoid assertions on component instances, hook state, private methods, lifecycle execution, or which child component was rendered. [Guiding principles](https://testing-library.com/docs/guiding-principles/)

If setup is missing, add only what the task requires using the project's package manager. Check compatible versions and peer dependencies; current React Testing Library installation guidance includes `@testing-library/dom`. Confirm the runner provides a DOM and that DOM matchers are configured when used. Preserve automatic cleanup where supported; register cleanup after each test if the runner does not supply it. [React introduction](https://testing-library.com/docs/react-testing-library/intro/) · [React API](https://testing-library.com/docs/react-testing-library/api/)

## Choose queries deliberately

Use `screen` for the document and `within(element)` for a named region, dialog, or repeated item.

- Prefer role and accessible name: `screen.getByRole('button', { name: /save/i })`.
- Use label text for form controls. Use visible text, display value, or alternative text when these express how the element is identified. Placeholders do not replace labels.
- Use a stable test ID when meaningful semantic queries are impractical, including unavailable localized text. Avoid selectors tied to CSS classes or DOM nesting. Test IDs are a supported escape hatch.
- Resolve multiple matches by meaningful scope or a more precise name. Use plural queries for collections; select by index only when order is itself meaningful.

| Need | Query |
| --- | --- |
| Element should exist now | `getBy…` |
| Element should be absent now | `queryBy…` |
| Element should appear asynchronously | `await findBy…` |
| Multiple elements | Corresponding `…AllBy…` |

Single-element queries reject ambiguous matches. `queryBy` returns `null` for no match; `queryAllBy` returns an empty array. [Queries](https://testing-library.com/docs/queries/about/) · [DOM introduction](https://testing-library.com/docs/dom-testing-library/intro/) · [FAQ](https://testing-library.com/docs/dom-testing-library/faq/)

## Exercise interactions and await outcomes

Prefer `user-event` for supported user interactions. With v14, create `const user = userEvent.setup()` in the test before rendering and await actions such as `user.click`, `user.type`, and `user.tab`. Use `fireEvent` when a required low-level event is unsupported, making that limitation explicit. [User-event](https://testing-library.com/docs/user-event/intro/)

Use `findBy` for eventual appearance. Use `waitFor` for an eventual assertion that needs retries; its callback must throw on failure. Keep actions outside the callback because it may run repeatedly. For eventual removal, use `waitForElementToBeRemoved` while the element still exists, or a retrying absence assertion that also handles an already-removed element. Avoid arbitrary sleeps and timeout increases that conceal missing awaits or incorrect behavior. [Async methods](https://testing-library.com/docs/dom-testing-library/api-async/)

Assert the promised outcome precisely. Where configured, DOM matchers express presence and visibility; these are different properties. Avoid large DOM snapshots as the primary behavior check. [DOM matchers](https://testing-library.com/docs/ecosystem-jest-dom/)

This example assumes runner globals, configured DOM matchers, user-event v14, and a project `SubscriptionForm` that displays confirmation after submission. Adapt the imports and contract to the real component:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubscriptionForm } from './SubscriptionForm';

it('confirms a subscription after submission', async () => {
  // arrange
  const user = userEvent.setup();
  render(<SubscriptionForm />);
  await user.type(screen.getByLabelText(/email/i), 'reader@example.com');

  // act
  await user.click(screen.getByRole('button', { name: /subscribe/i }));

  // assert
  const result = await screen.findByText('Subscription confirmed');
  expect(result).toBeVisible();
});
```

## Diagnose and verify

For a failed query, inspect the rendered DOM with `screen.debug()` and check the expected role, accessible name, scope, and timing. A missing semantic query can reveal missing labels or inappropriate markup; address the relevant UI defect within scope rather than immediately weakening the query. [React API](https://testing-library.com/docs/react-testing-library/api/) · [Queries](https://testing-library.com/docs/queries/about/)

Run the affected tests through the project's runner and report commands, coverage mode and observed results. Follow the shared [execution policy](../../guidelines/testing-guidelines.md#repository-test-execution): development and debugging feedback stay coverage-free, with full unit/integration coverage gates at final verification of the agreed implementation scope. Follow the shared [development policy](../../guidelines/testing-guidelines.md#development-policy) for regression reproduction and focused probes when assertion effectiveness is uncertain; routine tests added after implementation do not each require an observed failure. Keep browser-dependent verification gaps explicit: a DOM simulation cannot establish layout or real assistive-technology behavior, and semantic queries alone do not prove accessibility compliance.
