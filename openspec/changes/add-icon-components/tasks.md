# Tasks

## 1. Foundation and Semantic Tokens

- [x] 1.1 Record the starting lint/type/build results and independent unit/integration/E2E coverage baselines; identify any existing environment failure separately from icon work in the verification notes.
- [x] 1.2 Extend the foundation with icon ownership, outline artwork, accessibility modes, fixed px sizes, inherited color, stroke coordinate units, and custom-artwork constraints; verify the document matches the two capability specs and has no unresolved design decision.
- [x] 1.3 Add primitive references and semantic icon sizes/stroke width to Corporate and Luna, with purpose descriptions; run the token generator and extend unit/integration token assertions to verify equal contracts, exact outputs, and existing reference/type validation.

## 2. Icon Foundation and Stylesheet Publication

- [x] 2.1 Implement typed Icon, IconProps, IconSize, and IconStyle with SVG children/viewBox, default medium sizing, ref access, customization, and controlled accessibility attributes; add RTL and SSR cases for default/explicit sizes, omitted/blank/trimmed labels, SVG composition, native forwarding, reserved runtime props, and deterministic output, and verify the focused tests pass.
- [x] 2.2 Add semantic-token-driven icon CSS and wire icon.css into explicit package exports, stylesheet copying, and combined styles.css; extend copy-script unit/integration tests and verify the library build emits the stylesheet without losing CSS side-effect preservation.
- [x] 2.3 Extend Chromium integration fixtures with Icon hydration, dimensions, color inheritance, nested theme resets, scoped overrides, Button keyboard composition, and enlarged/spaced long-label reflow; verify focused integration tests pass and report no hydration/page errors.
- [x] 2.4 Document custom SVG, fill/stroke customization, selective and combined CSS imports, label semantics, refs, fixed sizing, and scoped overrides in the README; verify documented imports/types through the existing packed-consumer fixtures.

## 3. Opt-in Named Catalog

- [x] 3.1 Add separate MoonIcon, SunIcon, CheckIcon, CloseIcon, ChevronDownIcon, ArrowRightIcon, PlusIcon, and ExternalLinkIcon modules using the shared 24×24 outline convention and Icon foundation; verify focused tests render each distinct artwork at all sizes and preserve its fixed viewBox/children contract.
- [x] 3.2 Publish individual root named exports and NamedIconProps with ref, label, className/style, and compatible SVG forwarding; extend unit and integration cases for all wrappers plus public typing fixtures that reject unsupported artwork/naming inputs, then run the relevant tests and declaration checks.
- [x] 3.3 Add packed-consumer production bundle cases for MoonIcon-only, Button-only, and an additional-icon positive control; verify used geometry remains, unused geometry disappears, React remains external, and packed React 18/19 declarations/SSR checks pass.
- [x] 3.4 Document the eight exports and intended uses, opt-in import examples, and how future named icons join the shared contract; verify examples compile and the documented catalog matches the exported components.

## 4. Storybook and Browser Journeys

- [x] 4.1 Add Icon stories for custom outline/filled artwork and viewBox, every size, default/blank-label decoration, meaningful naming, refs/native props, catalog, both themes, nested scopes, semantic overrides, and Button composition; verify the Storybook test runner passes with accessibility violations configured as failures.
- [x] 4.2 Replace the private Button-story moon with the public MoonIcon and load icon.css in the preview; rerun existing Button interaction stories and verify names, focus, disabled behavior, gaps, and long-label wrapping are preserved while recording the intentional outline-artwork change.
- [x] 4.3 Generalize the E2E preview adapter to complete story IDs and update existing callers without changing successful-play readiness or automatic coverage collection; verify the existing Button and Storybook journeys still pass.
- [x] 4.4 Add readable Playwright journeys for the custom Icon, each named icon, sizes and naming modes, ref/native customization, both theme scopes/overrides, and Button state/reflow composition; verify independently that E2E reaches 100% per scoped browser file with scripts still excluded.
- [x] 4.5 Visually inspect all eight icons at each size in both themes, inherited Button state colors, narrow/enlarged text composition, and customization; record findings and any unperformed screen-reader/manual checks in verification evidence rather than claiming automated coverage proves accessibility compliance.

## 5. Integrated Acceptance

- [x] 5.1 Run lint, type checking, unit, integration, Storybook, and sequential CI-mode E2E commands; verify all suites pass with their independent 100% coverage gates intact, and record command results and remaining environmental blockers.
- [x] 5.2 Run the library build, static Storybook build, built-package browser verification, and packed-package checks; verify existing Button consumption still works alongside the new exports and selective/combined icon CSS imports.
- [x] 5.3 Extend the minimal Gatsby and Astro consumption documentation with icon-plus-Button examples, keeping handlers inside React islands; verify compilation/SSR through packed fixtures and explicitly record which full framework builds were actually exercised.
