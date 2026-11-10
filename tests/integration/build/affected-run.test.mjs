import { mkdtemp, mkdir, rm, writeFile, symlink, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { gitOutput } from '../../../scripts/affected-git.mjs';
import { openVitest, runSelected } from '../../../scripts/affected-vitest.mjs';
import { affectedRun, affectedMain } from '../../../scripts/affected-run.mjs';
import { classifyChange, selectTests } from '../../../scripts/affected-policy.mjs';
import { EventEmitter } from 'node:events';

const cli = resolve('scripts/test-affected.mjs');
let root;
beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'affected-run-'));
  await symlink(resolve('node_modules'), join(root, 'node_modules'), 'dir');
  await mkdir(join(root, 'unit'));
  await mkdir(join(root, 'integration'));
  await mkdir(join(root, 'coverage'));
  await writeFile(join(root, 'coverage', 'sentinel'), 'preserve');
  await writeFile(join(root, '.gitignore'), 'node_modules/\ncoverage/\n');
  await writeFile(join(root, 'vitest.config.mjs'), "export default {test:{projects:[{test:{name:'unit',include:['unit/*.test.mjs']}},{test:{name:'integration',include:['integration/*.test.mjs']}}],coverage:{enabled:true,reporter:['json']}}}");
  await writeFile(join(root, 'source.js'), 'export const value = 1;');
  await writeFile(join(root, 'unit', 'sample.test.mjs'), "import {it,expect} from 'vitest';import {value} from '../source.js';it('sample',()=>expect(value).toBe(1));");
  await writeFile(join(root, 'integration', 'other.test.mjs'), "import {it,expect} from 'vitest';it('other',()=>expect(1).toBe(1));");
  gitOutput(['init', '-q'], root);
  gitOutput(['add', '.'], root);
  gitOutput(['-c', 'user.name=Test', '-c', 'user.email=test@example.test', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'baseline'], root);
});
afterEach(async () => { await rm(root, { recursive: true, force: true }); vi.restoreAllMocks(); });

it('discovers import owners using installed Vitest without executing module bodies', async () => {
  // arrange
  await writeFile(join(root, 'unit', 'sample.test.mjs'), "import {value} from '../source.js';throw new Error('must not execute during discovery: '+value);");

  // act
  const runner = await openVitest({ project: 'unit', root, changes: [{ path: 'source.js', status: 'M' }, { path: 'unit/sample.test.mjs', status: 'M' }, { path: 'gone.js', status: 'D' }] });
  await runner.close();

  // assert
  expect(runner.inventory).toEqual(['unit/sample.test.mjs']);
  expect(runner.owners.get('source.js')).toEqual(['unit/sample.test.mjs']);
  expect(runner.owners.get('gone.js')).toEqual([]);
});

it('runs the real CLI with selected tests and leaves coverage artifacts untouched', async () => {
  // arrange
  await writeFile(join(root, 'source.js'), 'export const value = 1; // changed');
  const before = await stat(join(root, 'coverage', 'sentinel'));

  // act
  const result = await promisify(execFile)(process.execPath, [cli, 'unit', '--base', 'HEAD'], { cwd: root });

  // assert
  expect(result.stdout).toContain('Affected unit: selected');
  expect(result.stdout).toContain('1 passed');
  expect(await readFile(join(root, 'coverage', 'sentinel'), 'utf8')).toBe('preserve');
  expect((await stat(join(root, 'coverage', 'sentinel'))).mtimeMs).toBe(before.mtimeMs);
});

it('reports a deterministic dry run without executing a throwing test', async () => {
  // arrange
  await writeFile(join(root, 'unit', 'sample.test.mjs'), "throw new Error('dry run executed a test');");
  const output = [];

  // act
  await affectedRun(['unit', '--base', 'HEAD', '--dry-run'], { cwd: root, write: line => output.push(line) });
  await affectedRun(['unit', '--base', 'HEAD', '--dry-run'], { cwd: root, write: line => output.push(line) });

  // assert
  expect(output[0]).toBe(output[1]);
  expect(output[0]).toContain('unit/sample.test.mjs');
});

it('propagates a real selected assertion failure', async () => {
  // arrange
  await writeFile(join(root, 'source.js'), 'export const value = 2;');

  // act
  const act = promisify(execFile)(process.execPath, [cli, 'unit', '--base', 'HEAD'], { cwd: root });

  // assert
  await expect(act).rejects.toMatchObject({ code: 1, stdout: expect.stringContaining('Affected unit: selected') });
});

it('propagates a real selected setup failure', async () => {
  // arrange
  await writeFile(join(root, 'unit', 'sample.test.mjs'), "import {it,beforeAll} from 'vitest';beforeAll(()=>{throw new Error('setup failed')});it('sample',()=>{});");

  // act
  const act = promisify(execFile)(process.execPath, [cli, 'unit', '--base', 'HEAD'], { cwd: root });

  // assert
  await expect(act).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining('setup failed') });
});

it('executes a missing-history full fallback without enabling configured coverage', async () => {
  // arrange
  const output = [];

  // act
  const result = await affectedRun(['integration', '--base', 'absent'], { cwd: root, write: line => output.push(line) });

  // assert
  expect(result).toBe(0);
  expect(output[0]).toContain('full-fallback');
  expect(await readFile(join(root, 'coverage', 'sentinel'), 'utf8')).toBe('preserve');
});

