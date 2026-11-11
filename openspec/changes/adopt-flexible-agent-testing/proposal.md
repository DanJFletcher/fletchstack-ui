# Proposal

## Why

Repository guidance currently requires incremental red-green-refactor for nearly every behavior change through several overlapping skills and checklists. The research reviewed in this session supports meaningful testing and reliable feedback but does not establish universal superiority of strict TDD, so agents should be able to choose a proportionate development cadence while retaining explicit behavioral contracts and verification.

## What Changes

- Establish one shared testing policy: define intended behavior and important edge cases first, then select incremental TDD, batched test-first, or implementation followed by tests according to uncertainty and risk.
- Retain the TDD skill as an explicitly requested or deliberately selected workflow; narrow its activation description and remove automatic referrals from component, React Testing Library, Playwright, and refactoring skills.
- Preserve focused reproduction before bug fixes where feasible and a passing behavioral baseline before refactoring. Replace the blanket requirement to observe every test fail with proportionate failure evidence and honest reporting.
- Require expected outcomes to come from requirements and public contracts; permit implementation inspection to identify additional cases. Do not mandate separate testing agents, isolated contexts, extra planning documents, or synthetic failures for routine tests.
- Preserve focused/affected development feedback, conservative selection fallbacks, independent unit/integration coverage gates, and required complete verification. Keep design review distinct from test passing.
- Reconcile the completed, unarchived affected-test change's unconditional TDD wording and align the test guide with the new policy without rewriting completed implementation evidence.
- Limit implementation to tracked repository guidance and documentation. Updating the shared agent-guides source or installer package is a separate decision.

## Capabilities

### New Capabilities

- `agent-testing-workflow`: Selection of agent test cadence, behavioral expectations, regression/refactoring evidence, skill routing, and completion reporting.

### Modified Capabilities

None in the accepted inventory, which is currently empty. The pending [affected-unit-integration-testing delta](../add-affected-unit-integration-tests/specs/affected-unit-integration-testing/spec.md) already defines test execution and completion safeguards. This change makes its TDD-specific ordering conditional on choosing TDD; it does not create a second test-selection capability or change those safeguards.

## Impact

- [Testing guidelines](../../../.agents/guidelines/testing-guidelines.md), [component guidelines](../../../.agents/guidelines/component-library.md), and [test guide](../../../tests/README.md).
- The [TDD](../../../.agents/skills/tdd/SKILL.md), [component-building](../../../.agents/skills/build-react-components/SKILL.md), [React Testing Library](../../../.agents/skills/react-testing-library/SKILL.md), [Playwright](../../../.agents/skills/playwright-e2e/SKILL.md), and [TypeScript refactoring](../../../.agents/skills/typescript-refactor/SKILL.md) skills.
- Narrow reconciliation notes and workflow wording in the prior [affected-test change](../add-affected-unit-integration-tests/); completed tasks and recorded observations remain historical evidence.
- These are local customizations of installer-managed outputs recorded in [agi.json](../../../agi.json). No installer-manifest hash rewriting, dependency updates, production/API changes, test deletion, coverage reduction, or new CI gates are proposed.
