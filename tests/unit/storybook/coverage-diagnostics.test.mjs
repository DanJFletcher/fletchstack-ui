import { afterEach, expect, it, vi } from 'vitest';
import CoverageReporter from '../../e2e/coverage/reporter.mjs';
import { diagnosticSummary } from '../../e2e/coverage/summary.mjs';

afterEach(() => { vi.restoreAllMocks(); });

/**
 * Build a synthetic file with exact counters for each independent metric.
 **/
function file(sourcePath, covered = 0) {
  const metric = { covered, total: 2 };
  return { sourcePath, summary: { statements: metric, branches: metric, functions: metric, lines: metric } };
}

/**
 * Supply a report boundary without filesystem writes or browser collection.
 **/
function report(files = [file('src/components/button/Button.tsx')]) {
  return { cleanCache: vi.fn(), hasCache: vi.fn().mockReturnValue(true), generate: vi.fn().mockResolvedValue({ files }) };
}

it('separates production, demonstration and preview counters including unloaded files', () => {
  // arrange
  const files = [file('src/components/button/Button.tsx', 2), file('src/components/button/stories/unvisited-helper.ts'), file('stories/shared/demo.tsx', 1), file('.storybook/preview.tsx')];

  // act
  const result = diagnosticSummary(files, { tests: ['synthetic journey'] });

  // assert
  expect(result.diagnostic).toBe(true);
  expect(result.categories.production.metrics.lines).toEqual({ covered: 2, total: 2, percent: 100 });
  expect(result.categories['story-demo'].metrics.lines).toEqual({ covered: 1, total: 4, percent: 25 });
  expect(result.categories['story-demo'].files).toEqual(['src/components/button/stories/unvisited-helper.ts', 'stories/shared/demo.tsx']);
  expect(result.categories.preview.metrics.lines).toEqual({ covered: 0, total: 2, percent: 0 });
  expect(result.scope.tests).toEqual(['synthetic journey']);
});

it('does not turn zero-counter code into an invented percentage', () => {
  // arrange
  const files = [];

  // act
  const result = diagnosticSummary(files, {});

  // assert
  expect(result.categories.production.metrics.lines).toEqual({ covered: 0, total: 0, percent: null });
});

it('cleans diagnostic cache before collecting a new run', () => {
  // arrange
  const coverage = report();
  const reporter = new CoverageReporter({ report: () => coverage, write: vi.fn() });

  // act
  reporter.onBegin({ rootDir: process.cwd(), grep: /.*/, grepInvert: null }, { allTests: () => [] });

  // assert
  expect(coverage.cleanCache).toHaveBeenCalledOnce();
});

it('reports incomplete coverage without failing the diagnostic run', async () => {
  // arrange
  const coverage = report();
  const write = vi.fn();
  const reporter = new CoverageReporter({ report: () => coverage, write });

  // act
  const result = await reporter.onEnd({ status: 'passed' });

  // assert
  expect(result).toBeUndefined();
  expect(write).toHaveBeenCalledOnce();
  expect(JSON.parse(write.mock.calls[0][1]).categories.production.metrics.lines.percent).toBe(0);
});

it('does not override a failed browser test with a passed status', async () => {
  // arrange
  const reporter = new CoverageReporter({ report: () => report(), write: vi.fn() });

  // act
  const result = await reporter.onEnd({ status: 'failed' });

  // assert
  expect(result).toBeUndefined();
});

it('fails instead of fabricating a report from an empty cache', async () => {
  // arrange
  const coverage = report();
  coverage.hasCache.mockReturnValue(false);
  const write = vi.fn();
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  const reporter = new CoverageReporter({ report: () => coverage, write });

  // act
  const result = await reporter.onEnd({ status: 'passed' });

  // assert
  expect(result).toEqual({ status: 'failed' });
  expect(write).not.toHaveBeenCalled();
  expect(error).toHaveBeenCalledWith('E2E diagnostic coverage could not be generated:', expect.objectContaining({ message: 'No browser coverage data collected' }));
});

it('fails when report generation fails', async () => {
  // arrange
  const coverage = report();
  coverage.generate.mockRejectedValue(new Error('source map failed'));
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const reporter = new CoverageReporter({ report: () => coverage, write: vi.fn() });

  // act
  const result = await reporter.onEnd({ status: 'passed' });

  // assert
  expect(result).toEqual({ status: 'failed' });
});

it('fails when generation produces no scoped files', async () => {
  // arrange
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const reporter = new CoverageReporter({ report: () => report([]), write: vi.fn() });

  // act
  const result = await reporter.onEnd({ status: 'passed' });

  // assert
  expect(result).toEqual({ status: 'failed' });
});

it('fails when writing the diagnostic summary fails', async () => {
  // arrange
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const reporter = new CoverageReporter({ report: () => report(), write: vi.fn().mockRejectedValue(new Error('disk full')) });

  // act
  const result = await reporter.onEnd({ status: 'passed' });

  // assert
  expect(result).toEqual({ status: 'failed' });
});
