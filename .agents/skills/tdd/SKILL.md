---
name: tdd
description: Practice incremental red-green-refactor when explicitly requested or deliberately selected under the testing policy. Do not activate merely because behavior changes or tests are needed.
---

# Test-driven development

Use this workflow when the user explicitly requests incremental TDD or you deliberately select it for the task under the [development policy](../../guidelines/testing-guidelines.md#development-policy). Its presence does not require other skills or delegated work to adopt it. Batched test-first and implementation followed by tests remain supported by that policy. Planning-only OpenSpec work, documentation edits, and formatting-only changes do not require behavior tests.

## Red, green, refactor

1. **Red.** Write one focused test for observable behavior through the normal entry point. For a bug fix, reproduce the bug. Follow the [testing guidelines](../../guidelines/testing-guidelines.md) for contract-grounded expectations and test-layer boundaries. For filesystem behavior, use a temporary repository and check effects a user can observe, such as an exit status, preserved file contents, or the result of rerunning a command.
2. **Confirm the failure.** Run that explicit test file without coverage before changing production code, including for a newly created test. Verify that it fails because the behavior is missing or incorrect. Fix syntax, import, fixture, or environment errors before treating the result as red.
3. **Green.** Make the smallest production change needed to pass and rerun the same test. Preserve the behavioral contract and existing coverage requirements; correct a demonstrably wrong assertion against the contract rather than weakening it solely to pass. Use affected unit/integration runs for related feedback as the implementation evolves.
4. **Refactor while green.** Clean up within scope when it reduces a concrete maintenance cost. Follow the code quality guideline at `.agents/guidelines/code-quality.md` (relative to the project root), when installed. Rerun affected tests after cleanup, then repeat the cycle for the next behavior. Keep lint and type feedback relevant to the edits.

## Repository test execution

Follow the shared [execution policy](../../guidelines/testing-guidelines.md#repository-test-execution); these red/green instructions apply to the selected incremental TDD workflow.

During red/green, select the explicit test rather than running the complete suite:

```sh
npx --no-install vitest run --project unit src/components/button/__tests__/Button.test.tsx --coverage.enabled=false
```

During green/refactor, use `npm run test:unit:affected -- --base <git-ref>` and `npm run test:integration:affected -- --base <git-ref>`. Choose the branch comparison base explicitly; it must cover the work being developed. Commands include branch, staged, unstaged and untracked changes. Inspect their explanations; a safe full-project fallback is required when impact is uncertain. An empty result is not evidence that an explicitly added red test ran. If these commands are not yet available, use explicit focused Vitest files without coverage while bootstrapping them. See [the test guide](../../../tests/README.md#affected-unit-and-integration-feedback) for classification and import boundaries.

Keep every red/green/refactor iteration coverage-free, including full affected fallbacks. At the shared policy’s final-verification boundary for the whole agreed scope, run `npm run test:unit:coverage` and `npm run test:integration:coverage` without filters, plus required lint, type, build and package checks. Task checkboxes and intermediate commits do not trigger coverage. Follow the shared browser execution policy: all Storybook render/play/accessibility checks plus affected E2E including composed consumers, with complete local browser execution for shared or uncertain impact. Repair final failures using coverage-free focused regression checks, then rerun failed or invalidated final gates under the shared execution policy; failure alone does not require repeating unrelated local E2E. Required CI remains complete. Report selected scope and pending CI accurately. The unit/integration affected commands remain development feedback; browser affected selection has its own command and conservative ownership rules in the [test guide](../../../tests/README.md#local-browser-completion).

For a behavior-preserving refactor, establish passing tests of public behavior without code coverage collection before editing and use the TypeScript refactoring skill if installed. Handle routine cleanup inline. When authorized delegation adds value, give the delegate the tested baseline, owned scope, and behavior to preserve. The parent reviews the integrated changes and reruns relevant checks.

## Report what you observed

For this selected workflow, name the test you saw fail and explain why it failed. State which tests and checks passed afterward and call out any skipped checks, blockers, or process exceptions. If you could not observe a meaningful failure before implementation, report that gap. Follow the shared [evidence policy](../../guidelines/testing-guidelines.md#development-policy): final passing tests establish final behavior but do not establish a pre-implementation failure.
