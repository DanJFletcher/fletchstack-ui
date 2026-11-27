import { test as base, expect } from '../../e2e/fixtures/test';
import { relative } from 'node:path';
import catalog from '../catalog.json' with { type: 'json' };

export const test = base.extend<{ pageErrors: void }>({
  mount: async ({ mount }, use, info) => {
    const file = relative(process.cwd(), info.file).replaceAll('\\', '/');
    const owner = catalog.suites.find((suite) => suite.file === file);
    await use(async (id, props) => {
      if (
        Object.hasOwn(catalog.scenarios, id) &&
        !owner?.scenarios.some((scenario) => scenario === id)
      ) {
        throw new Error(`Undeclared scenario ${id} in ${file}`);
      }
      return mount(id, props);
    });
  },
  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      const collect = (error: Error) => errors.push(error.message);
      page.on('pageerror', collect);
      try {
        await use();
      } finally {
        page.off('pageerror', collect);
        expect(errors, 'Uncaught errors in the component harness').toEqual([]);
      }
    },
    { auto: true },
  ],
});

export { expect };
