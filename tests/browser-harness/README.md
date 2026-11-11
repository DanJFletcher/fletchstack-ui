# Private browser scenarios

Run `npm run test:e2e:components -- button --workers=3` for the Vite harness only, or `npm run test:e2e:storybook -- button` for retained Storybook delivery checks. The harness uses port 6008; retained Storybook uses 6007. Both use fresh contexts, zero retries and retained failure evidence. Reports and test output have separate project directories.

## Authoring

Add a lazy family module to [scenarios/](scenarios/), importing implementation modules and required CSS directly. Export `component`, `defaults`, and `scenarios`. Each scenario has optional `args`, `render` and `theme`; it must remain synchronous React rendering. Keep browser actions in the Playwright test. Do not import CSF modules, the public component barrel or the all-component stylesheet. Shared tokens and base showcase CSS are loaded once by the gallery.

Register IDs, module paths, exports and suite ownership in [catalog.json](catalog.json). Use [openScenario](fixtures/scenario.ts); the mount fixture also rejects any existing ID not declared by the current suite. Unknown IDs, imports and render errors reject mount. Mount resolves after React commit; tests use observable locator assertions for later asynchronous state. Uncaught page errors fail fixture teardown. `update` preserves component state; explicit `unmount` disposes effects. Each new mount navigates to a fresh document using Playwright's installed gallery contract.

Do not enable context reuse. Tests get new contexts, with viewport/preferences/permissions explicitly set by each test. Document-level CSS, themes and clipboard replacements disappear on navigation; context settings persist within that test and are disposed with its context. Use test-owned I/O mocks only for unavailable/denied clipboard cases; the success cases exercise the real browser API. Failed scenarios must not leave shared state behind.

## Affected selection

`npm run test:e2e:affected -- --base HEAD --dry-run` emits a deterministic JSON plan and does not import tests, launch servers/browsers, generate tokens, bundle code, or write reports/caches. Remove `--dry-run` to execute those exact project/file pairs. Outcomes are `selected`, `safely-empty`, `full-fallback`, or a nonzero `error`. The comparison includes branch, staged, unstaged and untracked paths, and reports the resolved base, HEAD and merge base.

The selector follows local imports/re-exports, literal dynamic imports, CSS imports and literal local resource URLs from each declared scenario. Unsupported resources and missing/stale ownership broaden selection. Shared tokens, gallery/runner/fixture infrastructure, dependencies, public exports, renames/deletions and unproven changed paths trigger the complete inventory. A direct test edit selects that test; a new unmapped test triggers full fallback.

Legacy suites conservatively own **all authored files under `src/`, `stories/`, `.storybook/` and `tests/fixtures/`**. This is intentional: the preview imports every component stylesheet and stories use the public barrel, and documentation suites navigate across families. Thus a production component edit still selects all retained Storybook E2E, plus affected harness consumers. A harness-only scenario edit can be narrow. We make no export-level or CSS-cascade precision claim for Storybook. Additional migration needs its own measured decision.

Static inventory scans the two explicit `**/*.spec.ts` roots. The infrastructure tests compare it with real Playwright discovery. The catalog records SHA-256 fingerprints of both audited runner configurations: a mismatch is an actionable discovery error until their roots/patterns and actual `--list` inventory have been reviewed and the fingerprints updated. This prevents a changed config from adding undiscovered tests outside the static roots. Changes to an audited configuration or catalog within the branch still trigger full fallback. Malformed metadata/inventory is an error, never an empty pass. Keep runner discovery declarative; new configuration dependencies must be included in the inventory audit.

## Optional diagnostics

`npm run test:e2e:coverage` collects both projects into one diagnostic inventory. Use `-- --project=components --grep 'native clipboard'` to label a filtered measurement; this combined diagnostic configuration starts both servers even when its test selection is partial. It is separate from the focused ordinary commands above. The report lists selected suites/tests/projects, unvisited authored files and separate production, story-demo, preview and harness counters. Missing data or reporting errors fail. Ordinary runs never clean or write these reports. Production unit/integration coverage scopes and thresholds are unchanged.
