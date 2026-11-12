# Design

## Context

See [proposal.md](./proposal.md) for motivation and scope. The existing component skill covers design principles but does not map repository registration. Source components differ materially: Stack is a layout primitive, Badge restricts passive semantics, Switch uses native form behavior and shared field utilities, and Avatar manages resource readiness.

Mechanical duplication appears in `scripts/copy-styles.mjs`, package stylesheet exports, `.storybook/preview.tsx`, build fixtures, and tests. `tests/integration/build/organization.test.mjs` mixes frozen migration guarantees with current inventory and growing name-based exceptions. Avatar demonstrates shared React examples; older Badge stories and harness fixtures duplicate compositions. The current affected selector deliberately falls back for shared registration changes. That behavior remains authoritative.

## Goals / Non-Goals

**Goals:** Make the ordinary component path discoverable, generate reviewable structure safely, and reduce repeated integration edits while preserving independent checks.

**Non-Goals:** Build a general code generator, infer design from screenshots, generate complete state machines or behavioral tests, migrate all existing stories, add a verification orchestrator, change public APIs, or relax any verification gate. Scaffold success means files were prepared, not that a component is finished.

## Decisions

### 1. Keep the recipe short and specific to this repository

Add `docs/component-authoring.md` and link it from `.agents/skills/build-react-components/SKILL.md` and the contributor documentation. Keep general principles in the existing guidelines; reference their execution policy rather than copy commands with subtly different meanings.

The recipe has three sections: choose references by concern, resolve a small contract checklist, and complete repository integration. Use Stack, Badge, Switch, and Avatar as selective references with explicit limits. The checklist covers responsibility, native element, accessible naming and applicable interaction, requested states, token ownership, and test boundaries. Reuse established context and read additional references only when relevant. Routine decisions do not create a separate document or approval gate; unresolved product decisions retain existing handling.

Alternative: expand the general skill into a comprehensive tutorial. Rejected because it increases repeated reading and mixes portable principles with repository details.

### 2. Add a small repository-local scaffold and checker

Expose `npm run component:new -- <PascalName> --category <group> --element <intrinsic> [--dry-run]` and `npm run component:check -- <PascalName>`. The agent explicitly selects the native element after considering the contract. Validate a supported intrinsic-element/ref mapping; unsupported structures receive a clear manual-authoring path rather than guessed markup. V1 targets single-root components. Compound exports and elaborate form composites remain authored extensions.

The scaffold derives the kebab-case directory, class prefix, stable story ID, and conventional paths. It creates the component/native-prop/ref skeleton, local index, scoped stylesheet, plain React example module, thin story and harness adapters, and a short component documentation stub with identifiable unfinished markers. It plans and updates source exports, component inventory, CSS package export, preview CSS import/category placement, and initial scenario/owner catalog records. It never generates token values or changes existing theme decisions.

Do not generate empty, skipped, or vacuously passing behavioral test files. Report their expected paths and register the planned browser owner explicitly; until that file is authored, the checker and existing ownership discovery must identify the missing owner. An intermediate scaffold is intentionally incomplete. The checker also reports unresolved scaffold markers, missing docs/examples/styles, duplicate identities, and mismatched mechanical registrations. Passing structural checks does not certify API quality, tests, or accessibility.

Alternative: clone a reference component wholesale. Rejected because it copies irrelevant API choices, tests, token names, and internal assumptions. Alternative: scaffold every component archetype now. Deferred until real usage demonstrates repeatable demand.

### 3. Plan all mutations before applying them

Implement a read/validate/plan phase shared by dry-run and apply, with deterministic output listing creates, edits, and remaining work. Validate names, categories, identifiers, duplicate story/scenario/export identities, source layouts, and destination containment including existing symlinks. Recheck read file contents before writing. Preflight failure makes no changes; do not require a clean worktree or overwrite unrelated edits.

Use structured JSON edits and bounded source transformations with expected-layout checks; unsupported source layouts fail with a specific manual action. Avoid whole-file reformatting. Repeating creation for an existing component fails before mutation. Stage file contents before replacements; report any filesystem failure and paths already changed, without destructive worktree resets. V1 has no force-overwrite mode.

Alternative: best-effort regex substitutions that silently skip missing anchors. Rejected because successful-looking incomplete registration is worse than an actionable failure.

### 4. Consolidate mechanical inventory without making every test self-referential

