// @vitest-environment jsdom
import '../../../../../tests/support/dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { IconGallery } from '../icon-gallery';

it('filters export names ignoring case and surrounding whitespace', async () => {
  // arrange
  const user = userEvent.setup();
  render(<IconGallery />);
  const expected = ['MoonIcon'];

  // act
  await user.type(screen.getByRole('searchbox', { name: 'Search icons' }), '  mOoN  ');

  // assert
  const result = within(screen.getByRole('list', { name: 'Icon results' }))
    .getAllByRole('heading')
    .map((heading) => heading.textContent);
  expect(result).toEqual(expected);
});

it.each([
  { given: 'mode', expected: ['MoonIcon', 'SunIcon'] },
  { given: 'new', expected: ['PlusIcon'] },
  { given: 'add', expected: ['PlusIcon'] },
  { given: 'dismiss', expected: ['CloseIcon'] },
  {
    given: '   ',
    expected: [
      'MoonIcon',
      'SunIcon',
      'CheckIcon',
      'CloseIcon',
      'ChevronDownIcon',
      'ArrowRightIcon',
      'PlusIcon',
      'ExternalLinkIcon',
      'HomeIcon',
      'InboxIcon',
      'HelpIcon',
    ],
  },
  { given: '[[', expected: [] }, // user-event escapes a literal opening bracket,
  { given: 'no-such-icon', expected: [] },
])('searches literal names, uses and keywords for "$given"', async ({ given, expected }) => {
  // arrange
  const user = userEvent.setup();
  render(<IconGallery />);

  // act
  await user.type(screen.getByRole('searchbox', { name: 'Search icons' }), given);

  // assert
  const result = within(screen.getByRole('list', { name: 'Icon results' }))
    .queryAllByRole('heading')
    .map((heading) => heading.textContent);
  expect(result).toEqual(expected);
});

it('announces the initial collection size politely', () => {
  // arrange
  const given = <IconGallery />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('status')).toHaveTextContent(/^11 icons$/);
  expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
});

it.each([
  { given: 'moon', expected: '1 icon' },
  { given: 'mode', expected: '2 icons' },
  { given: 'no-such-icon', expected: '0 icons' },
])('announces "$expected" for "$given"', async ({ given, expected }) => {
  // arrange
  const user = userEvent.setup();
  render(<IconGallery />);

  // act
  await user.type(screen.getByRole('searchbox', { name: 'Search icons' }), given);

  // assert
  expect(screen.getByRole('status')).toHaveTextContent(expected);
});

it('keeps typing focus when results disappear', async () => {
  // arrange
  const user = userEvent.setup();
  render(<IconGallery />);
  const input = screen.getByRole('searchbox', { name: 'Search icons' });

  // act
  await user.type(input, 'no-such-icon');

  // assert
  expect(input).toHaveFocus();
});

it('offers recovery guidance without removing the empty results list', async () => {
  // arrange
  const user = userEvent.setup();
  render(<IconGallery />);

  // act
  await user.type(screen.getByRole('searchbox', { name: 'Search icons' }), 'no-such-icon');

  // assert
  expect(screen.getByRole('list', { name: 'Icon results' })).toBeEmptyDOMElement();
  expect(screen.getByText('No icons found. Try another term or clear the search.')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Clear search' })).toBeEnabled();
});

it.each(['moon', 'no-such-icon', ''])(
  'restores the complete collection when clearing "%s"',
  async (given) => {
    // arrange
    const user = userEvent.setup();
    render(<IconGallery />);
    const input = screen.getByRole('searchbox', { name: 'Search icons' });
    await user.click(input);
    await user.paste(given);

    // act
    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    // assert
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('11 icons');
    expect(screen.getAllByRole('listitem')).toHaveLength(11);
  },
);

it('returns focus to search after keyboard clearing', async () => {
  // arrange
  const user = userEvent.setup();
  render(<IconGallery />);
  await user.type(screen.getByRole('searchbox', { name: 'Search icons' }), 'add');
  await user.tab();
  expect(screen.getByRole('button', { name: 'Clear search' })).toHaveFocus();

  // act
  await user.keyboard('{Enter}');

  // assert
  expect(screen.getByRole('searchbox', { name: 'Search icons' })).toHaveFocus();
  expect(screen.getByRole('status')).toHaveTextContent('11 icons');
});

it('keeps cards free of actions and accessible image duplication', () => {
  // arrange
  const given = <IconGallery />;

  // act
  render(given);

  // assert
  const results = screen.getByRole('list', { name: 'Icon results' });
  expect(within(results).queryAllByRole('button')).toEqual([]);
  expect(within(results).queryAllByRole('link')).toEqual([]);
  expect(within(results).queryAllByRole('img')).toEqual([]);
  expect(results.querySelectorAll('[tabindex]')).toHaveLength(0);
});

it('associates each instance with its own visible search label', () => {
  // arrange
  const given = (
    <>
      <IconGallery />
      <IconGallery />
    </>
  );

  // act
  render(given);

  // assert
  const inputs = screen.getAllByRole('searchbox', { name: 'Search icons' });
  expect(inputs).toHaveLength(2);
  expect(new Set(inputs.map((input) => input.id)).size).toBe(2);
});

it('changes the artwork preview size without changing the collection', async () => {
  // arrange
  const user = userEvent.setup();
  render(<IconGallery />);

  // act
  await user.click(screen.getByRole('radio', { name: '16 px' }));

  // assert
  expect(screen.getByRole('radio', { name: '16 px' })).toBeChecked();
  expect(
    screen.getByRole('list', { name: 'Icon results' }).querySelectorAll('svg.fs-icon--small'),
  ).toHaveLength(11);
});

it('selects a local theme without changing the search results', async () => {
  // arrange
  const user = userEvent.setup();
  render(<IconGallery />);

  // act
  await user.selectOptions(screen.getByRole('combobox', { name: 'Theme' }), 'luna');

  // assert
  expect(screen.getByRole('combobox', { name: 'Theme' })).toHaveValue('luna');
  expect(
    screen.getByRole('list', { name: 'Icon results' }).closest('[data-theme]'),
  ).toHaveAttribute('data-theme', 'luna');
  expect(screen.getByRole('status')).toHaveTextContent('11 icons');
});
