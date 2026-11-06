---
name: tdd
description: Develop new behavior or fix a bug in small red-green-refactor cycles, using tests that exercise the public behavior and recording the observed results.
---

# Test-driven development

Use this workflow for new behavior and bug fixes, including work done through another skill or delegated to an agent. Planning-only OpenSpec work, documentation edits, and formatting-only changes do not require behavior tests.

## Red, green, refactor

1. **Red.** Write one focused test for observable behavior through the normal entry point. For a bug fix, reproduce the bug. Follow the testing guidelines at `.agents/guidelines/testing-guidelines.md` (relative to the project root), when installed. For filesystem behavior, use a temporary repository and check effects a user can observe, such as an exit status, preserved file contents, or the result of rerunning a command.
2. **Confirm the failure.** Run the test before changing production code. Verify that it fails because the behavior is missing or incorrect. Fix any syntax, import, fixture, or environment error before treating the result as red.
3. **Green.** Make the smallest production change needed to pass and rerun the same test. Preserve the strength of existing coverage. Keep assertions intact and use test doubles at dependency boundaries when needed. Check related behavior when the change touches a shared path.
4. **Refactor while green.** Clean up within scope when it reduces a concrete maintenance cost. Follow the code quality guideline at `.agents/guidelines/code-quality.md` (relative to the project root), when installed. Rerun the relevant tests after cleanup, then repeat the cycle for the next behavior. Run the repository lint and type checks for implementation changes.

For a behavior-preserving refactor, establish passing public-behavior coverage before editing and use the TypeScript refactoring skill if installed. Handle routine cleanup inline. When authorized delegation adds value, give the delegate the tested baseline, owned scope, and behavior to preserve. The parent reviews the integrated changes and reruns relevant checks.

## Report what you observed

Name the test you saw fail and explain why it failed. State which tests and checks passed afterward and call out any skipped checks, blockers, or process exceptions. If you could not observe a meaningful failure before the fix, report the verification gap. A green suite or a test added after implementation only shows the final behavior.
