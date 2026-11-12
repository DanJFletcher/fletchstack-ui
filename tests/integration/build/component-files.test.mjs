import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, vi, it, expect } from 'vitest';
import { filesystemContracts } from '../../support/component-file-contracts.mjs';

vi.mock('node:fs', async importOriginal => {
  const original = await importOriginal();
  return { ...original, ...Object.fromEntries(['realpathSync', 'existsSync', 'lstatSync', 'readdirSync', 'readFileSync', 'mkdirSync', 'writeFileSync'].map(name => [name, vi.fn(original[name])])) };
});

describe('Filesystem contracts on disposable real projects', () => {
  filesystemContracts(() => mkdtempSync(join(tmpdir(), 'component-authoring-')), root => rmSync(root, { recursive: true, force: true }));
});

import { componentMain } from '../../../scripts/component-command.mjs';

it('rejects invalid options before accessing the project', () => {
  // arrange
  const report = vi.fn();
  // act
  const result = componentMain(['new', '../Escape'], '/unavailable', report);
  // assert
  expect(result).toBe(1);
  expect(report).toHaveBeenCalledWith(expect.stringContaining('PascalCase'));
});
