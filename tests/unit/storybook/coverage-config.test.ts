import { expect, it } from 'vitest';
import normal from '../../../playwright.config';
import diagnostic from '../../../playwright.coverage.config';

it('enables collection and reporting only in the diagnostic configuration', () => {
  // arrange
  const expected = [['list'], ['html', { open: 'never' }]];

  // act
  const reporters = normal.reporter;

  // assert
  expect(reporters).toEqual(expected);
  expect(normal.use?.collectBrowserCoverage).not.toBe(true);
  expect(diagnostic.use?.collectBrowserCoverage).toBe(true);
  expect(diagnostic.reporter).toContainEqual(['./tests/e2e/coverage/reporter.mjs']);
});

it('shares discovery, browser, server and failure diagnostics across modes', () => {
  // arrange
  const expected = { testDir: normal.testDir, testMatch: normal.testMatch, projects: normal.projects, webServer: normal.webServer };

  // act
  const result = { testDir: diagnostic.testDir, testMatch: diagnostic.testMatch, projects: diagnostic.projects, webServer: diagnostic.webServer };

  // assert
  expect(result).toEqual(expected);
  expect(diagnostic.use?.trace).toBe('retain-on-failure');
  expect(diagnostic.use?.screenshot).toBe('only-on-failure');
  expect(diagnostic.retries).toBe(0);
});
