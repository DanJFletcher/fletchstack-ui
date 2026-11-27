import { resolve, relative } from 'node:path';
import { realpath } from 'node:fs/promises';
import { createVitest } from 'vitest/node';

/**
 * Discover specifications without executing test modules, hooks or browser fixtures.
 **/
export async function openVitest({ project, root, changes }, create = createVitest) {
  root = await realpath(root);
  const ctx = await create('test', {
    root,
    project: [project],
    watch: false,
    run: true,
    coverage: { enabled: false },
  });
  try {
    const specs = await ctx.globTestSpecifications();
    const inventory = specs.map((spec) => relative(root, spec.moduleId));
    const owners = await discoverOwners(ctx, { root, changes, inventory });
    return {
      inventory,
      owners,
      run: (files) => runSelected(ctx, { specs, files, root }),
      close: () => ctx.close(),
    };
  } catch (error) {
    await ctx.close();
    throw error;
  }
}

/**
 * Ask Vitest for each path's import owners, retaining directly changed test files.
 **/
async function discoverOwners(ctx, { root, changes, inventory }) {
  const owners = new Map();
  for (const { path, status } of changes) {
    ctx.config.related = /^[DRC]/.test(status) ? [] : [resolve(root, path)];
    const specs = await ctx.getRelevantTestSpecifications();
    const files = specs.map((spec) => relative(root, spec.moduleId));
    if (inventory.includes(path)) {
      files.push(path);
    }
    owners.set(path, [...new Set(files)].sort());
  }
  return owners;
}

/**
 * Run exact specifications and preserve cancellation, setup failures and failed assertions.
 **/
export async function runSelected(ctx, { specs, files, root }, signals = process) {
  const interruption = watchSignals(ctx, signals);
  try {
    const selected = specs.filter((spec) => files.includes(relative(root, spec.moduleId)));
    if (!selected.length) {
      throw new Error('Refusing execution without selected specifications');
    }
    await ctx.standalone();
    const result = await ctx.runTestSpecifications(selected);
    return interruption.status() || executionStatus(result, selected.length);
  } finally {
    interruption.close();
  }
}

/**
 * Cancel active workers on interruption and provide listener cleanup to the owner.
 **/
function watchSignals(ctx, signals) {
  let status = 0;
  const handlers = [130, 143].map((code) => () => {
    status = code;
    void ctx.cancelCurrentRun('keyboard-input');
  });
  signals.once('SIGINT', handlers[0]);
  signals.once('SIGTERM', handlers[1]);
  return {
    status: () => status,
    close: () => {
      signals.removeListener('SIGINT', handlers[0]);
      signals.removeListener('SIGTERM', handlers[1]);
    },
  };
}

/**
 * Require a completed module result for every selected file and no unhandled errors.
 **/
function executionStatus(result, count) {
  const completed =
    result.testModules.length === count &&
    result.testModules.every((module) => ['passed', 'skipped'].includes(module.state()));
  return completed && !result.unhandledErrors.length ? 0 : 1;
}
