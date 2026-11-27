import { componentOptions } from './component-options.mjs';
import { componentTemplates, componentWork } from './component-templates.mjs';
import {
  namedExports,
  newFamily,
  registerCatalog,
  registerPreview,
} from './component-registration.mjs';

export const registrationPaths = [
  'scripts/component-inventory.json',
  'package.json',
  'src/index.ts',
  '.storybook/preview.tsx',
  'tests/browser-harness/catalog.json',
];

/**
 * Require an existing project input rather than silently creating replacement configuration.
 **/
export function requiredFile(files, path) {
  if (typeof files[path] !== 'string') {
    throw new Error(`Missing project input: ${path}`);
  }
  return files[path];
}

/**
 * Reject ambiguous identity reuse before preparing any mutations.
 **/
function rejectConflicts(files, inventory, options) {
  const { name, slug, id } = options;
  if (
    inventory.families.some(
      (family) => family.slug === slug || family.exports.runtime.includes(name),
    )
  ) {
    throw new Error(`Component already registered: ${name}`);
  }
  if (Object.keys(files).some((path) => path.startsWith(`src/components/${slug}/`))) {
    throw new Error(`Component directory already exists: ${slug}`);
  }
  if (
    namedExports(requiredFile(files, 'src/index.ts')).some((entry) =>
      [name, `${name}Props`, `${name}Style`].includes(entry.name),
    )
  ) {
    throw new Error(`Public export already exists: ${name}`);
  }
  if (
    Object.entries(files).some(
      ([path, source]) =>
        path.endsWith('.stories.tsx') && new RegExp(`\\bid\\s*:\\s*['"]${id}['"]`).test(source),
    )
  ) {
    throw new Error(`Story ID already exists: ${id}`);
  }
}

/**
 * Prepare registration changes using parsed JSON and bounded static-source edits.
 **/
function registrations(files, options, inventory) {
  const { name, slug } = options;
  const manifest = JSON.parse(requiredFile(files, 'package.json'));
  if (Object.hasOwn(manifest.exports, `./${slug}.css`)) {
    throw new Error(`CSS export already exists: ${slug}`);
  }
  manifest.exports[`./${slug}.css`] = `./dist/${slug}.css`;
  inventory.families.push(newFamily(options));
  const catalog = registerCatalog(
    JSON.parse(requiredFile(files, 'tests/browser-harness/catalog.json')),
    options,
  );
  const source = requiredFile(files, 'src/index.ts');
  return {
    'scripts/component-inventory.json': `${JSON.stringify(inventory, null, 2)}\n`,
    'package.json': `${JSON.stringify(manifest, null, 2)}\n`,
    'src/index.ts': `${source}\nexport { ${name} } from './components/${slug}/index.js';\nexport type { ${name}Props, ${name}Style } from './components/${slug}/index.js';\n`,
    '.storybook/preview.tsx': registerPreview(
      requiredFile(files, '.storybook/preview.tsx'),
      options,
    ),
    'tests/browser-harness/catalog.json': `${JSON.stringify(catalog, null, 2)}\n`,
  };
}

/**
 * Build the same deterministic change plan for preview and application without performing I/O.
 **/
export function planComponent(files, input) {
  const options = componentOptions(input.name, input.category, input.element);
  const inventory = JSON.parse(requiredFile(files, 'scripts/component-inventory.json'));
  rejectConflicts(files, inventory, options);
  const created = componentTemplates(options);
  for (const path of Object.keys(created)) {
    if (Object.hasOwn(files, path)) {
      throw new Error(`File already exists: ${path}`);
    }
  }
  const updated = registrations(files, options, inventory);
  const changes = Object.entries({ ...created, ...updated }).map(([path, after]) => ({
    path,
    before: files[path] ?? null,
    after,
  }));
  return { name: options.name, changes, remaining: componentWork(options) };
}
