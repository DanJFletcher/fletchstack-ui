import { expect, it } from 'vitest';
import * as library from '../../../../index';
import { catalog } from '../icon-catalog';

it('keeps the documented collection in discovery order', () => {
  // arrange
  const expected = ['MoonIcon', 'SunIcon', 'CheckIcon', 'CloseIcon', 'ChevronDownIcon', 'ArrowRightIcon', 'PlusIcon', 'ExternalLinkIcon', 'HomeIcon', 'InboxIcon', 'HelpIcon'];

  // act
  const result = catalog.map(entry => entry.name);

  // assert
  expect(result).toEqual(expected);
});

it('includes every public named icon exactly once', () => {
  // arrange
  const expected = Object.keys(library).filter(name => name.endsWith('Icon') && name !== 'Icon').sort();

  // act
  const result = catalog.map(entry => entry.name).sort();

  // assert
  expect(result).toEqual(expected);
});

it('supplies curated synonyms for every catalog entry', () => {
  // arrange
  const expected = [['night', 'dark', 'theme'], ['day', 'light', 'theme'], ['confirm', 'done', 'complete'], ['dismiss', 'cancel', 'remove'], ['down', 'expand', 'dropdown'], ['next', 'forward', 'navigate'], ['add', 'create', 'new'], ['external', 'link', 'open'], ['home'], ['inbox'], ['help']];

  // act
  const result = catalog.map(entry => entry.keywords);

  // assert
  expect(result).toEqual(expected);
});
