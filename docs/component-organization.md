# Component organization

Implementation ownership is independent of Storybook navigation. Use a kebab-case family under `src/components/` with PascalCase public modules, its CSS, an explicit public `index.ts`, focused `__tests__/`, and consumer-facing `stories/`. Compound Card parts stay together; Field and its standalone label/message primitives share the field family. Keep private helpers with their owner; shared runtime hooks belong in `src/internal/hooks/`.

Unit tests opt into jsdom per file and explicitly import [DOM support](../tests/support/dom.ts). Node SSR/build/token tests must retain Node defaults. Component integration and E2E live centrally under `tests/{integration,e2e}/components/<family>/`; component hydration apps live beside their integration owner in `fixtures/`. Shared browser lifecycle, bundling, and token-project infrastructure stay central. Cross-family themes and real Storybook-manager journeys have their own central directories.

Root `stories/foundations/` owns design guidance, `stories/patterns/` links canonical multi-component examples, and `stories/shared/` owns generic preview support. Component demos and gallery runtime belong to the family. Preview CSS imports are explicit and retain their cascade order.

Storybook uses Design System, Components, Patterns. Components are grouped into Actions, Forms, Surfaces, and Visuals. Pin metadata IDs independently of titles; preserve existing story export keys and ID-to-example meaning when moving or renaming files. Document independently reusable public components separately, and compound parts through their parent. Link patterns to working canonical stories rather than copying implementations.

Development type checking includes tests and stories. Declaration builds and library runtime graphs exclude them. Unit and integration coverage independently include production library/build modules at 100% per file. Browser coverage additionally includes all authored stories, examples, and preview runtime, including unvisited files; tests, fixtures, declarations, and Node configuration are excluded. Never exclude an entire family or lower a gate to accommodate relocation.

Focused commands from the repository root (without whole-suite coverage):

```sh
npx --no-install vitest run --project unit src/components/textarea/__tests__
npx --no-install vitest run --project integration tests/integration/components/textarea
npx --no-install vitest run --project storybook src/components/textarea/stories
npx --no-install playwright test tests/e2e/components/textarea --reporter=list
```

The same family convention applies to button, card, checkbox, field, form-group, icon, select, and text-input. See the [test guide](../tests/README.md) for complete suite commands. Filtered Playwright runs require the explicit reporter override to omit the complete-inventory coverage gate; full verification retains it.
