import { expect, it } from 'vitest';
import { classifyChange, selectTests } from '../../../scripts/affected-policy.mjs';

it.each([
  ['src/components/button/button.css', 'integration', [], true],
  ['src/components/button/button.css', 'unit', [], false],
  ['tokens/luna.json', 'unit', [], true],
  ['src/components/button/Button.tsx', 'unit', ['button.test.tsx'], false],
  ['src/components/button/Unknown.tsx', 'unit', [], true],
  ['tests/integration/components/button/fixtures/hydrate.tsx', 'integration', [], true],
  ['openspec/changes/example/proposal.md', 'unit', [], false],
  ['tests/integration/sample.test.ts', 'unit', [], false],
  ['README.md', 'unit', [], true],
  ['docs/guide.md', 'integration', [], true],
  ['src/components/button/stories/Button.stories.tsx', 'integration', [], true],
  ['src/new.ts', 'integration', [], true],
])('classifies %s for %s conservatively', (path, project, owners, expected) => {
  // arrange
  const given = { path, status: 'M' };

  // act
  const result = classifyChange(given, project, owners);

  // assert
  expect(result.full).toBe(expected);
});

it.each(['D', 'R100', 'C100'])('falls back for changed dependency status %s', (status) => {
  // arrange
  const given = { path: 'src/old.ts', status };

  // act
  const result = classifyChange(given, 'unit', ['a.test.ts']);

  // assert
  expect(result.full).toBe(true);
});

it('checks the integration filesystem inventory for an untracked source', () => {
  // arrange
  const given = { path: 'src/new.ts', status: '?' };

  // act
  const result = classifyChange(given, 'integration', []);

  // assert
  expect(result.full).toBe(true);
});

it.each([
  [[], new Map(), null, 'safely-empty', []],
  [
    [{ path: 'src/Button.tsx', status: 'M' }],
    new Map([['src/Button.tsx', ['a.test.ts']]]),
    null,
    'selected',
    ['a.test.ts'],
  ],
  [
    [{ path: 'unknown.ts', status: 'M' }],
    new Map(),
    null,
    'full-fallback',
    ['a.test.ts', 'b.test.ts'],
  ],
  [[], new Map(), 'History unavailable', 'full-fallback', ['a.test.ts', 'b.test.ts']],
  [
    [{ path: 'openspec/p.md', status: 'M' }],
    new Map([['openspec/p.md', ['a.test.ts']]]),
    null,
    'full-fallback',
    ['a.test.ts', 'b.test.ts'],
  ],
])('selects the correct outcome %#', (changes, owners, fallback, mode, files) => {
  // arrange
  const given = {
    project: 'unit',
    changes,
    inventory: ['b.test.ts', 'a.test.ts'],
    owners,
    fallback,
  };

  // act
  const result = selectTests(given);

  // assert
  expect(result).toMatchObject({ mode, files });
});

it('does not mistake missing test discovery for a safely empty selection', () => {
  // arrange
  const given = { project: 'unit', changes: [], inventory: [], owners: new Map(), fallback: null };

  // act
  const act = () => selectTests(given);

  // assert
  expect(act).toThrow('Cannot discover unit test inventory');
});
