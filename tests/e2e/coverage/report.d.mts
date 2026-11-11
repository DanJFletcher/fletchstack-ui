import type { CoverageReport } from 'monocart-coverage-reports';
/**
 * Create a report with the complete component, harness and Storybook browser inventory.
 **/
export function coverageReport(): CoverageReport;
/**
 * Identify authored browser modules eligible for diagnostic inventory accounting.
 **/
export function inScope(path: string): boolean;
/**
 * Normalize source maps and both development server URL layouts to repository paths.
 **/
export function sourcePath(path: string, info?: { distFile?: string }): string;
