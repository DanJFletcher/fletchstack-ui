import { readFile } from 'node:fs/promises';
import { expect } from 'vitest';
import { buildTokens } from '../../../scripts/token-build.mjs';
import { test, writeProject } from '../fixtures/token-project.mjs';

test.for([
  {
    name: 'inherited types through nested groups',
    given: {
      $type: 'number',
      primitive: { nested: { count: { $value: 2 } } },
      semantic: {
        $type: 'number',
        itemCount: { $value: '{primitive.nested.count}', $description: 'Item count.' },
      },
    },
    expected: '--fs-item-count: 2;',
  },
  {
    name: 'leaf types overriding group types',
    given: {
      primitive: { $type: 'number', gap: { $type: 'dimension', $value: { value: 8, unit: 'px' } } },
      semantic: {
        $type: 'number',
        gap: { $type: 'dimension', $value: '{primitive.gap}', $description: 'Layout gap.' },
      },
    },
    expected: '--fs-gap: 8px;',
  },
  {
    name: 'rem font sizes in typography groups',
    given: {
      primitive: { size: { $type: 'dimension', $value: { value: 1.25, unit: 'rem' } } },
      semantic: {
        font: {
          size: { $type: 'dimension', $value: '{primitive.size}', $description: 'Font size.' },
        },
      },
    },
    expected: '--fs-font-size: 1.25rem;',
  },
  {
    name: 'rem font sizes at a font leaf',
    given: {
      primitive: { size: { $type: 'dimension', $value: { value: 1.25, unit: 'rem' } } },
      semantic: {
        button: {
          font: { $type: 'dimension', $value: '{primitive.size}', $description: 'Font size.' },
        },
      },
    },
    expected: '--fs-button-font: 1.25rem;',
  },
])('builds $name from source documents', async ({ given, expected }, { root }) => {
  // arrange
  await writeProject(root, given);

  // act
  await buildTokens(root);

  // assert
  expect(await readFile(new URL('src/generated/tokens.css', root), 'utf8')).toContain(expected);
});

test.for([
  {
    name: 'null groups',
    given: { primitive: { broken: null }, semantic: {} },
    expected: 'Invalid group',
  },
  {
    name: 'text groups',
    given: { primitive: { broken: 'invalid' }, semantic: {} },
    expected: 'Invalid group',
  },
  {
    name: 'array groups',
    given: { primitive: { broken: [] }, semantic: {} },
    expected: 'Invalid group',
  },
  {
    name: 'unknown layers',
    given: { primitive: {}, semantic: {}, extra: { count: { $type: 'number', $value: 2 } } },
    expected: 'Unknown token layer',
  },
  {
    name: 'missing references',
    given: {
      primitive: {},
      semantic: {
        count: { $type: 'number', $value: '{primitive.missing}', $description: 'Count.' },
      },
    },
    expected: 'Unresolved reference',
  },
  {
    name: 'cycles across aliases',
    given: {
      primitive: {
        a: { $type: 'number', $value: '{primitive.b}' },
        b: { $type: 'number', $value: '{primitive.a}' },
      },
      semantic: {},
    },
    expected: 'Alias cycle',
  },
  {
    name: 'primitive aliases',
    given: {
      primitive: {
        count: { $type: 'number', $value: 2 },
        alias: { $type: 'number', $value: '{primitive.count}' },
      },
      semantic: {},
    },
    expected: 'Primitive must be raw',
  },
  {
    name: 'mismatched alias types',
    given: {
      primitive: { count: { $type: 'number', $value: 2 } },
      semantic: {
        count: { $type: 'fontWeight', $value: '{primitive.count}', $description: 'Count.' },
      },
    },
    expected: 'Alias type mismatch',
  },
  {
    name: 'raw semantic values',
    given: {
      primitive: {},
      semantic: { count: { $type: 'number', $value: 2, $description: 'Count.' } },
    },
    expected: 'Semantic must reference a primitive',
  },
  {
    name: 'semantic aliases',
    given: {
      primitive: { count: { $type: 'number', $value: 2 } },
      semantic: {
        count: { $type: 'number', $value: '{primitive.count}', $description: 'Count.' },
        alias: { $type: 'number', $value: '{semantic.count}', $description: 'Alias.' },
      },
    },
    expected: 'Semantic must reference a primitive',
  },
  {
    name: 'missing purposes',
    given: {
      primitive: { count: { $type: 'number', $value: 2 } },
      semantic: { count: { $type: 'number', $value: '{primitive.count}' } },
    },
    expected: 'Missing purpose',
  },
  {
    name: 'relative spatial units',
    given: {
      primitive: { gap: { $type: 'dimension', $value: { value: 1, unit: 'rem' } } },
      semantic: { gap: { $type: 'dimension', $value: '{primitive.gap}', $description: 'Gap.' } },
    },
    expected: 'Spatial dimension must use px',
  },
  {
    name: 'colliding public names',
    given: {
      primitive: { gap: { $type: 'number', $value: 2 } },
      semantic: {
        buttonGap: { $type: 'number', $value: '{primitive.gap}', $description: 'Gap.' },
        'button-gap': { $type: 'number', $value: '{primitive.gap}', $description: 'Other gap.' },
      },
    },
    expected: 'CSS name collision',
  },
])('rejects $name during a real token build', async ({ given, expected }, { root }) => {
  // arrange
  await writeProject(root, given);

  // act
  const result = buildTokens(root);

  // assert
  await expect(result).rejects.toThrow(expected);
});
