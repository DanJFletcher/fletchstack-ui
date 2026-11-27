import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { expect } from 'vitest';
import { buildTokens } from '../../../scripts/token-build.mjs';
import { test, tokenDocument, writeProject } from '../fixtures/token-project.mjs';

test.for([
  { name: 'pixel dimensions', type: 'dimension', value: { value: 8, unit: 'px' }, expected: '8px' },
  {
    name: 'default color opacity',
    type: 'color',
    value: { colorSpace: 'srgb', components: [0, 0.5, 1] },
    expected: 'rgb(0 128 255 / 1)',
  },
  {
    name: 'zero color opacity',
    type: 'color',
    value: { colorSpace: 'srgb', components: [1, 0, 0], alpha: 0 },
    expected: 'rgb(255 0 0 / 0)',
  },
  {
    name: 'fractional color opacity',
    type: 'color',
    value: { colorSpace: 'srgb', components: [0, 0, 1], alpha: 0.5 },
    expected: 'rgb(0 0 255 / 0.5)',
  },
  {
    name: 'custom and generic font families',
    type: 'fontFamily',
    value: ['Example "Display"', 'serif', 'sans-serif', 'monospace', 'system-ui'],
    expected: '"Example \\"Display\\"", serif, sans-serif, monospace, system-ui',
  },
  { name: 'minimum font weight', type: 'fontWeight', value: 1, expected: '1' },
  { name: 'maximum font weight', type: 'fontWeight', value: 1000, expected: '1000' },
  { name: 'unitless line height', type: 'number', value: 1.5, expected: '1.5' },
])('publishes $name from JSON as semantic CSS', async ({ type, value, expected }, { root }) => {
  // arrange
  await writeProject(root, tokenDocument(type, value));

  // act
  await buildTokens(root);

  // assert
  const result = await readFile(new URL('src/generated/tokens.css', root), 'utf8');
  expect(result).toContain(`--fs-sample: ${expected};`);
});

test.for([
  { name: 'a missing dimension', type: 'dimension', value: null },
  { name: 'a text dimension', type: 'dimension', value: { value: '8', unit: 'px' } },
  { name: 'an unsupported dimension unit', type: 'dimension', value: { value: 8, unit: 'em' } },
  { name: 'a missing color', type: 'color', value: null },
  {
    name: 'an unsupported color space',
    type: 'color',
    value: { colorSpace: 'hsl', components: [0, 0, 0] },
  },
  {
    name: 'non-array color channels',
    type: 'color',
    value: { colorSpace: 'srgb', components: '000' },
  },
  {
    name: 'too few color channels',
    type: 'color',
    value: { colorSpace: 'srgb', components: [0, 0] },
  },
  {
    name: 'text color channels',
    type: 'color',
    value: { colorSpace: 'srgb', components: ['0', 0, 0] },
  },
  {
    name: 'negative color channels',
    type: 'color',
    value: { colorSpace: 'srgb', components: [-0.1, 0, 0] },
  },
  {
    name: 'color channels above one',
    type: 'color',
    value: { colorSpace: 'srgb', components: [1.1, 0, 0] },
  },
  {
    name: 'negative opacity',
    type: 'color',
    value: { colorSpace: 'srgb', components: [0, 0, 0], alpha: -0.1 },
  },
  {
    name: 'opacity above one',
    type: 'color',
    value: { colorSpace: 'srgb', components: [0, 0, 0], alpha: 1.1 },
  },
  { name: 'a non-array font family', type: 'fontFamily', value: 'serif' },
  { name: 'an empty font list', type: 'fontFamily', value: [] },
  { name: 'a non-string font name', type: 'fontFamily', value: [42] },
  { name: 'an empty font name', type: 'fontFamily', value: [''] },
  { name: 'font weight below one', type: 'fontWeight', value: 0 },
  { name: 'font weight above 1000', type: 'fontWeight', value: 1001 },
  { name: 'a text number', type: 'number', value: '8' },
  { name: 'an unsupported type', type: 'shadow', value: {} },
])('rejects $name before replacing existing CSS', async ({ type, value }, { root }) => {
  // arrange
  await writeProject(root, tokenDocument(type, value));
  await mkdir(new URL('src/generated', root), { recursive: true });
  await writeFile(new URL('src/generated/tokens.css', root), 'previous stylesheet');

  // act
  const result = buildTokens(root);

  // assert
  await expect(result).rejects.toThrow(`Invalid ${type} value at primitive.sample`);
  expect(await readFile(new URL('src/generated/tokens.css', root), 'utf8')).toBe(
    'previous stylesheet',
  );
});

test.for([
  { type: 'dimension', raw: '{"value":1e999,"unit":"px"}' },
  { type: 'color', raw: '{"colorSpace":"srgb","components":[1e999,0,0]}' },
  { type: 'fontWeight', raw: '1e999' },
  { type: 'number', raw: '1e999' },
])('rejects overflowing JSON numbers in $type tokens', async ({ type, raw }, { root }) => {
  // arrange
  await writeProject(root, tokenDocument(type, null));
  await writeFile(
    new URL('tokens/primitives.json', root),
    `{"primitive":{"sample":{"$type":"${type}","$value":${raw}}}}`,
  );

  // act
  const result = buildTokens(root);

  // assert
  await expect(result).rejects.toThrow(`Invalid ${type} value at primitive.sample`);
});

test('writes semantic purposes to the public reference', async ({ root }) => {
  // arrange
  await writeProject(root, tokenDocument('number', 2));

  // act
  await buildTokens(root);

  // assert
  const result = await readFile(new URL('docs/tokens.md', root), 'utf8');
  expect(result).toContain('| `--fs-sample` | Example purpose. | number |');
});

test('publishes each theme with its own resolved aliases in filename order', async ({ root }) => {
  // arrange
  const document = tokenDocument('number', 2);
  document.primitive.other = { $type: 'number', $value: 4 };
  const theme = {
    semantic: {
      sample: { $type: 'number', $value: '{primitive.other}', $description: 'Example purpose.' },
    },
  };
  await writeProject(root, document, { 'luna.json': theme, 'brand.json': theme });
  const expected =
    '/* Generated by npm run tokens. Do not edit. */\n[data-theme="brand"] {\n  --fs-sample: 4;\n}\n\n:root:not([data-theme]), [data-theme="corporate"] {\n  --fs-sample: 2;\n}\n\n[data-theme="luna"] {\n  --fs-sample: 4;\n}\n';

  // act
  await buildTokens(root);

  // assert
  expect(await readFile(new URL('src/generated/tokens.css', root), 'utf8')).toBe(expected);
});

test.for([
  {
    name: 'missing semantics',
    theme: { semantic: {} },
    filename: 'luna.json',
    expected: 'Semantic contract mismatch',
  },
  {
    name: 'different semantic types',
    theme: {
      semantic: {
        sample: {
          $type: 'fontWeight',
          $value: '{primitive.sample}',
          $description: 'Example purpose.',
        },
      },
    },
    filename: 'luna.json',
    expected: 'Semantic contract mismatch',
  },
  {
    name: 'invalid theme identifiers',
    theme: {
      semantic: {
        sample: { $type: 'number', $value: '{primitive.sample}', $description: 'Example purpose.' },
      },
    },
    filename: 'Brand.json',
    expected: 'Invalid theme identifier',
  },
])('rejects $name from discovered files', async ({ theme, filename, expected }, { root }) => {
  // arrange
  await writeProject(root, tokenDocument('number', 2), { [filename]: theme });

  // act
  const result = buildTokens(root);

  // assert
  await expect(result).rejects.toThrow(expected);
});