Introduce a small build-only component-family inventory, initially `scripts/component-inventory.json`, with explicit source entrypoint/export names, optional stylesheet mapping, and story category. Families can expose multiple components, as Typography and Card do; not every source module is a standalone published component. Preserve the existing stylesheet sequence exactly, including tokens first and shared field styles before consumers.

Use this inventory to drive stylesheet copying/concatenation and structural checks. Keep public source exports and Storybook imports static; scaffolding updates their bounded declarations and the checker compares them to inventory. Do not import the entire inventory into harness runtime or derive ownership from global membership. Continue using the existing harness catalog and real direct imports.

Refactor stylesheet algorithm tests around small synthetic ordered inventories and verify actual installed CSS exports independently. Retain explicitly reviewed public runtime/type consumer expectations and packed-package behavior; scaffolding reports their required updates instead of automatically blessing them. Inventory-based consistency checks cannot detect an omission shared by their producer, so independent consumer checks remain essential.

Alternative: discover all source files automatically as public components. Rejected because helpers, compound components, and development examples have different ownership. Alternative: generate every assertion from the inventory. Rejected because it would weaken independent evidence.

### 5. Separate historical preservation from current consistency

Keep frozen migration baseline inputs unchanged. Historical checks compare the protected production files, declarations, export mappings, and token declarations by identity; additions do not require new component-name exceptions. Retain full hashes where files truly remain frozen. For extensible generated tokens and export lists, compare the protected entries and their values/targets rather than stripping a growing regex list of new names.

Current inventory checks separately reject unexplained production modules, missing registrations, duplicate exports, and development modules leaking into the package. Explicit internal-module classification prevents the new checks from requiring every helper to become public. Add controlled negative fixtures showing that deleting a protected export, altering a protected token, or omitting a current registration still fails. This is a bounded change to the existing organization/build checks, not a rewrite of historical records.

### 6. Share examples while preserving adapter boundaries

Generate plain React example modules using direct component imports, with no Storybook runtime or test imports. Storybook owns metadata, controls, documentation, and play functions. Harness adapters own isolated scenarios, explicit styles, controlled resource fixtures, and suite ownership. Shared examples can be imported by both, as Avatar already demonstrates.

Only generated future components adopt the convention in this change; existing examples are references, not a migration backlog. The selector follows actual imports and retains conservative fallback for unproven runtime resources. No new analyzer special cases are required.

### 7. Validate the tooling now and evaluate real authoring later

Exercise creation in disposable fixture repositories covering ordinary names, multiword names, category registration, dry-run byte-for-byte invariance, collisions, unsafe paths/symlinks, unrelated edits, unsupported layouts, and repeat invocation. Complete one synthetic component in a fixture with independently authored assertions to verify exports, stylesheet ordering, adapters, and scenario ownership. Never publish that synthetic component.

Development checks remain coverage-free. After all implementation, tests, cleanup, and review, run both full coverage gates and required lint/type/build/SSR/package checks. Shared build/export/browser setup changes require full browser verification under current policy. Structural tooling tests must not launch coverage as part of scaffold creation.

The recipe supplies a brief evaluation record for the next separately requested real component: setup time, manual registration corrections, development verification time, final verification time, and remaining authored work. This change can finish after tooling verification; it does not invent a new product component or claim a measured speedup before that later usage.

## Risks / Trade-offs

- Inventory becomes another source of drift → validate against actual files and static declarations, retain independent consumers, and report disagreements precisely.
- Source rewriting damages unrelated work → bounded transformations, full preflight, content rechecks, and no overwrite mode.
- A scaffold looks finished → explicit markers and missing-work reports, no generated fake passing tests, and documented structural-check limits.
- Historical test refactoring loses guarantees → frozen inputs plus negative compatibility fixtures before removing name-based exceptions.
- Generator maintenance exceeds savings → single-root V1, no universal template engine, and measured next-component evaluation before expansion.
- Shared registration still triggers complete tests → accept the existing fallback; improving selection is a separate change.

## Migration Plan

1. Establish passing affected registration/compatibility checks without coverage; record current exports and stylesheet order as review evidence.
2. Consolidate inventory and update structural/historical checks without changing published output.
3. Add scaffold/check commands and isolated fixture verification.
4. Publish the recipe and link it from the existing skill; run final verification under unchanged policy.
5. Evaluate the next separately requested component before expanding automation.

Rollback removes the commands and recipe links and restores the previous build/registration mechanisms. Generated component source remains ordinary editable source; it has no runtime dependency on the scaffold. Keep rollback scoped to this change and preserve any subsequently authored components.
