import { readFile } from 'node:fs/promises';
import { expect, it } from 'vitest';
import { preservesStylesheet, exportIdentities } from '../../support/organization.mjs';
import baseline from '../../fixtures/component-organization-baseline.json' with { type: 'json' };
import names from '../../fixtures/organization-protected-token-names.json' with { type: 'json' };

it('accepts additive token names but rejects changes to protected values', async () => {
  const css = await readFile('src/generated/tokens.css', 'utf8');
  const hash = baseline.hashes['src/generated/tokens.css'];
  expect(preservesStylesheet(css.replace('  --fs-surface:', '  --fs-future-token: 1px;\n  --fs-surface:'), names, hash)).toBe(true);
  expect(preservesStylesheet(css.replace('--fs-surface: rgb(255', '--fs-surface: rgb(254'), names, hash)).toBe(false);
});

it('protected public identities remain independent of additive exports', () => {
  const expected = exportIdentities(baseline.publicExports);
  const additive = exportIdentities(`${baseline.publicExports}\nexport { FutureComponent } from './future.js';`);
  expect(additive).toEqual(expect.arrayContaining(expected));
  expect(exportIdentities(baseline.publicExports.replace('export { Button }', 'export { Removed }'))).not.toEqual(expect.arrayContaining(expected));
});
