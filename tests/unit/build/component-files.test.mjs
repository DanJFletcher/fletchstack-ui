import { describe, vi, it, expect } from 'vitest';
import * as fs from 'node:fs';
import { memoryFilesystem } from '../../support/component-memory.mjs';
import { filesystemContracts } from '../../support/component-file-contracts.mjs';

vi.mock('node:fs', () => ({ realpathSync: vi.fn(), existsSync: vi.fn(), lstatSync: vi.fn(), readdirSync: vi.fn(), readFileSync: vi.fn(), mkdirSync: vi.fn(), writeFileSync: vi.fn(), symlinkSync: vi.fn(), unlinkSync: vi.fn() }));

describe('Filesystem boundary with in-memory doubles', () => {
  filesystemContracts(() => {
    const memory = memoryFilesystem();
    for (const [name, implementation] of Object.entries(memory)) { vi.mocked(fs[name]).mockImplementation(implementation); }
    return '/project';
  }, () => {});
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
