import { expect, it } from 'vitest';
import normal from '../../../playwright.config';
import diagnostic from '../../../playwright.coverage.config';
import components from '../../../playwright.components.config';

it('enables collection and reporting only in the diagnostic configuration', () => {
  // arrange
  const expected = [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/storybook' }]];

  // act
  const reporters = normal.reporter;

  // assert
  expect(reporters).toEqual(expected);
  expect(normal.use?.collectBrowserCoverage).not.toBe(true);
  expect(diagnostic.use?.collectBrowserCoverage).toBe(true);
  expect(diagnostic.reporter).toContainEqual(['./tests/e2e/coverage/reporter.mjs']);
});

it('includes both disjoint projects in complete diagnostics with unchanged failure evidence', () => {
  // arrange
  const expected = ['chromium', 'components'];

  // act
  const result = diagnostic.projects?.map(project => project.name);

  // assert
  expect(result).toEqual(expected);
  expect(diagnostic.projects?.map(project => project.testDir)).toEqual([normal.testDir, components.testDir]);
  expect(diagnostic.webServer).toHaveLength(2);
  expect(diagnostic.use?.trace).toBe('retain-on-failure');
  expect(diagnostic.use?.screenshot).toBe('only-on-failure');
  expect(diagnostic.retries).toBe(0);
});
