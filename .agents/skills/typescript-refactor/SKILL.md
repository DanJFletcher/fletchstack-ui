---
name: typescript-refactor
description: Review TypeScript for concrete maintenance costs or make a bounded refactor that preserves behavior after establishing a passing test baseline.
---

# TypeScript refactoring

Read the project's instructions and the code quality guideline at `.agents/guidelines/code-quality.md` (relative to the project root), when installed. Use the [TypeScript field guide](references/typescript-field-guide.md) when evaluating extraction, shared policy, parameter objects, type assertions, flags, discriminated unions, or strategies.

## Choose a mode

- **Review.** Stay read-only. Trace public callers, relevant tests, and where the affected policy lives. For each finding, give the location, affected callers, concrete maintenance cost, a proportionate change, and the behavior to preserve. Rank findings by impact and confidence. Call out similar code that should stay separate when that distinction matters.
- **Edit.** Keep the change within the agreed scope. Establish passing tests for the affected public behavior before editing, without code coverage collection. If behavior is untested, add relevant characterization checks; if the baseline fails, report and resolve the gap before making the refactor. No artificial failing behavior is required.
- **After a green implementation.** Consider whether a small cleanup would reduce a concrete maintenance cost. Handle routine cleanup inline. A read-only second opinion or a bounded delegated edit can help when independent review adds value. Leave the code alone when no useful cleanup is apparent.

Follow the shared [execution policy](../../guidelines/testing-guidelines.md#repository-test-execution): baseline and refactoring feedback stay coverage-free, and both full coverage gates run only at final verification of the agreed implementation scope. A cleanup step or intermediate commit is not its own coverage gate.

## Make and verify a refactor

1. Record the pre-edit test command and result. Check that the tests exercise the public outcomes the edit could affect.
2. Make one small change at a time. Preserve accepted inputs, outputs, side effects, and which error takes precedence. For command-line tools, check relevant exit statuses, output, and file effects in a temporary project. For intentional behavior changes, choose test cadence and evidence under the shared [development policy](../../guidelines/testing-guidelines.md#development-policy).
3. Rerun the focused tests and relevant lint and type checks. Review the diff from its callers for clarity, naming, and scope. Report what changed, the before and after check results, and any gaps.

## Delegate selectively

When delegation is authorized and useful, give the delegate the mode, exact tested revision or workspace state, observed baseline command and result, owned files, behavior to preserve, and required verification. Keep edit scopes disjoint. If the delegate cannot reproduce the baseline, it should report the mismatch before editing. The parent reviews the integrated diff and reruns the relevant checks.
