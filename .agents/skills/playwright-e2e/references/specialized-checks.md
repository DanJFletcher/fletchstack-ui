# Specialized browser checks

Read the relevant section when the requirement involves visual layout, accessibility, files, embedded content, native dialogs or device behavior. Add these checks for the risk they address rather than to every journey.

## Visual comparisons

Use `toHaveScreenshot` for a stable page or region whose appearance is part of the contract. Keep baseline and execution environments aligned: browser, OS, fonts, viewport, device scale, locale and rendering conditions can change pixels. Establish meaningful readiness and control animations or dynamic data where they are incidental. A screenshot alone does not prove persistence, authorization or another business outcome. [Visual comparisons](https://playwright.dev/docs/test-snapshots)

Inspect expected, actual and diff images before changing a baseline. Separate an intended design change from an environment mismatch or product regression. Mask only content irrelevant to the assertion; masking the subject or broadly increasing tolerances can hide the defect. Update the reviewed affected baselines rather than accepting all changed snapshots automatically.

## Accessibility and keyboard behavior

Use the project's accessibility tooling; `@axe-core/playwright` is an additional package, not a built-in Playwright assertion. Scan relevant interactive states after opening menus, dialogs or error messages and waiting for their content. Avoid broad exclusions: excluding an element also excludes its descendants and all scan rules there. Document any narrowly scoped known issue. [Accessibility testing](https://playwright.dev/docs/accessibility-testing)

For a keyboard requirement, exercise the actual keys and assert focus and the visible result. Check the transitions the component promises, such as entering a dialog, moving through its controls, closing it and returning focus. Calling `locator.focus()` directly can arrange a state, but does not prove that a user can reach it through keyboard navigation. Use retrying focus assertions where appropriate. [Actions](https://playwright.dev/docs/input), [Locator assertions](https://playwright.dev/docs/api/class-locatorassertions)

A successful automated scan establishes only that the configured rules found no issues in the examined state. Semantic locators, an ARIA snapshot and an axe scan each provide useful evidence, but none establishes accessibility conformance or real screen-reader usability by itself. Record manual or assistive-technology verification still needed for the requirement. [W3C evaluation guidance](https://www.w3.org/WAI/test-evaluate/)

## Uploads and downloads

For uploads, select a synthetic fixture through the file input with `setInputFiles`. If the input is created through a chooser, subscribe to `filechooser` before the action that opens it. Then assert the required application result: file selection alone does not prove that processing or persistence succeeded. Prefer small, intentional fixture contents over incidental files from the developer's machine. [Actions: file uploads](https://playwright.dev/docs/input#upload-files)

A download event signals that a download started. Await completion with `saveAs`, inspect the required content and keep the context alive until finished. Use a test-specific output path; temporary downloaded files disappear when their browser context closes. [Download API](https://playwright.dev/docs/api/class-download), [Test output paths](https://playwright.dev/docs/api/class-testinfo#test-info-output-path)

This illustrative fragment assumes a Playwright Test body with `page`, `testInfo` and `expect`, `readFile` imported from `node:fs/promises`, and an application whose Export button downloads exactly the shown CSV. Adapt the locator and contents to the real contract:

```ts
const downloadPromise = page.waitForEvent('download');
await page.getByRole('button', { name: 'Export', exact: true }).click();
const download = await downloadPromise;

const exportPath = testInfo.outputPath('export.csv');
await download.saveAs(exportPath);
const contents = await readFile(exportPath, 'utf8');
expect(contents).toBe('name\nExample item\n');
```

For a general CSV export, parse and compare the relevant records instead of assuming a universal newline or quoting convention. A filename check is useful only when the filename is itself required.

## Frames, popups and dialogs

Enter the intended iframe with a scoped `frameLocator` and locate controls within it. Page-level locators normally address the main frame. Make the frame identity explicit when several frames contain similar controls; do not bypass an embedded flow with DOM evaluation when that flow is what the test must verify. [Frames](https://playwright.dev/docs/frames)

For a popup, subscribe before its triggering action, then use the returned page and assert the required URL or UI outcome. A new page existing is not proof that the flow completed. Use the event ordering described in [locators and async](locators-and-async.md). [Pages](https://playwright.dev/docs/pages)

Native JavaScript dialogs differ from DOM dialogs. A registered `dialog` handler must accept or dismiss the dialog; a handler that only logs it can stall the interaction. Without a listener, Playwright dismisses dialogs automatically. Choose handling that matches the scenario, and verify the resulting operation as well as any required message. [Dialogs](https://playwright.dev/docs/dialogs)

## Device and browser limits

Use existing project profiles for the viewport, touch, locale, timezone or permissions relevant to the requirement. Emulation changes browser settings; it does not establish behavior on physical hardware. Report physical-device gaps when hardware or platform integration matters. [Emulation](https://playwright.dev/docs/emulation)

Playwright's WebKit build is not the branded Safari application, and platform-dependent behavior such as media support can differ. Choose the required browser/OS combination deliberately and describe the configuration actually exercised. [Browsers](https://playwright.dev/docs/browsers)
