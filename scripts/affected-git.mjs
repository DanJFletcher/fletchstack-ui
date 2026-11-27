import { execFileSync } from 'node:child_process';

/**
 * Read Git output without shell interpolation or newline-delimited path assumptions.
 **/
export function gitOutput(args, cwd) {
  // eslint-disable-next-line sonarjs/no-os-command-from-path -- Use the developer's Git toolchain, with argument arrays and no shell.
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 32 * 1024 * 1024,
  });
}

/**
 * Resolve a revision, treating only Git's documented absent-result status as unavailable.
 **/
function optionalGit(args, cwd, git) {
  try {
    return git(args, cwd).trim();
  } catch (error) {
    if (error.status === 1) {
      return null;
    }
    throw error;
  }
}

/**
 * Decode name-status output, keeping both names of renames and copies.
 **/
export function parseChanges(output) {
  const fields = output.split('\0').filter(Boolean);
  const changes = [];
  while (fields.length) {
    const status = fields.shift();
    const count = /^[RC]/.test(status) ? 2 : 1;
    const paths = fields.splice(0, count);
    if (paths.length !== count) {
      throw new Error('Incomplete Git name-status output');
    }
    changes.push(...paths.map((path) => ({ path, status })));
  }
  return changes;
}

/**
 * Find repository identity and the usable branch comparison, without fetching history.
 **/
function comparison(base, cwd, git) {
  const root = git(['rev-parse', '--show-toplevel'], cwd).trim();
  const head = git(['rev-parse', '--verify', 'HEAD'], root).trim();
  const resolvedBase = optionalGit(
    ['rev-parse', '--verify', '--quiet', '--end-of-options', `${base}^{commit}`],
    root,
    git,
  );
  const mergeBase = resolvedBase && optionalGit(['merge-base', resolvedBase, head], root, git);
  return { root, head, base, resolvedBase, mergeBase };
}

/**
 * Union branch, index, worktree and untracked changes so cancelling edits stay visible.
 **/
export function discoverChanges(base, cwd, git = gitOutput) {
  const info = comparison(base, cwd, git);
  if (!info.mergeBase) {
    return {
      ...info,
      changes: [],
      fallback: 'Comparison history unavailable; complete project required',
    };
  }
  const diffs = [[info.mergeBase, info.head], ['--cached'], []];
  const changes = diffs.flatMap((range) =>
    parseChanges(git(['diff', '--name-status', '-z', '--find-renames', ...range], info.root)),
  );
  const untracked = git(['ls-files', '--others', '--exclude-standard', '-z'], info.root)
    .split('\0')
    .filter(Boolean);
  changes.push(...untracked.map((path) => ({ path, status: '?' })));
  const unique = new Map(changes.map((change) => [`${change.path}\0${change.status}`, change]));
  return {
    ...info,
    changes: [...unique.values()].sort(
      (a, b) => a.path.localeCompare(b.path) || a.status.localeCompare(b.status),
    ),
    fallback: null,
  };
}
