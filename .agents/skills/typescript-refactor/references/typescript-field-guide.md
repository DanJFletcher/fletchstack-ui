# TypeScript refactoring field guide

Use these patterns when they address a maintenance cost visible at the call sites. For each candidate, identify the behavior to preserve and how to verify it.

## Extract a check while preserving error precedence

Extract a check when callers enforce the same rule and could drift. Keep checks in their observable order. If a request has both an invalid selection and an unowned destination, for example, establish which error the CLI reports today before moving either check. Verify the same exit status, diagnostic, and file effects afterward.

## Put shared policy in one place

Merge duplicated decisions when callers are meant to enforce the same policy. Similar expressions can represent rules with different owners or reasons to change. For example, validating a catalog slug and validating a destination path both reject unsafe input, but they govern different inputs and protect different boundaries. Check success and rejection behavior at the affected callers.

## Group parameters that form a concept

Use a parameter object when the values travel together and a domain name makes the call easier to read. An artifact's kind and slug form an identity. A bag of unrelated options obscures what the callee depends on. Check the call sites for clearer names and verify that defaults and accepted inputs remain compatible.

## Use discriminated unions for closed variants

For a finite set such as CLI commands, an explicit discriminated union can keep variant-specific data and behavior together. Preserve exhaustiveness so a new variant prompts a compiler error where handling is missing. Consider a strategy when behavior is selected at runtime or variants have distinct policies and collaborators. Check that each variant retains its side effects and error behavior.

## Split flags when the modes have separate policies

Consider separate operations when a boolean selects substantially different workflows and the call site obscures which one runs. Keep a simple option when a named flag makes the intent clear. Verify both modes and the omitted-option default, including rejection behavior.

## Treat casts at input boundaries as compatibility decisions

Review assumptions at JSON, YAML, and persistence boundaries. A cast supplies a static type. Replacing it with validation can change which inputs are accepted, including files written by older versions. Characterize those inputs before editing and handle new rejection or migration behavior as a separately scoped change with tests.
