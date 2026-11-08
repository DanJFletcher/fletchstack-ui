# Tasks

## 1. DOM Environment and Setup

- [x] 1.1 Record the pre-edit working-tree state and passing results from `npm run test:unit`, `npm run test:integration`, and `npm run test:storybook`; verify both independent coverage reports reach 100% and preserve unrelated edits.
- [x] 1.2 Add pinned direct development dependencies for `jsdom`, `@testing-library/user-event`, and `@testing-library/jest-dom`, selecting versions compatible with the existing Node floor, Vitest, and React; verify installation and `npm ls` report satisfied peers without changing library peers or exports.
- [x] 1.3 Create DOM-only TypeScript setup with Vitest matchers, imported-hook cleanup, and a scoped/restored React act-environment flag, and add the first accessible-name test in `tests/unit/components/Button.test.tsx` using the per-file jsdom directive and setup import; verify the focused file passes without act warnings and the Node SSR file still passes separately.
- [x] 1.4 Document environment selection, explicit setup import, cleanup ownership, and a working focused DOM command in `tests/README.md`; verify the documented command succeeds and DOM setup is not imported by SSR or token/build tests.

## 2. Button Contract Migration

- [x] 2.1 Replace general label and composition substring checks with focused React Testing Library cases for visible labels, explicit icon-only names, and decorative children; verify role/name queries and accessible-name assertions pass with real composed children.
- [x] 2.2 Add focused DOM cases for default and explicit button types, form association, enabled/disabled state, hidden attributes, consumer classes, inline styles, and semantic custom properties; preserve every existing contract case and verify targeted DOM tests pass without full HTML or class-order assertions.
- [x] 2.3 Preserve the existing variant and size selection cases using unordered class membership for their styling hooks, keeping visual verification in the existing browser suites; verify every existing variant/size case has an explicit retained test and no assertion depends on class order.
- [x] 2.4 Add awaited user-event tests for click forwarding and disabled activation, public ref focus, and focused `rerender` cases for becoming disabled and ignoring subsequent activation; verify each case asserts its own observable outcome and a reversible broken-contract check produces a meaningful failure before restoration.
- [x] 2.5 Narrow `Button.ssr.test.tsx` to Node-only deterministic native markup, default/explicit form types, disabled/hidden server attributes, and representative native/ARIA/customization forwarding; verify it passes independently without DOM setup and every removed general assertion is accounted for in the migrated or retained suites.
- [x] 2.6 Update `tests/README.md` with query/interaction conventions, the contract-to-suite mapping, and the DOM-versus-SSR-versus-browser limits; verify examples match the implemented tests and no shared assertion or render abstraction is introduced without a concrete need.
- [x] 2.7 Run the DOM file independently and with shuffled test order, alongside the SSR and existing token/build unit tests; verify cleanup prevents mounted elements or React globals from leaking, and `npm run test:unit` still reaches 100% under the unchanged production coverage scope.

## 3. Integration Verification

- [x] 3.1 Run `npm run lint`, `npm run typecheck`, and `npm run build`; verify all pass and no permanent production, CSS, token, public type, export, or framework-consumption changes were introduced.
- [x] 3.2 Run `npm run test:unit`, `npm run test:integration`, and `npm run test:storybook` independently; verify both per-file coverage gates remain at 100%, integration/browser checks are retained, and Storybook accessibility checks still pass without a running Storybook server.
- [x] 3.3 Review the final diff and report the focused negative-check result and all verification outcomes; verify coverage include/exclude patterns, thresholds, report paths, and CI commands are unchanged and list any checks that could not be completed.
