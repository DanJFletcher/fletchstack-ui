# Design

## Follow-up: coverage timing (2026-11-11)

[Defer coverage to final verification](../archive/2026-11-11-defer-coverage-to-final-verification/proposal.md) supersedes the original coverage-command defaults and blanket full-verification rerun wording. Ordinary unit/integration commands now disable coverage; explicit `:coverage` commands preserve independent final/CI gates. Development and repair feedback remain coverage-free, with failed or invalidated gates rerun at final readiness. The affected pending requirements were reconciled narrowly; original design rationale, completed tasks and historical execution evidence below remain records of the earlier implementation.

## Context

See [the proposal](proposal.md) for motivation and [the workflow specification](specs/agent-testing-workflow/spec.md) for the behavioral contract. This design is needed because policy activation, evidence rules, and execution guidance span several files.

The current [TDD skill](../../../.agents/skills/tdd/SKILL.md) activates for all new behavior and bug fixes. Four other skills route agents into it. The [unit-test checklist](../../../.agents/guidelines/testing-guidelines.md) independently requires every test to have been observed failing. Editing one activation sentence would therefore leave contradictory requirements.

The repository already provides affected unit/integration commands and separate complete verification gates. These mechanisms are independent of test order. The [affected-test change](../add-affected-unit-integration-tests/) is complete but unarchived; the accepted spec inventory is empty. [agi.json](../../../agi.json) records these guidance files as installer-managed outputs.

## Goals / Non-Goals

**Goals:** Keep one cadence-selection policy, consistent skill entry points, and proportionate evidence requirements. Make the policy executable through examples without adding a mandatory planning or reporting stage.

**Non-Goals:** Determine a universally optimal workflow, claim a measured speedup, mandate implementation-first, require multi-agent testing, change test frameworks or coverage thresholds, or update the external agent-guides source. Existing test-style rules unrelated to cadence are outside this change.

## Decisions

### 1. Centralize policy and retain TDD as a named option

Expand the purpose of [testing guidelines](../../../.agents/guidelines/testing-guidelines.md) to distinguish repository development policy from the existing unit-test authoring rules. Place a short cadence-selection section before the unit-specific rules; retain the unit scope of Arrange/Act/Assert, mocks, and assertion conventions. Browser journeys must not inherit single-call unit restrictions.

Keep the `tdd` name, directory, and strict workflow. Narrow both its frontmatter description and opening instructions to explicit requests or deliberate selection under the shared policy. Other skills reference that policy, not unconditional TDD activation. Avoid requiring a written workflow justification for every task.

Alternatives: deleting TDD loses a useful explicit workflow; renaming it into a general testing skill changes discoverability and installer selection unnecessarily; duplicating the policy in each skill invites drift.

### 2. Separate expected behavior from test order

Use existing specs, component contracts, and short task-local checklists to identify behavior before implementation. New feature work may use any of the three cadences. Precise algorithmic rules can benefit from examples or a batch of tests first; a routine component addition can be implemented in a coherent increment and tested afterward.

Determine expected values from the contract. Reading code, callers, and existing tests remains useful for discovering boundaries. A separate agent or fresh context is optional only when authorized and useful; neither guarantees independent reasoning. Correct demonstrably wrong tests against the contract rather than making tests immutable.

Alternative: mandatory isolated testing would add cost and deprive tests of useful integration context without established universal benefit.

### 3. Preserve specific evidence obligations without manufacturing red

Bug fixes retain a meaningful pre-fix reproduction where feasible and verification after the fix. An environment or reproduction limitation must be concrete and reported. Refactors retain passing relevant behavior coverage before editing; missing coverage calls for characterization tests, not artificial failures.

Replace the blanket final checklist item requiring every test to have failed. Tests added after implementation can establish final behavior. Use a reversible failure probe when there is a concrete concern that an assertion passes vacuously or misses the intended defect; do not introduce blanket mutation testing. Preserve strict red/green evidence when incremental TDD was actually selected.

Update the React testing skill's closing detection instruction as well as its initial TDD referral so it does not recreate an unconditional failure-proof requirement. Existing Playwright distinctions between generated tests, executed checks, and observed regressions remain useful.

Alternative: removing failure-evidence guidance entirely would weaken bug-fix confidence and conceal ineffective assertions.

### 4. Keep execution and completion safeguards independent of cadence

The common sequence is contract understanding, coherent development with focused feedback, then required complete verification. The development phase can contain strict TDD, batched tests, or tests after implementation. Use explicit files for known/new tests and affected commands for related feedback with a declared comparison base and existing conservative fallbacks. Required full verification and independent unit/integration coverage gates remain unchanged; repair failures with focused checks and repeat complete verification on the final state.

Review touched code for clarity, responsibilities, and concrete maintenance costs after implementation. Reuse existing code-quality and refactoring guidance; inline review suffices for routine work and no cleanup is required when there is no useful improvement.

Alternative: coupling affected execution to red/green vocabulary unnecessarily excludes other cadences. Lowering final gates would confound this policy change with a separate assurance reduction.

### 5. Apply a bounded coordinated edit

