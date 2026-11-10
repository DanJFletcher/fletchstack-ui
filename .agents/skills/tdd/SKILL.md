---
name: tdd
description: Develop new behavior or fix a bug in small red-green-refactor cycles, using tests that exercise the public behavior and recording the observed results.
---

# Test-driven development

Use this workflow for new behavior and bug fixes, including work done through another skill or delegated to an agent. Planning-only OpenSpec work, documentation edits, and formatting-only changes do not require behavior tests.

## Red, green, refactor

1. **Red.** Write one focused test for observable behavior through the normal entry point. For a bug fix, reproduce the bug. Follow the testing guidelines at `.agents/guidelines/testing-guidelines.md` (relative to the project root), when installed. For filesystem behavior, use a temporary repository and check effects a user can observe, such as an exit status, preserved file contents, or the result of rerunning a command.
2. **Confirm the failure.** Run that explicit test file without coverage before changing production code, including for a newly created test. Verify that it fails because the behavior is missing or incorrect. Fix syntax, import, fixture, or environment errors before treating the result as red.
3. **Green.** Make the smallest production change needed to pass and rerun the same test. Preserve assertions and existing coverage requirements. Use affected unit/integration runs for related feedback as the implementation evolves.
4. **Refactor while green.** Clean up within scope when it reduces a concrete maintenance cost. Follow the code quality guideline at `.agents/guidelines/code-quality.md` (relative to the project root), when installed. Rerun affected tests after cleanup, then repeat the cycle for the next behavior. Keep lint and type feedback relevant to the edits.

## Repository test execution

During red/green, select the explicit test rather than running the complete suite:

```sh
npx --no-install vitest run --project unit src/components/button/__tests__/Button.test.tsx --coverage.enabled=false
```

During green/refactor, use `npm run test:unit:affected -- --base <git-ref>` and `npm run test:integration:affected -- --base <git-ref>`. Choose the branch comparison base explicitly; it must cover the work being developed. Commands include branch, staged, unstaged and untracked changes. Inspect their explanations; a safe full-project fallback is required when impact is uncertain. An empty result is not evidence that an explicitly added red test ran. If these commands are not yet available, use explicit focused Vitest files without coverage while bootstrapping them. See [the test guide](../../../tests/README.md#affected-unit-and-integration-feedback) for classification and import boundaries.

After implementation is complete, run the repository's required full verification, including the independent full unit/integration coverage gates and existing Storybook, E2E, build and package checks. Do not use affected feedback as the completion gate. If full verification fails, repair with focused tests and repeat required full verification on the final state before declaring completion. Targeted browser evidence required during component work remains supported; these affected commands select only unit/integration tests.

For a behavior-preserving refactor, establish passing public-behavior coverage before editing and use the TypeScript refactoring skill if installed. Handle routine cleanup inline. When authorized delegation adds value, give the delegate the tested baseline, owned scope, and behavior to preserve. The parent reviews the integrated changes and reruns relevant checks.

## Report what you observed

Name the test you saw fail and explain why it failed. State which tests and checks passed afterward and call out any skipped checks, blockers, or process exceptions. If you could not observe a meaningful failure before the fix, report the verification gap. A green suite or a test added after implementation only shows the final behavior.
