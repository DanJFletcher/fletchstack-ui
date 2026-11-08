import { coverageReport } from './report.mjs';

export default class CoverageReporter {
  /**
   * Discard previous runs so stale results cannot satisfy the gate.
   **/
  onBegin() {
    coverageReport().cleanCache();
  }

  /**
   * Fail the Playwright run unless every scoped file reaches every threshold.
   **/
  async onEnd() {
    try {
      return await this.enforceCoverage();
    } catch (error) {
      console.error('E2E coverage could not be verified:', error);
      return { status: 'failed' };
    }
  }

  /**
   * Generate reports and compare exact counters rather than rounded percentages.
   **/
  async enforceCoverage() {
    const results = await coverageReport().generate();
    if (!results?.files.length) {
      throw new Error('No component/Storybook E2E coverage collected');
    }
    const failures = results.files.flatMap(file => ['statements', 'branches', 'functions', 'lines']
      .filter(metric => file.summary[metric].covered !== file.summary[metric].total)
      .map(metric => `${file.sourcePath}: ${metric} ${file.summary[metric].covered}/${file.summary[metric].total}`));
    if (failures.length) {
      console.error(`E2E coverage requires 100% per file:\n${failures.join('\n')}`);
      return { status: 'failed' };
    }
    return undefined;
  }
}
