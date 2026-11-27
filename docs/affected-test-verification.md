# Affected unit and integration verification

Date: 2026-11-10. Change: `add-affected-unit-integration-tests`. Starting commit: `a944cd3`. Required complete CI and independent coverage gates remain unchanged.

## Boundaries and baseline

The [commands and policy](../tests/README.md#affected-unit-and-integration-feedback) use installed Vitest 4.1.12 discovery plus conservative resource rules. They select unit/integration only, require a Git base, include branch/staged/unstaged/untracked work, and disable coverage in selected and full-fallback modes. Dry runs do not execute test modules or hooks, launch browsers, or generate tokens. Missing history falls back; operational errors fail. There is no custom module/export graph or persistent selector cache.

Focused tests and fixture apps changed imports in 45 existing files. A comparison with the initial snapshots found no non-import body differences. Existing test names, assertions, environments and genuine composed dependencies remain. Dedicated public-export and composed-consumer tests were added; named-icon/catalog public contracts and packed consumers remain. Production components, exports, tokens, styles and CI definitions are unchanged.

The initial complete coverage-free runs passed 544 unit and 234 integration tests with three workers; JSON runner spans were approximately 8.00s and 17.07s. Those runs precede the new tooling/public-contract tests and are not identical workloads to the final suites.

| Changed implementation | Initial unit / 37 files | Final unit / 44 files | Initial integration / 43 files | Final integration / 47 files |
| ---------------------- | ----------------------: | --------------------: | -----------------------------: | ---------------------------: |
| Button                 |                      14 |                     8 |                             33 |                            7 |
| Field                  |                      15 |                     9 |                             31 |                            7 |

Field still selects Select, TextInput and Textarea. Button still reaches genuine Card/Icon/fixture compositions. Public-consumer and catalog contracts intentionally remain broad. A shared accessibility-hook probe selected 12 unit files.

## Bounded runtime comparison

Environment: macOS arm64, Node 22.23.4, Vitest 4.1.12, installed Chromium, three workers, coverage disabled, fixed Button implementation input. This quiet pair ran without concurrent verification commands. Both passes use the same final test inventory, including new public-contract suites. The before pass temporarily restored the original import-only snapshots; `finally` restored all current files before the after pass. Both passed.

| Project / imports                    | Selected files | Context/discovery | Execution |     Sum |
| ------------------------------------ | -------------: | ----------------: | --------: | ------: |
| Unit / original barrels              |             15 |            1.982s |    4.703s |  6.685s |
| Unit / focused direct imports        |              8 |            1.552s |    2.631s |  4.183s |
| Integration / original barrels       |             34 |            0.359s |   14.463s | 14.822s |
| Integration / focused direct imports |              7 |            0.178s |    4.993s |  5.172s |

Context/discovery includes Vitest context creation and graph discovery. Execution includes the selected run and reporting. The sum excludes Node/module-import startup, Git discovery and final context close. Disk caches were retained and before precedes after. This is one bounded pair, not a statistical guarantee or an estimate of complete CI savings. An earlier pair overlapped other checks and is retained only as scratch evidence. The 15/34 original-barrel counts include the new public-contract suites in both passes, explaining their difference from the initial 14/33 discovery counts.

Raw logs, JSON results, selection lists, scripts and timing data remain locally under ignored `.verification/affected/`; ordinary tests do not depend on them.

## Failure sensitivity

Observed red: the first parser test expected `{ project, base, dryRun }` but received an empty object. It passed after implementation. Installed-Vitest integration then exposed a real macOS `/var` versus `/private/var` owner mismatch; canonicalizing the runner root repaired that failing assertion. Its throwing module body also proves discovery does not execute tests.

Each disposable fault below was detected by an owning test verified to be in the computed selection, then restored in `finally`. Full-fallback probes execute the owning file as a bounded sensitivity check; complete final suites independently verify the restored state.

| Input            | Fault / safeguard             | Selection                                  | Result                               |
| ---------------- | ----------------------------- | ------------------------------------------ | ------------------------------------ |
| Public exports   | Remove Button export          | Dedicated unit and composed-consumer tests | Failed, restored                     |
| Button           | Default to submit             | 8 unit files                               | DOM owner failed, restored           |
| Field            | Break label target            | 9 unit files                               | Select owner failed, restored        |
| CSS              | Display hidden Buttons        | Full integration                           | Native hidden owner failed, restored |
| Shared token     | Change 16px primitive to 17px | Full unit                                  | Spatial contract failed, restored    |
| Hydration entry  | Target a missing root         | Full integration                           | Hydration setup failed, restored     |
| Shared hook      | Suppress error invalid state  | 12 unit files                              | Select owner failed, restored        |
| Edited test      | Append a deliberate failure   | One unit file                              | Failed, restored                     |
| Untracked test   | Add a deliberate failure      | New unit file                              | Failed, removed                      |
| Unknown resource | No classified owners          | Full integration                           | Did not claim empty success          |

Temporary Git repositories cover branch/local unions, cancelling edits, nonignored untracked files, spaces, overlapping rename/deletion, missing refs, unrelated histories and non-Git errors. Operational failures remain errors.

Actual CLI tests cover selected success, assertion/setup failures and coverage-disabled fallback. Dry runs produce deterministic output despite throwing test modules. Runner-boundary tests cover SIGINT/SIGTERM statuses, cleanup, missing module results and unhandled errors. Coverage sentinel bytes/mtime survive selected execution; fallback preserves the artifact as well. Cancellation uses Vitest's graceful API, which finishes active work; instantaneous process interruption is not promised.

The [TDD skill](../.agents/skills/tdd/SKILL.md), [testing guideline](../.agents/guidelines/testing-guidelines.md) and [component guidance](../.agents/guidelines/component-library.md) now distinguish explicit red/green, affected related feedback and full completion verification. The skill validator passed. Documentation walks through a new test and repair of a failure found during final verification. No global skill or external installer tarball changed.

## Complete verification

- Unit: 600 tests across 44 files passed. Integration: 283 tests across 47 files passed with three workers.
- Both retain independent 100% per-file statements, branches, functions and lines, including the new tooling under the unchanged coverage scope. Each reports aggregate 463/463 statements, 362/362 branches, 129/129 functions and 390/390 lines. No thresholds or excludes changed.
- Lint, both TypeScript configurations, library build and built-browser contrast/focus/320px/enlarged-text checks passed.
- Storybook: 286 tests across 25 files passed. Static Storybook build and packed exports/types/CSS/bundling/React 18.3.1 and 19.3.1 deterministic SSR passed.
- Full E2E: 346 tests passed with three workers (4.0 minutes). This is completion evidence, not an E2E performance comparison. Strict OpenSpec validation, whitespace checks and the TDD skill validator passed. Final unit verification and lint were repeated after a test-fixture cleanup and remained green. Remote CI was not dispatched.

## Limits

Shared changes intentionally select whole projects. Public-consumer tests remain broadly connected, and filesystem rules favor safety over precision. The installed Vitest public API needs discovery-contract verification on upgrades. Required complete CI remains unchanged. No E2E/Storybook selector, monorepo dependency or coverage-policy reduction was introduced.
