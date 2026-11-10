import type { CoverageReport } from 'monocart-coverage-reports';
/**
 * Create a report with the complete component and Storybook browser inventory.
 **/
export function coverageReport(): CoverageReport;
/**
 * Identify authored browser modules eligible for diagnostic inventory accounting.
 **/
export function inScope(path: string): boolean;
