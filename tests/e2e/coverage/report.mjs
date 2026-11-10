import { CoverageReport } from 'monocart-coverage-reports';
import { transformWithEsbuild } from 'vite';
import { dirname } from 'node:path';

/**
 * Limit browser coverage to components and authored Storybook runtime modules.
 **/
export function inScope(path) {
  return /^(src|stories|\.storybook)\/.*\.[jt]sx?$/.test(path)
    && !path.endsWith('.d.ts') && !/^\.storybook\/main\.[jt]s$/.test(path)
    && !/(?:^|\/)(?:__tests__|fixtures|setup)\//.test(path)
    && !/\.(?:test|spec)\.[jt]sx?$/.test(path);
}

/**
 * Give served modules and local untested files the same report identity.
 **/
function sourcePath(path, info = {}) {
  if (!path.includes('/') && info.distFile) {
    path = `${dirname(info.distFile)}/${path}`;
  }
  return path.replace(/^.*?(?=(?:src\/|stories\/|\.storybook\/))/, '').split('?')[0];
}

/**
 * Build the complete browser-code inventory, including files never loaded.
 **/
export function coverageReport() {
  return new CoverageReport({
    name: 'Diagnostic component and Storybook JavaScript coverage', outputDir: 'coverage/e2e',
    reports: ['v8', 'v8-json', 'console-details', 'json-summary'], v8Ignore: false,
    entryFilter: entry => inScope(new URL(entry.url, 'http://localhost').pathname.slice(1)),
    sourceFilter: inScope, sourcePath,
    all: {
      dir: ['src', 'stories', '.storybook'], filter: path => inScope(sourcePath(path)),
      transformer: async entry => {
        const filename = sourcePath(entry.url);
        const result = await transformWithEsbuild(entry.source, filename, { sourcemap: true, jsx: 'automatic' });
        entry.source = result.code;
        entry.sourceMap = result.map;
      },
    },
  });
}
