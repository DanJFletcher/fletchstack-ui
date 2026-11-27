import { parseOptions } from './affected-options.mjs';
import { discoverChanges } from './affected-git.mjs';
import { selectTests } from './affected-policy.mjs';
import { openVitest } from './affected-vitest.mjs';

/**
 * Show deterministic selection evidence without claiming full coverage or verification.
 **/
export function formatSelection(options, info, selection) {
  const lines = [
    `Affected ${options.project}: ${selection.mode} (coverage-free development feedback)`,
    `Base: ${info.base}; resolved: ${info.resolvedBase}; HEAD: ${info.head}; merge-base: ${info.mergeBase}`,
    ...selection.reasons.map(
      (item) => `${item.status} ${JSON.stringify(item.path)}: ${item.reason}`,
    ),
    ...selection.files.map((file) => `  ${file}`),
  ];
  if (selection.fallback) {
    lines.push(selection.fallback);
  }
  return lines.join('\n');
}

/**
 * Apply Git and resource policy, then execute or explain the requested project's tests.
 **/
export async function affectedRun(
  argv,
  { cwd = process.cwd(), write = console.log, discover = discoverChanges, open = openVitest } = {},
) {
  const options = parseOptions(argv);
  const info = discover(options.base, cwd);
  const runner = await open({ project: options.project, root: info.root, changes: info.changes });
  try {
    const selection = selectTests({ ...info, ...runner, project: options.project });
    write(formatSelection(options, info, selection));
    return options.dryRun || !selection.files.length ? 0 : await runner.run(selection.files);
  } finally {
    await runner.close();
  }
}

/**
 * Translate invocation errors to an actionable nonzero command status.
 **/
export async function affectedMain(argv, run = affectedRun) {
  try {
    return await run(argv);
  } catch (error) {
    console.error(`Affected tests failed: ${error.message}`);
    return 1;
  }
}
