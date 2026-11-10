import { coverageReport } from './report.mjs';
import { writeFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { performance } from 'node:perf_hooks';
import { diagnosticSummary } from './summary.mjs';

export default class CoverageReporter {
  /**
   * Accept report and filesystem boundaries for focused failure-sensitivity tests.
   **/
  constructor({ report = coverageReport, write = writeFile } = {}) {
    this.report = report;
    this.write = write;
    this.scope = {};
  }

  /**
   * Start fresh diagnostics and record the actual selected tests and invocation.
   **/
  onBegin(config, suite) {
    this.scope = {
      invocation: process.argv.slice(2),
      grep: String(config.grep), grepInvert: String(config.grepInvert),
      suites: [...new Set(suite.allTests().map(test => relative(process.cwd(), test.location.file)))].sort(),
      tests: suite.allTests().map(test => test.titlePath().join(' > ')),
    };
    this.report().cleanCache();
  }

  /**
   * Fail broken measurement, but leave test status and incomplete percentages intact.
   **/
  async onEnd(result) {
    try {
      await this.generate(result);
      return undefined;
    } catch (error) {
      console.error('E2E diagnostic coverage could not be generated:', error);
      return { status: 'failed' };
    }
  }

  /**
   * Generate the complete inventory and separate diagnostic category counters.
   **/
  async generate(result) {
    const report = this.report();
    if (!report.hasCache()) { throw new Error('No browser coverage data collected'); }
    const started = performance.now();
    const results = await report.generate();
    if (!results?.files.length) { throw new Error('No scoped browser coverage files generated'); }
    const summary = diagnosticSummary(results.files, { ...this.scope, testStatus: result.status });
    summary.reportGenerationMs = performance.now() - started;
    await this.write('coverage/e2e/diagnostic-summary.json', `${JSON.stringify(summary, null, 2)}\n`);
    console.log('Browser coverage is diagnostic; production, story-demo and preview totals: coverage/e2e/diagnostic-summary.json');
  }
}
