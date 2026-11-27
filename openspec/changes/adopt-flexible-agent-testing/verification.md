# Guidance verification

## Specification reconciliation

- `npx --no-install openspec validate add-affected-unit-integration-tests --strict`: passed.
- `npx --no-install openspec validate adopt-flexible-agent-testing --strict`: passed.
- Reviewed both pending workflow requirements together: [affected testing](../add-affected-unit-integration-tests/specs/affected-unit-integration-testing/spec.md#requirement-development-and-completion-workflow) now conditions red/green on selected incremental TDD; [agent testing](specs/agent-testing-workflow/spec.md) permits three cadences with the same completion gates. They introduce separate capabilities with compatible requirements, so neither archive order restores unconditional TDD. No archive or sync was performed.
- The prior proposal and design carry explicit follow-up notes. Its completed tasks, original scenarios, and recorded evidence were preserved.

## Integrated instruction review

Reviewed the shared policy, skill activation descriptions and closing checks, component guidance, and test-guide examples together. The following are manual instruction walkthroughs, not executed product tests or agent experiments.

| Situation                          | Review result                                                                                                                                                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Routine component tested afterward | Component, React, and Playwright entry points defer to shared cadence selection. API/accessibility planning precedes implementation; contract-based tests may follow it. Storybook, browser, accessibility, and final verification obligations remain. |
| Batched rule examples              | Shared policy permits related contract examples together before implementation; none of the dependent skills forces one red/green cycle per example. Unit authoring rules remain confined to unit tests.                                               |
| Explicit incremental TDD           | Selected TDD requires running the explicit test before production changes, observing the intended behavioral failure, and rerunning the same test for green. Setup errors do not count as red.                                                         |
| Reproducible bug                   | A disabled control incorrectly invoking its callback calls for a focused pre-fix failing regression where feasible, followed by passing verification after repair.                                                                                     |
| Bug with unavailable environment   | Report the concrete unavailable dependency or environment, perform available verification, and identify missing reproduction evidence. A later pass cannot be reported as an observed pre-fix failure.                                                 |
| Behavior-preserving refactor       | Missing relevant coverage calls for characterization checks and a passing baseline before edits; rerun checks afterward. No synthetic failure or mandatory delegated review is introduced.                                                             |
| Wrong expected outcome             | A zero-clamping discount contract requires `0` for `applyDiscount(10, 15)` even if current output is `-5`. Correct a mistaken assertion against the contract; do not copy the faulty output.                                                           |
| Vacuous assertion                  | A deletion test that only asserts absence without establishing initial presence needs relevant preconditions and a focused probe or equivalent concrete evidence. Restore temporary perturbations before final checks.                                 |
| Failed final verification          | Focused and affected passes cannot establish completion. Repair with focused feedback, then repeat required full verification on the final state.                                                                                                      |

- Live-guidance search found no unconditional TDD referrals or blanket requirement that every test be observed failing. Strict red/green instructions remain conditional on selected TDD.
- All five modified skills passed the skill-creator `quick_validate.py` check; their frontmatter names match their directories.
- Local Markdown audit passed for 16 changed/planning files and 143 relative links, including heading anchors. External URLs were not revalidated in this implementation check.
- These checks establish instruction consistency only. Agent adherence, comparative runtime, and code-quality outcomes were not measured.

## Final scope review

- `git diff --check` passed. The tracked diff is limited to eight live guidance files and the three explicitly reconciled pending OpenSpec artifacts; the six new files belong to this change's planning and verification record.
- Production code, existing tests, test scripts, CI gates, coverage thresholds, package dependencies, installer fingerprints, and the earlier change's completed tasks are unchanged. No external source files were edited.
- Cadence selection is centralized in a short development-policy section; dependent skills link to it. Detailed research rationale remains in planning, with no mandatory justification report or additional approval for routine cadence choices.
- Production suites were not run for this prose-only change. Validation covered OpenSpec structure, skill metadata, local links, instruction consistency, and diff scope; it does not demonstrate runtime savings or improved generated code quality.
