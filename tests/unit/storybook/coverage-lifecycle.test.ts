import { beforeEach, expect, it, vi } from 'vitest';
import { withBrowserCoverage } from '../../e2e/coverage/lifecycle';

const report = vi.hoisted(() => ({ add: vi.fn() }));
const factory = vi.hoisted(() => vi.fn());
vi.mock('../../e2e/coverage/report.mjs', () => ({ coverageReport: factory }));

beforeEach(() => {
  vi.resetAllMocks();
  factory.mockReturnValue(report);
});

it('runs the test without touching coverage when disabled', async () => {
  // arrange
  const coverage = { startJSCoverage: vi.fn(), stopJSCoverage: vi.fn() };
  const use = vi.fn();

  // act
  await withBrowserCoverage(false, coverage, use);

  // assert
  expect(use).toHaveBeenCalledOnce();
  expect(coverage.startJSCoverage).not.toHaveBeenCalled();
  expect(coverage.stopJSCoverage).not.toHaveBeenCalled();
  expect(factory).not.toHaveBeenCalled();
});

it('preserves an assertion failure without collecting in normal mode', async () => {
  // arrange
  const coverage = { startJSCoverage: vi.fn(), stopJSCoverage: vi.fn() };
  const use = vi.fn().mockRejectedValue(new Error('assertion failed'));

  // act
  const result = withBrowserCoverage(false, coverage, use);

  // assert
  await expect(result).rejects.toThrow('assertion failed');
  expect(factory).not.toHaveBeenCalled();
});

it('collects a diagnostic run across navigation', async () => {
  // arrange
  const entries = [{ url: 'http://localhost/src/component.tsx' }];
  const coverage = { startJSCoverage: vi.fn(), stopJSCoverage: vi.fn().mockResolvedValue(entries) };

  // act
  await withBrowserCoverage(true, coverage, vi.fn());

  // assert
  expect(coverage.startJSCoverage).toHaveBeenCalledWith({ resetOnNavigation: false });
  expect(report.add).toHaveBeenCalledWith(entries);
});

it('still collects diagnostics after the test fails', async () => {
  // arrange
  const entries = [{ url: 'http://localhost/src/component.tsx' }];
  const coverage = { startJSCoverage: vi.fn(), stopJSCoverage: vi.fn().mockResolvedValue(entries) };

  // act
  const result = withBrowserCoverage(
    true,
    coverage,
    vi.fn().mockRejectedValue(new Error('assertion failed')),
  );

  // assert
  await expect(result).rejects.toThrow('assertion failed');
  expect(report.add).toHaveBeenCalledWith(entries);
});

it('propagates a collection error', async () => {
  // arrange
  const coverage = {
    startJSCoverage: vi.fn(),
    stopJSCoverage: vi.fn().mockRejectedValue(new Error('capture failed')),
  };

  // act
  const result = withBrowserCoverage(true, coverage, vi.fn());

  // assert
  await expect(result).rejects.toThrow('capture failed');
});

it('does not create fake data for a request-only test', async () => {
  // arrange
  const coverage = { startJSCoverage: vi.fn(), stopJSCoverage: vi.fn().mockResolvedValue([]) };

  // act
  await withBrowserCoverage(true, coverage, vi.fn());

  // assert
  expect(factory).not.toHaveBeenCalled();
});