it('returns safely empty for an unchanged project through default command boundaries', async () => {
  // arrange
  const previous = process.cwd();
  vi.spyOn(process, 'cwd').mockReturnValue(root);
  const output = vi.spyOn(console, 'log').mockImplementation(() => {});

  // act
  const result = await affectedMain(['unit', '--base', 'HEAD']);

  // assert
  expect(result).toBe(0);
  expect(output).toHaveBeenCalledWith(expect.stringContaining('safely-empty'));
  expect(previous).not.toBe(root);
});

it('fails missing inventory and closes its runner', async () => {
  // arrange
  await rm(join(root, 'unit'), { recursive: true });

  // act
  const act = affectedRun(['unit', '--base', 'HEAD'], { cwd: root });

  // assert
  await expect(act).rejects.toThrow('Cannot discover unit test inventory');
});

it('surfaces transform errors and closes the discovery context', async () => {
  // arrange
  await writeFile(join(root, 'source.js'), 'export const = ;');

  // act
  const act = openVitest({ project: 'unit', root, changes: [{ path: 'source.js', status: 'M' }] });

  // assert
  await expect(act).rejects.toThrow();
});

it('returns command errors without claiming empty selection', async () => {
  // arrange
  const output = vi.spyOn(console, 'error').mockImplementation(() => {});

  // act
  const result = await affectedMain(['integration']);

  // assert
  expect(result).toBe(1);
  expect(output).toHaveBeenCalledWith(expect.stringContaining('Required: --base'));
});

it.each([
  ['SIGINT', 130], ['SIGTERM', 143],
])('preserves %s cancellation through the runner boundary', async (signal, expected) => {
  // arrange
  const signals = new EventEmitter();
  const ctx = { standalone: async () => {}, cancelCurrentRun: vi.fn(), runTestSpecifications: async () => { signals.emit(signal); return { testModules: [], unhandledErrors: [] }; } };

  // act
  const result = await runSelected(ctx, { specs: [{ moduleId: join(root, 'a.test.mjs') }], files: ['a.test.mjs'], root }, signals);

  // assert
  expect(result).toBe(expected);
  expect(signals.eventNames()).toEqual([]);
});

it.each([
  [{ testModules: [], unhandledErrors: [] }, 1],
  [{ testModules: [{ state: () => 'failed' }], unhandledErrors: [] }, 1],
  [{ testModules: [{ state: () => 'passed' }], unhandledErrors: [new Error('unhandled')] }, 1],
  [{ testModules: [{ state: () => 'skipped' }], unhandledErrors: [] }, 0],
])('preserves incomplete or failed execution %#', async (outcome, expected) => {
  // arrange
  const ctx = { standalone: async () => {}, runTestSpecifications: async () => outcome };

  // act
  const result = await runSelected(ctx, { specs: [{ moduleId: join(root, 'a.test.mjs') }], files: ['a.test.mjs'], root });

  // assert
  expect(result).toBe(expected);
});

it('rejects empty exact execution', async () => {
  // arrange
  const given = { specs: [], files: [], root };

  // act
  const act = runSelected({}, given);

  // assert
  await expect(act).rejects.toThrow('Refusing execution');
});

it.each([
  ['tokens/luna.json', 'unit', 'M', true], ['src/components/button/button.css', 'integration', 'M', true],
  ['src/components/button/button.css', 'unit', 'M', false], ['src/index.ts', 'unit', 'M', true],
  ['docs/spatial-system.md', 'integration', 'M', true], ['unknown.asset', 'unit', 'M', true],
  ['src/Button.tsx', 'unit', 'D', true], ['tests/integration/a.test.ts', 'unit', 'M', false],
  ['tests/unit/new.test.ts', 'integration', '?', true], ['openspec/changes/a/proposal.md', 'unit', '?', false],
])('classifies runtime input %s in %s', (path, project, status, expected) => {
  // arrange
  const given = { path, status };

  // act
  const result = classifyChange(given, project, []);

  // assert
  expect(result.full).toBe(expected);
});

it('retains import-dependent tests in the requested project', () => {
  // arrange
  const given = { project: 'unit', changes: [{ path: 'src/Field.tsx', status: 'M' }], inventory: ['select.test.ts', 'input.test.ts'], owners: new Map([['src/Field.tsx', ['select.test.ts', 'input.test.ts']]]), fallback: null };

  // act
  const result = selectTests(given);

  // assert
  expect(result).toMatchObject({ mode: 'selected', files: ['input.test.ts', 'select.test.ts'] });
});

it('does not suppress owner discovery for a planning path imported as runtime data', () => {
  // arrange
  const given = { project: 'unit', changes: [{ path: 'openspec/example.md', status: 'M' }], inventory: ['a.test.ts'], owners: new Map([['openspec/example.md', ['a.test.ts']]]), fallback: null };

  // act
  const result = selectTests(given);

  // assert
  expect(result.mode).toBe('full-fallback');
});

it('falls back when an owner map does not classify a runtime path', () => {
  // arrange
  const given = { project: 'unit', changes: [{ path: 'unknown.ts', status: 'M' }], inventory: ['a.test.ts'], owners: new Map(), fallback: null };

  // act
  const result = selectTests(given);

  // assert
  expect(result.files).toEqual(['a.test.ts']);
  expect(result.mode).toBe('full-fallback');
});
