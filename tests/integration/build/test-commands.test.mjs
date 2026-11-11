import { mkdtemp, mkdir, readFile, readdir, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { afterEach, expect, it } from 'vitest';

const { scripts } = JSON.parse(await readFile(new URL('../../../package.json', import.meta.url), 'utf8'));
const execute = promisify(execFile);
const roots = [];
afterEach(async () => { await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true }))); });

/**
 * Exercise the actual npm scripts in an isolated project with coverage enabled in configuration.
 **/
async function fixture(project, body) {
  const root = await mkdtemp(join(tmpdir(), 'test-commands-'));
  roots.push(root);
  await symlink(resolve('node_modules'), join(root, 'node_modules'), 'dir');
  await writeFile(join(root, 'package.json'), JSON.stringify({ type: 'module', scripts }));
  await writeFile(join(root, 'vitest.config.mjs'), "export default {test:{projects:['unit','integration'].map(name=>({test:{name,include:[name+'/*.test.mjs']}})),coverage:{enabled:true,reporter:['json']}}};");
  for (const name of ['unit', 'integration']) {
    await mkdir(join(root, name));
    await mkdir(join(root, 'coverage', name), { recursive: true });
    await writeFile(join(root, 'coverage', name, 'sentinel'), 'existing report');
    await writeFile(join(root, name, 'sample.test.mjs'), name === project ? body : "throw new Error('unselected project executed');");
  }
  return root;
}

it.each(['unit', 'integration'])('%s default command isolates its project and preserves coverage reports', async project => {
  const root = await fixture(project, "import {it,expect} from 'vitest';it('sample',()=>expect(1).toBe(1));");
  const report = join(root, 'coverage', project, 'sentinel');
  const before = await stat(report);

  const result = await execute('npm', ['run', `test:${project}`, '--', '--maxWorkers=1'], { cwd: root });

  expect(result.stdout).toContain('1 passed');
  expect(await readdir(join(root, 'coverage'))).toEqual(['integration', 'unit']);
  for (const name of ['unit', 'integration']) {
    expect(await readdir(join(root, 'coverage', name))).toEqual(['sentinel']);
    expect(await readFile(join(root, 'coverage', name, 'sentinel'), 'utf8')).toBe('existing report');
  }
  expect((await stat(report)).mtimeMs).toBe(before.mtimeMs);
});

it.each(['unit', 'integration'])('%s default command propagates assertion failures', async project => {
  const root = await fixture(project, "import {it,expect} from 'vitest';it('regression',()=>expect(1).toBe(2));");

  const result = execute('npm', ['run', `test:${project}`, '--', '--maxWorkers=1'], { cwd: root });

  await expect(result).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining('expected 1 to be 2') });
});

it.each(['unit', 'integration'])('%s default command propagates setup failures', async project => {
  const root = await fixture(project, "import {it,beforeAll} from 'vitest';beforeAll(()=>{throw new Error('setup failed')});it('sample',()=>{});");

  const result = execute('npm', ['run', `test:${project}`, '--', '--maxWorkers=1'], { cwd: root });

  await expect(result).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining('setup failed') });
});

it.each(['unit', 'integration'])('%s coverage command declares a full independent gate', project => {
  // Inspect the contract without launching instrumented child runs during development.
  const command = scripts[`test:${project}:coverage`];

  expect(command.split(' ')).toEqual(['vitest', 'run', '--project', project, '--coverage', `--coverage.reportsDirectory=coverage/${project}`]);
});

it('required CI uses both explicit coverage gates alongside existing verification', async () => {
  const workflow = await readFile(new URL('../../../.github/workflows/verify.yml', import.meta.url), 'utf8');
  const commands = workflow.split('\n').map(line => line.trim()).filter(line => line.startsWith('- run: ')).map(line => line.slice(7));

  expect(commands).toEqual([
    'npm ci', 'npx playwright install --with-deps chromium', 'npm run lint', 'npm run typecheck',
    'npm run test:unit:coverage', 'npm run test:integration:coverage', 'npm run test:storybook',
    'npm run test:e2e', 'npm run build', 'node scripts/verify-browser.mjs', 'npm run build-storybook', 'npm run verify:package',
  ]);
});
