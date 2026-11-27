import { spawn } from 'node:child_process';
import { constants } from 'node:os';
import { resolve } from 'node:path';

const configs = { components: 'playwright.components.config.ts', chromium: 'playwright.config.ts' };

/**
 * Escape filenames because Playwright CLI file filters are regular expressions.
 **/
function exactFile(file) {
  return `${file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`;
}

/**
 * Run one project without shell interpolation, forwarding interruption and exit failure.
 **/
export async function runProject({ project, files, root, args = [] }, launch = spawn) {
  const cli = resolve(root, 'node_modules/@playwright/test/cli.js');
  const child = launch(
    process.execPath,
    [cli, 'test', '--config', configs[project], ...files.map(exactFile), ...args],
    { cwd: root, stdio: 'inherit' },
  );
  let interrupted;
  const interrupt = (signal) => {
    interrupted = signal;
    child.kill(signal);
  };
  const handlers = ['SIGINT', 'SIGTERM'].map((signal) => [signal, () => interrupt(signal)]);
  for (const [signal, handler] of handlers) {
    process.on(signal, handler);
  }
  try {
    const result = await new Promise((resolve, reject) => {
      child.once('error', reject);
      child.once('exit', (code, signal) => resolve({ code, signal }));
    });
    const signal = interrupted ?? result.signal;
    return {
      code: signal ? 128 + constants.signals[signal] : (result.code ?? 1),
      interrupted: Boolean(signal),
    };
  } finally {
    for (const [signal, handler] of handlers) {
      process.off(signal, handler);
    }
  }
}

/**
 * Execute every selected project and retain any failure; interruption stops subsequent work.
 **/
export async function executeSelection(selection, run = runProject, args = []) {
  let code = 0;
  for (const project of Object.keys(configs)) {
    const files = selection.suites
      .filter((suite) => suite.project === project)
      .map((suite) => suite.file);
    if (!files.length) {
      continue;
    }
    const result = await run({ project, files, root: selection.root, args });
    if (result.interrupted) {
      return result.code;
    }
    if (result.code) {
      code = result.code;
    }
  }
  return code;
}
