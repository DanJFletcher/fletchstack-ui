/**
 * Provide an independently authored tiny project for structural contracts.
 **/
export function componentProject() {
  return {
    'scripts/component-inventory.json': JSON.stringify({
      families: [
        {
          slug: 'sample',
          entry: 'src/components/sample/index.ts',
          exports: { runtime: ['Sample'], types: ['SampleProps'] },
          modules: ['src/components/sample/Sample.tsx'],
          style: 'src/components/sample/sample.css',
          category: 'Feedback',
        },
      ],
      internalModules: [],
    }),
    'src/index.ts':
      "export { Sample } from './components/sample/index.js';\nexport type { SampleProps } from './components/sample/index.js';\n",
    'src/components/sample/index.ts':
      "export { Sample } from './Sample.js';\nexport type { SampleProps } from './Sample.js';\n",
    'src/components/sample/Sample.tsx':
      'export const Sample = () => null; export type SampleProps = object;',
    'src/components/sample/sample.css': '.fs-sample { color: red; }',
    'src/components/sample/stories/Sample.stories.tsx':
      "export default { id: 'components-sample', title: 'Components/Feedback/Sample' };",
    'src/components/sample/__tests__/Sample.test.tsx': 'independently authored test fixture',
    'docs/sample.md': '# Sample',
    '.storybook/preview.tsx':
      "import '../src/components/sample/sample.css';\nexport default { parameters: { options: { storySort: { order: ['Components', ['Feedback', ['Sample', ['Docs']]]] } } } };\n",
    'package.json': JSON.stringify({ exports: { './sample.css': './dist/sample.css' } }),
    'tests/browser-harness/catalog.json': JSON.stringify({
      scenarios: {
        'components-sample--playground': {
          module: 'tests/browser-harness/scenarios/Sample.tsx',
          export: 'Playground',
        },
      },
      suites: [
        {
          project: 'components',
          file: 'tests/browser-harness/specs/sample/Sample.spec.ts',
          scenarios: ['components-sample--playground'],
        },
      ],
    }),
    'tests/browser-harness/scenarios/Sample.tsx':
      'const Playground = {}; export const scenarios = { Playground };',
    'tests/browser-harness/specs/sample/Sample.spec.ts': 'independently authored browser fixture',
  };
}

/**
 * Apply prepared text changes in memory for pure structural contract checks.
 **/
export function plannedProject(files, plan) {
  return {
    ...files,
    ...Object.fromEntries(plan.changes.map((change) => [change.path, change.after])),
  };
}

export const sampleOptions = { name: 'StatusLabel', category: 'Feedback', element: 'span' };
