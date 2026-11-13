# Adding a component

Use this recipe with the [component skill](../.agents/skills/build-react-components/SKILL.md), [component guidelines](../.agents/guidelines/component-library.md), and [token guidelines](../.agents/guidelines/design-tokens.md). Reuse context already established in the session; read more only when a decision needs it.

## Choose references by concern

| Concern | Reference | Boundary |
| --- | --- | --- |
| Layout and semantic spacing | [Stack](../src/components/stack/Stack.tsx) | Does not define interactive semantics |
| Passive content | [Badge](../src/components/badge/Badge.tsx) | Its attribute restrictions are specific to passive status |
| Native controls and field relationships | [Switch](../src/components/switch/Switch.tsx) | Reuse field utilities only when those relationships apply |
| Resources, fallbacks, hydration | [Avatar](../src/components/avatar/Avatar.tsx) | Loading state is unnecessary for components without resources |

Resolve responsibility and parent-owned layout, the native element and accessible name, applicable keyboard/focus behavior, requested variants/states, semantic tokens, and verification boundaries. A short checklist in the conversation is enough. Routine choices need no extra approval or planning document; ask about genuinely missing product decisions. Do not copy unrelated props, variants, or defensive checks from a reference.

## Prepare structure

The single-root scaffold supports `div`, `span`, `section`, `button`, and `input`, selected explicitly. Names use PascalCase (up to 64 letters/digits); categories start with a capital letter and use letters/spaces. Preview before applying:

```sh
npm run component:new -- StatusLabel --category Feedback --element span --dry-run
npm run component:new -- StatusLabel --category Feedback --element span
npm run component:check -- StatusLabel
```

These commands prepare structure; they do not implement the contract. Finish every `COMPONENT_TODO` marker. Author semantic tokens, behavior, meaningful examples, and tests. Creation reports the expected test paths without generating empty or skipped tests. The planned browser owner remains missing until its suite is authored; structural checking and affected discovery must report that incomplete state. Unsupported compound structures use manual authoring with the same integration checklist.

Keep shared examples plain React with direct implementation imports. Storybook owns metadata/controls/play functions; harness adapters own isolated scenarios, explicit styles, and controlled resource inputs. See [Avatar examples](../src/components/avatar/stories/avatar-examples.tsx), [stories](../src/components/avatar/stories/Avatar.stories.tsx), and [harness adapter](../tests/browser-harness/scenarios/Avatar.tsx). Do not import Storybook metadata or execute play functions from harness scenarios.

## Complete integration

| Location | Responsibility |
| --- | --- |
| [Source exports](../src/index.ts) and component index | Explicit runtime and type exports |
| [Style distribution](../scripts/copy-styles.mjs) and [package exports](../package.json) | Individual and ordered combined styles |
| [Preview](../.storybook/preview.tsx) | CSS import and category placement |
| [Harness catalog](../tests/browser-harness/catalog.json) | Scenario IDs and actual suite ownership |
| [Public API test](../tests/unit/build/public-api.test.tsx) | Independently reviewed runtime API |
| [Typed consumer](../scripts/fixtures/consumer.tsx) and [runtime consumer](../scripts/fixtures/consumer.mjs) | Installed package behavior, types, and styles |
| [Browser behavior matrix](../tests/browser-behavior-matrix.md) | Browser guarantees and owners |

The build-only [component-family inventory](../scripts/component-inventory.json) owns mechanical source/export/style/category mappings and stylesheet order. Multiple public components can belong to one family; internal modules remain explicitly classified. Static exports and preview imports remain reviewable. Do not use inventory membership as browser dependency ownership or generate every expected public contract from it. Shared field CSS stays ahead of consumers; tokens stay first.

Dry run prints `Create`/`Edit` paths and remaining authored work without writing. Creation refuses existing component files/identities and symlink destinations, preserving unrelated edits. Unsupported registration layouts fail before writes. Repeating creation is an error; continue editing the prepared files instead. A filesystem failure reports any paths already changed so they can be reviewed without resetting the worktree.

Immediately after creation, checking reports missing authored DOM/browser tests and unfinished scaffold markers with exit status 1. Resolve those findings; do not add fake tests merely to satisfy the checker. A successful check says that structural checks passed and behavioral verification remains independently required. The checker reads source and catalog metadata; it does not execute assertions or prove screen-reader behavior.

Author detailed inputs/state behavior in DOM tests, SSR/hydration guarantees in integration tests, and real resource/layout/theme/keyboard behavior in browser tests. Keep independent package consumers. Test expectations come from the contract, not the generated skeleton. Check visual and applicable accessibility behavior and disclose manual evidence still missing.

## Verify and report

Follow the [test execution policy](../.agents/guidelines/testing-guidelines.md#repository-test-execution) and [test guide](../tests/README.md). Development feedback is coverage-free; both full independent coverage gates wait until implementation, tests, cleanup, and review are finished. Shared registration/token/export changes retain full browser fallback. A structural check is not behavioral verification or completion evidence.

For the next real component, record setup duration, missed registrations/corrective edits, development verification time, final verification time, and unfinished work. Separate observations from estimates. A synthetic scaffold run does not establish a real-component speedup.

## Motion patterns

Consult the [motion foundation](motion.md) when introducing or changing motion. Record purpose, timing/easing roles and a reduced-motion alternative. Keep focus, semantic state and keyboard access immediate; test observable motion and final state without fixed sleeps. New JavaScript-driven automatic movement must follow live preference changes. Update Storybook preview support for every animated consumer. The existing verification cadence still applies.
