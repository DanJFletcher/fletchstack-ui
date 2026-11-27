import * as fs from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { registrationPaths } from './component-plan.mjs';

/**
 * Reject traversal and symlinks in a target or its ancestors, including dangling links.
 **/
export function safeTarget(root, path) {
  const target = resolve(root, path);
  const local = relative(root, target);
  if (!local || local.startsWith('..') || isAbsolute(local)) {
    throw new Error(`Unsafe destination: ${path}`);
  }
  let current = target;
  while (current !== root) {
    try {
      if (fs.lstatSync(current).isSymbolicLink()) {
        throw new Error(`Symlink destination: ${path}`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
    current = dirname(current);
  }
  return target;
}

/**
 * Walk relevant authored text only, refusing to follow directory symlinks.
 **/
function collectFiles(root, directory, files) {
  if (!fs.existsSync(join(root, directory))) {
    return;
  }
  for (const entry of fs.readdirSync(join(root, directory), { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) {
      collectFiles(root, path, files);
    } else if (entry.isFile() && /\.(?:tsx?|css|json|md)$/.test(path)) {
      files[path] = fs.readFileSync(join(root, path), 'utf8');
    }
  }
}

/**
 * Read the project inputs and authored files without generating outputs or caches.
 **/
export function readComponentProject(directory) {
  const root = fs.realpathSync(directory);
  const files = {};
  for (const path of registrationPaths) {
    files[path] = fs.readFileSync(safeTarget(root, path), 'utf8');
  }
  for (const directory of [
    'src',
    '.storybook',
    'docs',
    'tests/browser-harness',
    'tests/integration/components',
  ]) {
    collectFiles(root, directory, files);
  }
  return { root, files };
}

/**
 * Confirm that a reviewed plan is still applicable before the first write.
 **/
export function validatePlan(root, plan) {
  for (const change of plan.changes) {
    const target = safeTarget(root, change.path);
    const actual = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
    if (actual !== change.before) {
      throw new Error(`File changed since planning: ${change.path}`);
    }
  }
}

/**
 * Apply precomputed contents and report partial filesystem failures without resetting user work.
 **/
export function applyComponentPlan(root, plan) {
  validatePlan(root, plan);
  const changed = [];
  try {
    for (const change of plan.changes) {
      const target = safeTarget(root, change.path);
      fs.mkdirSync(dirname(target), { recursive: true });
      fs.writeFileSync(target, change.after, { flag: change.before === null ? 'wx' : 'w' });
      changed.push(change.path);
    }
  } catch (error) {
    throw new Error(`${error.message}\nFiles already changed: ${changed.join(', ') || '(none)'}`, {
      cause: error,
    });
  }
  return changed;
}
