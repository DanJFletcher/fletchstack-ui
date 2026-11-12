/**
 * Emit a native-prop skeleton whose API and behavior still require an authored contract.
 **/
function componentSource({ name, slug, element, refType }) {
  return `import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type RefAttributes } from 'react';

export type ${name}Style = CSSProperties & { [token: \`--fs-\${string}\`]: string | number | undefined };
export type ${name}Props = Omit<ComponentPropsWithoutRef<'${element}'>, 'style'> & { style?: ${name}Style };

/**
 * COMPONENT_TODO: Define the public responsibility, semantics, and behavior.
 **/
export const ${name}: ForwardRefExoticComponent<${name}Props & RefAttributes<${refType}>> = /* @__PURE__ */ forwardRef<${refType}, ${name}Props>(function ${name}(
  { className, ...props }, ref,
) {
  return <${element} {...props} ref={ref} className={['fs-${slug}', className].filter(Boolean).join(' ')} />;
});
`;
}

/**
 * Keep plain React examples independent of Storybook's runtime and public barrel.
 **/
function exampleSource({ name }) {
  return `import { ${name} } from '../${name}';

/**
 * COMPONENT_TODO: Show a meaningful composition from the agreed contract.
 **/
export function ${name}Example() {
  return <${name} title="Example" />;
}
`;
}

/**
 * Give Storybook ownership of metadata and interactions, not shared example behavior.
 **/
function storySource({ name, slug, category, id }) {
  return `import type { Meta, StoryObj } from '@storybook/react-vite';
import { ${name} } from '../${name}';
import { ${name}Example } from './${slug}-examples';

const meta = { id: '${id}', title: 'Components/${category}/${name}', component: ${name}, tags: ['autodocs'], parameters: { a11y: { test: 'error' } } } satisfies Meta<typeof ${name}>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Composition: Story = { render: () => <${name}Example /> };
// COMPONENT_TODO: Add meaningful states, both themes, and applicable interactions.
`;
}

/**
 * Register direct implementation and stylesheet dependencies for isolated browser scenarios.
 **/
function harnessSource({ name, slug }) {
  return `import { ${name}, type ${name}Props } from '../../../src/components/${slug}/${name}';
import { ${name}Example } from '../../../src/components/${slug}/stories/${slug}-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/${slug}/${slug}.css';

const Playground: Scenario<${name}Props> = {};
const Composition: Scenario<${name}Props> = { render: () => <${name}Example /> };
export const component = ${name};
export const defaults: ${name}Props = {};
export const scenarios = { Playground, Composition };
`;
}

/**
 * Return ordinary editable files, with no generated behavioral test claims.
 **/
export function componentTemplates(options) {
  const { name, slug } = options;
  const base = `src/components/${slug}`;
  return {
    [`${base}/${name}.tsx`]: componentSource(options),
    [`${base}/index.ts`]: `export { ${name} } from './${name}.js';\nexport type { ${name}Props, ${name}Style } from './${name}.js';\n`,
    [`${base}/${slug}.css`]: `/* COMPONENT_TODO: Implement approved styling with semantic tokens. */\n.fs-${slug} {\n  box-sizing: border-box;\n}\n`,
    [`${base}/stories/${slug}-examples.tsx`]: exampleSource(options),
    [`${base}/stories/${name}.stories.tsx`]: storySource(options),
    [`tests/browser-harness/scenarios/${name}.tsx`]: harnessSource(options),
    [`docs/${slug}.md`]: `# ${name}\n\nCOMPONENT_TODO: Document the authored API, responsibility, semantic tokens, accessibility, and verification evidence.\n`,
  };
}

/**
 * Report required authored work rather than generating empty or skipped tests.
 **/
export function componentWork({ name, slug }) {
  return [
    'Resolve COMPONENT_TODO markers: API, behavior, tokens, examples, and review.',
    `Author src/components/${slug}/__tests__/${name}.test.tsx`,
    `Author tests/integration/components/${slug}/ SSR and hydration assertions as applicable.`,
    `Author tests/browser-harness/specs/${slug}/${name}.spec.ts (planned owner is currently missing).`,
    'Review tests/unit/build/public-api.test.tsx and scripts/fixtures/consumer.tsx / consumer.mjs independently.',
    'Update tests/browser-behavior-matrix.md and record visual/accessibility evidence.',
    `Run npm run component:check -- ${name}, then the verification policy in docs/component-authoring.md.`,
  ];
}
