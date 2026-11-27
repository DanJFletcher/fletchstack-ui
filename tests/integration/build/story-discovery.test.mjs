import { expect, it } from 'vitest';
import { readCsf } from 'storybook/internal/csf-tools';
import { readFile } from 'node:fs/promises';

const groups = JSON.parse(await readFile('tests/fixtures/retired-story-smokes.json', 'utf8'));

it.each(groups)(
  'preserves the Storybook render/play owner for $suite',
  async ({ source, stories }) => {
    // arrange
    const csf = await readCsf(source, { makeTitle: (title) => title });

    // act
    const result = csf.parse().stories.map((entry) => entry.id);

    // assert
    expect(result).toEqual(expect.arrayContaining(stories));
  },
);
