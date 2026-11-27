import { expect, it } from 'vitest';
import { parseOptions } from '../../../scripts/affected-options.mjs';

it('parses an explicit unit comparison and a dry run', () => {
  // arrange
  const given = ['unit', '--base', 'origin/main', '--dry-run'];

  // act
  const result = parseOptions(given);

  // assert
  expect(result).toEqual({ project: 'unit', base: 'origin/main', dryRun: true });
});

it('defaults integration execution to a real run', () => {
  // arrange
  const given = ['integration', '--base', 'HEAD'];

  // act
  const result = parseOptions(given);

  // assert
  expect(result).toEqual({ project: 'integration', base: 'HEAD', dryRun: false });
});

it.each([
  [],
  ['storybook', '--base', 'HEAD'],
  ['unit'],
  ['unit', '--base'],
  ['unit', '--base', '--dry-run'],
  ['unit', '--base', 'HEAD', '--base', 'main'],
  ['unit', '--base', 'HEAD', '--dry-run', '--dry-run'],
  ['unit', '--base', 'HEAD', '--coverage'],
])('rejects invalid arguments %j', (...given) => {
  // arrange
  const argv = given;

  // act
  const act = () => parseOptions(argv);

  // assert
  expect(act).toThrow();
});
