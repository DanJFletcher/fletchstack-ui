// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it } from 'vitest';
import { Textarea } from '../../../../src/index';

afterEach(cleanup);

it('hydrates a native textarea and updates its server-rendered count', async () => {
  // arrange
  const ref = createRef<HTMLTextAreaElement>();
  const given = <Textarea ref={ref} label="Description" defaultValue="First" showCount />;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);
  render(given, { container, hydrate: true });
  const user = userEvent.setup();

  // act
  await user.type(screen.getByRole('textbox'), '!');

  // assert
  expect(ref.current).toBe(screen.getByRole('textbox'));
  expect(screen.getByRole('textbox')).toHaveValue('First!');
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('6');
});

it.each([
  { canceled: false, expected: '5' },
  { canceled: true, expected: '6' },
])('keeps the native reset count at $expected when canceled=$canceled', async ({ canceled, expected }) => {
  // arrange
  const user = userEvent.setup();
  render(<form onReset={event => { if (canceled) { event.preventDefault(); } }}><Textarea label="Description" defaultValue="First" showCount /><button type="reset">Reset</button></form>);
  await user.type(screen.getByRole('textbox'), '!');

  // act
  await user.click(screen.getByRole('button'));

  // assert
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription(expected);
});

it('cleans up pending reset observations when removed', async () => {
  // arrange
  const { unmount } = render(<form onReset={() => unmount()}><Textarea label="Description" showCount /></form>);
  const form = screen.getByRole('textbox').closest('form')!;

  // act
  await act(async () => { form.reset(); });

  // assert
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});

it('supports a textarea without a counter', () => {
  // arrange
  const given = <Textarea label="Description" />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
});
