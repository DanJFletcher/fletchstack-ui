import { expect, it } from 'vitest';
import {
  componentOptions,
  parseComponentArgs,
  elements,
} from '../../scripts/component-options.mjs';
import { planComponent, requiredFile } from '../../scripts/component-plan.mjs';
import {
  namedExports,
  registerPreview,
  registerCatalog,
  scenarioNames,
} from '../../scripts/component-registration.mjs';
import { checkComponent } from '../../scripts/component-check.mjs';
import { describePlan } from '../../scripts/component-command.mjs';
import { componentProject, plannedProject, sampleOptions } from './component-project.mjs';

/**
 * Exercise pure authoring contracts in each independent test project.
 **/
export function authoringContracts() {
  it.each(Object.entries(elements))(
    'retains the explicitly selected %s root/ref mapping',
    (element, refType) => {
      // arrange
      const expected = {
        name: 'HTTPStatus',
        slug: 'http-status',
        category: 'Identity',
        element,
        refType,
        id: 'components-http-status',
      };
      // act
      const result = componentOptions('HTTPStatus', 'Identity', element);
      // assert
      expect(result).toEqual(expected);
    },
  );
  it.each([
    ['../Name', 'Feedback', 'div'],
    ['Name', 'bad/category', 'div'],
    ['Name', 'Feedback', 'dialog'],
    ['Name', 'Feedback', 'toString'],
  ])('rejects invalid explicit inputs %s %s %s', (name, category, element) => {
    // act
    const act = () => componentOptions(name, category, element);
    // assert
    expect(act).toThrow();
  });
  it.each([
    ['new', 'Name'],
    ['new', 'Name', '--bad'],
    ['new', 'Name', '--element', 'span', '--element', 'span'],
    ['check', 'Name', 'extra'],
    ['other', 'Name'],
    ['check', '../Name'],
  ])('rejects invalid command arguments %j', (...args) => {
    // act
    const act = () => parseComponentArgs(args);
    // assert
    expect(act).toThrow();
  });
  it('parses a creation preview with explicit choices', () => {
    // act
    const result = parseComponentArgs([
      'new',
      'Name',
      '--category',
      'Feedback',
      '--element',
      'span',
      '--dry-run',
    ]);
    // assert
    expect(result).toMatchObject({
      command: 'new',
      name: 'Name',
      category: 'Feedback',
      element: 'span',
      dryRun: true,
    });
  });
  it('parses a check without creation choices', () => {
    // act
    const result = parseComponentArgs(['check', 'Name']);
    // assert
    expect(result).toEqual({ command: 'check', name: 'Name' });
  });
  it('requires missing project configuration', () => {
    // act
    const act = () => requiredFile({}, 'package.json');
    // assert
    expect(act).toThrow('Missing project input: package.json');
  });
  it('plans deterministic additions without mutating inputs or authoring fake tests', () => {
    // arrange
    const files = componentProject();
    const before = { ...files };
    // act
    const result = planComponent(files, sampleOptions);
    // assert
    expect(result).toEqual(planComponent(files, sampleOptions));
    expect(files).toEqual(before);
    expect(result.changes.filter((change) => change.before === null)).toHaveLength(7);
    expect(result.changes.some((change) => /\.(test|spec)\./.test(change.path))).toBe(false);
    expect(describePlan(result)).toContain('Remaining authored work:');
    expect(describePlan(result)).toContain('Edit src/index.ts');
    expect(describePlan(result)).toContain('Create docs/status-label.md');
  });
  it.each([
    [
      'registered name',
      (files) => {
        const value = JSON.parse(files['scripts/component-inventory.json']);
        value.families[0].exports.runtime.push('StatusLabel');
        files['scripts/component-inventory.json'] = JSON.stringify(value);
      },
    ],
    [
      'registered slug',
      (files) => {
        const value = JSON.parse(files['scripts/component-inventory.json']);
        value.families[0].slug = 'status-label';
        files['scripts/component-inventory.json'] = JSON.stringify(value);
      },
    ],
    [
      'existing directory',
      (files) => {
        files['src/components/status-label/handmade.ts'] = 'work';
      },
    ],
    [
      'public identity',
      (files) => {
        files['src/index.ts'] += "export { StatusLabelProps } from './other.js';";
      },
    ],
    [
      'double-quoted story identity',
      (files) => {
        files['src/other.stories.tsx'] = 'export default { id: "components-status-label" };';
      },
    ],
    [
      'story identity',
      (files) => {
        files['src/other.stories.tsx'] = "export default { id: 'components-status-label' };";
      },
    ],
    [
      'existing file',
      (files) => {
        files['docs/status-label.md'] = 'work';
      },
    ],
    [
      'CSS export',
      (files) => {
        files['package.json'] = JSON.stringify({
          exports: { './status-label.css': './elsewhere.css' },
        });
      },
    ],
  ])('rejects %s collisions', (_, mutate) => {
    // arrange
    const files = componentProject();
    mutate(files);
    // act
    const act = () => planComponent(files, sampleOptions);
    // assert
    expect(act).toThrow(/already/);
  });
  it.each(['playground', 'composition'])('rejects the existing %s scenario', (suffix) => {
    // arrange
    const catalog = { scenarios: { [`components-status-label--${suffix}`]: {} }, suites: [] };
    // act
    const act = () =>
      registerCatalog(catalog, {
        ...sampleOptions,
        slug: 'status-label',
        id: 'components-status-label',
      });
    // assert
    expect(act).toThrow('Scenario already registered');
  });
  it('rejects the existing suite owner', () => {
    // arrange
    const catalog = {
      scenarios: {},
      suites: [{ file: 'tests/browser-harness/specs/status-label/StatusLabel.spec.ts' }],
    };
    // act
    // eslint-disable-next-line sonarjs/no-identical-functions -- Keep each rejection scenario's act explicit and independently readable.
    const act = () =>
      registerCatalog(catalog, {
        ...sampleOptions,
        slug: 'status-label',
        id: 'components-status-label',
      });
    // assert
    expect(act).toThrow('Suite already registered');
  });
  it.each([
    "export default { order: ['Components', []] };",
    "export default { order: ['Components', ['Feedback', []]] };",
    "export default { order: ['Components', ['Feedback', ['Other',],]] };",
  ])('inserts explicit sidebar placement into %s', (source) => {
    // act
    const result = registerPreview(source, { ...sampleOptions, slug: 'status-label' });
    // assert
    expect(result).toContain("'StatusLabel', ['Docs', 'Playground', 'Composition']");
    expect(result).toContain("import '../src/components/status-label/status-label.css';");
  });
  it.each([
    'export default {',
    'export default {};',
    "export default { order: ['Components'] };",
    "export default { order: ['Components', ['Feedback', reference]] };",
    "export default { a: ['Components', []], b: ['Components', []] };",
  ])('rejects unsupported preview %s', (source) => {
    // act
    const act = () => registerPreview(source, { ...sampleOptions, slug: 'status-label' });
    // assert
    expect(act).toThrow('Unsupported preview layout');
  });
  it.each([
    "export * from './other';",
    'const x = 1;',
    'export { Thing };',
    "export * as All from './other';",
    'export { Thing } from reference;',
  ])('rejects ambiguous export syntax %s', (source) => {
    // act
    const act = () => namedExports(source);
    // assert
    expect(act).toThrow('Unsupported public export layout');
  });
  it.each([
    'export const scenarios = reference;',
    'export let scenarios;',
    '// Playground is not an export',
    'export const scenarios = { ...other };',
  ])('rejects unproven scenario exports %s', (source) => {
    // act
    const result = scenarioNames(source);
    // assert
    expect(result).toEqual([]);
  });
  it('reads shorthand and explicit scenario object keys', () => {
    // act
    const result = scenarioNames("export const scenarios = { Playground, 'Composition': render };");
    // assert
    expect(result).toEqual(['Playground', 'Composition']);
  });
  it('reports a missing generated shared example', () => {
    // arrange
    const files = componentProject();
    const prepared = plannedProject(files, planComponent(files, sampleOptions));
    delete prepared['src/components/status-label/stories/status-label-examples.tsx'];
    // act
    const result = checkComponent(prepared, 'StatusLabel');
    // assert
    expect(result).toContain(
      'Missing shared examples: src/components/status-label/stories/status-label-examples.tsx',
    );
  });
  it('distinguishes inline type exports', () => {
    // act
    const result = namedExports("export { Thing, type ThingProps } from './thing.js';");
    // assert
    expect(result).toEqual([
      { name: 'Thing', type: false, target: './thing.js' },
      { name: 'ThingProps', type: true, target: './thing.js' },
    ]);
  });
  it('reports a new scaffold as incomplete', () => {
    // arrange
    const files = componentProject();
    const prepared = plannedProject(files, planComponent(files, sampleOptions));
    // act
    const result = checkComponent(prepared, 'StatusLabel');
    // assert
    expect(result).toContain(
      'Missing suite: tests/browser-harness/specs/status-label/StatusLabel.spec.ts',
    );
    expect(result).toContain('Missing authored DOM tests: status-label');
    expect(result.some((issue) => issue.startsWith('Unfinished scaffold:'))).toBe(true);
  });
  it('accepts the independently authored structural fixture', () => {
    // act
    const result = checkComponent(componentProject(), 'Sample');
    // assert
    expect(result).toEqual([]);
  });
  it.each([
    [
      'Missing source',
      (files) => {
        delete files['src/components/sample/Sample.tsx'];
      },
    ],
    [
      'Mismatched component entrypoint',
      (files) => {
        files['src/components/sample/index.ts'] = "export { Wrong } from './Sample.js';";
      },
    ],
    [
      'Missing source',
      (files) => {
        delete files['src/components/sample/index.ts'];
      },
    ],
    [
      'Missing stylesheet',
      (files) => {
        delete files['src/components/sample/sample.css'];
      },
    ],
    [
      'Mismatched CSS export',
      (files) => {
        files['package.json'] = '{"exports":{}}';
      },
    ],
    [
      'Missing preview style',
      (files) => {
        files['.storybook/preview.tsx'] = 'export default {};';
      },
    ],
    [
      'Missing or mismatched export',
      (files) => {
        files['src/index.ts'] = '';
      },
    ],
    [
      'Unregistered export',
      (files) => {
        files['src/index.ts'] += "export { Extra } from './extra.js';";
      },
    ],
    [
      'Duplicate public export',
      (files) => {
        files['src/index.ts'] += "export { Sample } from './other.js';";
      },
    ],
    [
      'Duplicate family',
      (files) => {
        const value = JSON.parse(files['scripts/component-inventory.json']);
        value.families.push(value.families[0]);
        files['scripts/component-inventory.json'] = JSON.stringify(value);
      },
    ],
    [
      'Unclassified production module',
      (files) => {
        files['src/unknown.ts'] = '';
      },
    ],
    [
      'Missing documentation',
      (files) => {
        delete files['docs/sample.md'];
      },
    ],
    [
      'Missing stories',
      (files) => {
        delete files['src/components/sample/stories/Sample.stories.tsx'];
      },
    ],
    [
      'Missing authored DOM tests',
      (files) => {
        delete files['src/components/sample/__tests__/Sample.test.tsx'];
      },
    ],
    [
      'Missing scenario module',
      (files) => {
        delete files['tests/browser-harness/scenarios/Sample.tsx'];
      },
    ],
    [
      'Missing scenario export',
      (files) => {
        files['tests/browser-harness/scenarios/Sample.tsx'] = '';
      },
    ],
  ])('reports %s', (expected, mutate) => {
    // arrange
    const files = componentProject();
    mutate(files);
    // act
    const result = checkComponent(files, 'Sample');
    // assert
    expect(result.some((issue) => issue.startsWith(expected))).toBe(true);
  });
  it.each([
    [
      'Duplicate suite',
      (catalog) => {
        catalog.suites.push(catalog.suites[0]);
      },
    ],
    [
      'Missing scenario:',
      (catalog) => {
        catalog.suites[0].scenarios.push('missing');
      },
    ],
    [
      'Missing scenario owner',
      (catalog) => {
        catalog.suites[0].scenarios = [];
      },
    ],
  ])('reports catalog %s', (expected, mutate) => {
    // arrange
    const files = componentProject();
    const catalog = JSON.parse(files['tests/browser-harness/catalog.json']);
    mutate(catalog);
    files['tests/browser-harness/catalog.json'] = JSON.stringify(catalog);
    // act
    const result = checkComponent(files, 'Sample');
    // assert
    expect(result.some((issue) => issue.startsWith(expected))).toBe(true);
  });
  it('allows explicit styleless families and retained Storybook owners', () => {
    // arrange
    const files = componentProject();
    const inventory = JSON.parse(files['scripts/component-inventory.json']);
    delete inventory.families[0].style;
    files['scripts/component-inventory.json'] = JSON.stringify(inventory);
    const catalog = JSON.parse(files['tests/browser-harness/catalog.json']);
    catalog.suites[0].project = 'chromium';
    files['tests/browser-harness/catalog.json'] = JSON.stringify(catalog);
    // act
    const result = checkComponent(files, 'Missing');
    // assert
    expect(result).toEqual(['Unknown component: Missing']);
  });
}