| Target                                                                                                              | Implementation responsibility                                                                             |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [Testing guidelines](../../../.agents/guidelines/testing-guidelines.md)                                             | Authoritative cadence, intent, evidence, and reporting policy; qualify unit-only rules.                   |
| [TDD skill](../../../.agents/skills/tdd/SKILL.md)                                                                   | Narrow discovery and activation; retain the selected strict workflow and link to shared execution policy. |
| [Component-building skill](../../../.agents/skills/build-react-components/SKILL.md)                                 | Retain contract-first API/accessibility planning and replace automatic TDD referral.                      |
| [React Testing Library skill](../../../.agents/skills/react-testing-library/SKILL.md)                               | Replace initial referral and qualify closing failure-evidence instruction.                                |
| [Playwright skill](../../../.agents/skills/playwright-e2e/SKILL.md)                                                 | Select cadence through shared policy; preserve meaningful browser journeys and diagnostic evidence.       |
| [Refactoring skill](../../../.agents/skills/typescript-refactor/SKILL.md)                                           | Preserve baseline/refactor discipline; route intentional behavior changes to shared policy.               |
| [Component guidelines](../../../.agents/guidelines/component-library.md) and [test guide](../../../tests/README.md) | Use cadence-neutral execution language and examples of both selected TDD and test-after.                  |

Treat these as local customizations. Do not rewrite installer hashes to disguise them as upstream content, reinstall the package, or edit its tarball. Record this maintenance boundary in the test guide. General policy can be upstreamed later under separate authorization.

### 6. Reconcile pending specifications explicitly

During implementation, update only the `Development and completion workflow` requirement in the pending [affected-test delta](../add-affected-unit-integration-tests/specs/affected-unit-integration-testing/spec.md): scope specific red/green ordering to cases where incremental TDD is selected and reference the new cadence policy. Preserve its existing scenarios, completion requirement, and all selection/coverage requirements.

Add a dated follow-up note linking this change in that change's [proposal](../add-affected-unit-integration-tests/proposal.md) and [design](../add-affected-unit-integration-tests/design.md), identifying which original universal-TDD wording is superseded. Preserve completed task checkboxes and original observed evidence; these describe work actually performed. Archive/sync is not part of this implementation. Reconcile the pending delta before any future archive so either archive order retains compatible requirements.

If the affected capability has already been synced or archived before implementation, stop that pending-artifact edit and rebase this change's planning onto the accepted requirement using a proper MODIFIED delta. Do not silently edit accepted specs or recreate an archived change.

Alternative: rewriting old completed tasks would misrepresent history; ignoring the pending delta risks restoring a conflicting rule during archive.

### 7. Validate guidance with concrete walkthroughs

Use a bounded instruction review rather than production tests invented for Markdown edits. Trace six situations across all updated entry points: routine component tested afterward, batched rule examples, explicit strict TDD, reproducible bug, bug with unavailable environment, and a behavior-preserving refactor. Add negative checks for a test copying an erroneous output, an assertion that can pass vacuously, and final verification failure.

Confirm the intended cadence and evidence obligations are consistent, check relative links/frontmatter, and search live guidance for unconditional referrals and every-test-must-fail requirements. Review the diff to ensure scripts, CI, coverage configuration, production code, and existing tests are untouched. Run strict OpenSpec validation for both affected changes after reconciliation. Documentation walkthroughs establish policy consistency, not agent compliance or measured productivity; a multi-run workflow benchmark is separate work.

## Evidence informing the policy

- [Survey of test-driven approaches](https://arxiv.org/abs/2609.12012): distinguishes test order, validity, execution feedback, and evaluation independence; it does not establish a universal cadence winner.
- [Böckeler's exploratory experiment](https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html): no clear strict-TDD quality advantage in a small study, with limited tasks and model-based judgments.
- [Risk of coding before testing](https://arxiv.org/abs/2607.05139): faulty implementations can bias subsequently generated expectations; supports attention to expectation provenance rather than a mandatory micro-cycle.
- [Google's contract study](https://arxiv.org/abs/2608.17177): explicit contract reasoning improved test generation in its setting while using existing implementation context.

These findings motivate an engineering policy choice. They do not prove the proposed workflow is universally faster or better. Keep detailed research rationale here rather than repeating it in frequently loaded skills.

## Risks / Trade-offs

- Flexibility is interpreted as optional testing -> Preserve mandatory applicable verification, regression reproduction, and explicit gap reporting.
- An indirect referral restores universal TDD -> Audit activation descriptions, opening instructions, closing checklists, and examples together.
- Implementation-derived assertions repeat a bug -> Ground expectations in contracts and review disagreements before changing assertions.
- Local guidance drifts from installer source -> Document local customization and keep manifest fingerprints intact.
- Old pending specs restore contradictory policy -> Reconcile their narrow workflow requirement and validate both changes before future archive.
- Additional policy prose becomes overhead -> Keep the operational policy concise, reuse existing contracts, and avoid mandatory extra agents or documents.

## Migration Plan

1. Update shared policy and the selected-TDD activation/evidence boundary together.
2. Update dependent skills, component guidance, and test-guide examples.
3. Reconcile the pending affected-test requirement and add explicit historical follow-up notes.
4. Complete the bounded walkthroughs, link/routing audit, and OpenSpec validation; report that no runtime performance claim was tested.

Rollback consists of reverting this change's guidance and reconciliation edits as a unit while preserving unrelated work. It requires no runtime or data migration.
