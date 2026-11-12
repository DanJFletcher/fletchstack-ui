import * as fs from 'node:fs';
import { dirname, join } from 'node:path';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { componentProject, sampleOptions } from './component-project.mjs';
import { readComponentProject, safeTarget, validatePlan, applyComponentPlan } from '../../scripts/component-files.mjs';
import { planComponent } from '../../scripts/component-plan.mjs';
import { componentMain } from '../../scripts/component-command.mjs';

/**
 * Exercise mutation safety against a supplied filesystem boundary and disposable root.
 **/
export function filesystemContracts(createRoot, cleanup) {
  let root;
  beforeEach(() => {
    vi.clearAllMocks();
    root = createRoot();
    for (const [path, source] of Object.entries(componentProject())) { fs.mkdirSync(dirname(join(root, path)), { recursive: true }); fs.writeFileSync(join(root, path), source); }
  });
  afterEach(() => { vi.restoreAllMocks(); cleanup(root); });

  it('reads authored text without following links or nontext assets', () => {
    fs.writeFileSync(join(root, 'src/photo.png'), 'binary');
    fs.symlinkSync(join(root, 'src'), join(root, 'src/linked'), 'dir');
    const result = readComponentProject(root);
    expect(result.files).toEqual(componentProject());
  });
  it.each(['../outside.txt', '/outside.txt', '.'])('rejects escaping target %s', path => {
    expect(() => safeTarget(root, path)).toThrow('Unsafe destination');
  });
  it('rejects a symlink target even when dangling', () => {
    fs.symlinkSync(join(root, 'missing'), join(root, 'src/linked'));
    expect(() => safeTarget(root, 'src/linked/file.ts')).toThrow('Symlink destination');
  });
  it('propagates unexpected filesystem inspection errors', () => {
    vi.mocked(fs.lstatSync).mockImplementationOnce(() => { throw Object.assign(new Error('denied'), { code: 'EACCES' }); });
    expect(() => safeTarget(root, 'src/index.ts')).toThrow('denied');
  });
  it('rejects a stale plan before creating any outputs', () => {
    const plan = planComponent(readComponentProject(root).files, sampleOptions);
    fs.writeFileSync(join(root, 'src/index.ts'), 'changed by author');
    expect(() => applyComponentPlan(root, plan)).toThrow('File changed since planning');
    expect(fs.existsSync(join(root, 'src/components/status-label/StatusLabel.tsx'))).toBe(false);
  });
  it('validates dry runs without writing output', () => {
    const before = readComponentProject(root).files;
    const report = vi.fn();
    expect(componentMain(['new', 'StatusLabel', '--category', 'Feedback', '--element', 'span', '--dry-run'], root, report)).toBe(0);
    expect(report).toHaveBeenCalledWith(expect.stringContaining('Preview StatusLabel'));
    expect(readComponentProject(root).files).toEqual(before);
  });
  it('creates exactly the plan and preserves unrelated edits', () => {
    fs.writeFileSync(join(root, 'docs/notes.md'), 'authored notes');
    const plan = planComponent(readComponentProject(root).files, sampleOptions);
    const result = applyComponentPlan(root, plan);
    expect(result).toEqual(plan.changes.map(change => change.path));
    for (const change of plan.changes) { expect(fs.readFileSync(join(root, change.path), 'utf8')).toBe(change.after); }
    expect(fs.readFileSync(join(root, 'docs/notes.md'), 'utf8')).toBe('authored notes');
    expect(() => validatePlan(root, plan)).toThrow('File changed since planning');
  });
  it('reports partial writes when a later filesystem write fails', () => {
    const plan = planComponent(readComponentProject(root).files, sampleOptions);
    const write = fs.writeFileSync.getMockImplementation();
    vi.mocked(fs.writeFileSync).mockImplementationOnce(write).mockImplementationOnce(() => { throw new Error('disk full'); });
    expect(() => applyComponentPlan(root, plan)).toThrow('Files already changed: src/components/status-label/StatusLabel.tsx');
  });
  it('reports a filesystem failure before any successful writes', () => {
    const plan = planComponent(readComponentProject(root).files, sampleOptions);
    vi.mocked(fs.mkdirSync).mockImplementationOnce(() => { throw new Error('disk full'); });
    expect(() => applyComponentPlan(root, plan)).toThrow('Files already changed: (none)');
  });
  it('returns a nonzero status for incomplete authoring and repeat creation', () => {
    const report = vi.fn();
    expect(componentMain(['new', 'StatusLabel', '--category', 'Feedback', '--element', 'span'], root, report)).toBe(0);
    expect(report).toHaveBeenCalledWith(expect.stringContaining('Prepared StatusLabel'));
    expect(componentMain(['check', 'StatusLabel'], root, report)).toBe(1);
    expect(report).toHaveBeenCalledWith(expect.stringContaining('Unfinished scaffold'));
    expect(componentMain(['new', 'StatusLabel', '--category', 'Feedback', '--element', 'span'], root, report)).toBe(1);
  });
  it('reports structural success without claiming behavioral completion', () => {
    const report = vi.fn();
    expect(componentMain(['check', 'Sample'], root, report)).toBe(0);
    expect(report).toHaveBeenCalledWith('Structural checks passed. Behavioral verification remains independently required.');
  });
  it('uses CLI defaults and propagates invalid command status', async () => {
    const previous = process.exitCode;
    const cwd = vi.spyOn(process, 'cwd').mockReturnValue(root);
    const output = vi.spyOn(console, 'log').mockImplementation(() => {});
    const argv = vi.spyOn(process, 'argv', 'get').mockReturnValue(['node', 'component.mjs', 'invalid']);
    await import('../../scripts/component.mjs');
    expect(process.exitCode).toBe(1);
    expect(output).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
    process.exitCode = previous;
    cwd.mockRestore(); output.mockRestore(); argv.mockRestore();
  });
}
