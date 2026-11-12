# Proposal

## Why

Adding a component currently requires agents to rediscover repository conventions and update repeated registration lists alongside the actual behavior. Avatar changed 36 files; its recorded final verification took about 2m49s of the reported 18 minutes, so this change targets authoring and integration effort without weakening verification or claiming an unmeasured speedup.

## What Changes

- Add a concise repository-specific component recipe with concern-specific references, a lightweight public/accessibility contract, integration locations, and existing verification commands.
- Introduce a minimal noninteractive scaffold with a side-effect-free dry run, collision protection, predictable file and registration setup, and explicit unfinished-work reporting.
- Establish shared React examples with separate Storybook and browser-harness adapters for new components; retain direct dependency ownership and existing Storybook boundaries.
- Consolidate repeated mechanical registration data, preserving stylesheet order, explicit public exports, package compatibility, and independent contract checks.
- Separate historical migration preservation checks from current component inventory checks so ordinary additions no longer need historical exceptions.
- Validate scaffolding on disposable fixtures and record a lightweight evaluation procedure for the next real component before extending automation.

## Capabilities

### New Capabilities

- `component-authoring`: Guided component creation, safe scaffolding, registration consistency, and explicit handoff from generated structure to authored behavior.

### Modified Capabilities

None. Existing browser-harness, affected-selection, local-verification, and coverage-execution requirements remain unchanged.

## Impact

- Agent-facing component skill and repository documentation; implementation scripts and package commands.
- Stylesheet distribution, Storybook registration, public exports, harness catalog registration, and their structural tests.
- Historical organization checks and package fixtures, preserving their independent compatibility guarantees.
- No new production component, public API change, dependency upgrade, blanket migration of existing examples, test-selection optimization, coverage-policy change, or general verification orchestrator is included.

Behavior, token choices, interaction semantics, meaningful tests, and visual/accessibility review remain authored work. Generated structure is not evidence of component completion.
