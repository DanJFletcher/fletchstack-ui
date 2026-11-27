// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { expect, it, vi } from 'vitest';
import { Checkbox } from '../Checkbox';

it('uses the visible label as its accessible name', () => {
  // arrange
  const given = <Checkbox label="Email updates" />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('checkbox', { name: 'Email updates' })).not.toBeChecked();
});

it('keeps description text out of the accessible name', () => {
  // arrange
  const given = <Checkbox label="Email updates" description="Receive product news and tips." />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('checkbox', { name: 'Email updates' })).toHaveAccessibleDescription(
    'Receive product news and tips.',
  );
});

it('preserves consumer context alongside descriptions and errors', () => {
  // arrange
  const given = (
    <>
      <p id="context">Notification settings.</p>
      <Checkbox
        id="email"
        label="Email updates"
        aria-describedby="context"
        description="Receive product news."
        error="Choose a channel."
      />
    </>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
    'Notification settings. Receive product news. Choose a channel.',
  );
});

it('marks validation errors as invalid', () => {
  // arrange
  const given = <Checkbox label="Email updates" error="Choose a channel." />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('checkbox')).toBeInvalid();
});

it('toggles when the user clicks its visible label', async () => {
  // arrange
  const user = userEvent.setup();
  render(<Checkbox label="Email updates" />);

  // act
  await user.click(screen.getByText('Email updates'));

  // assert
  expect(screen.getByRole('checkbox')).toBeChecked();
});

it('includes the description in the clickable label area', async () => {
  // arrange
  const user = userEvent.setup();
  render(<Checkbox label="Email updates" description="Receive product news." />);

  // act
  await user.click(screen.getByText('Receive product news.'));

  // assert
  expect(screen.getByRole('checkbox')).toBeChecked();
});

it('does not change a disabled choice', async () => {
  // arrange
  const user = userEvent.setup();
  render(<Checkbox label="Email updates" disabled />);

  // act
  await user.click(screen.getByRole('checkbox'));

  // assert
  expect(screen.getByRole('checkbox')).not.toBeChecked();
});

it('notifies a controlled consumer about activation', async () => {
  // arrange
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Checkbox label="Email updates" checked={false} onChange={onChange} />);

  // act
  await user.click(screen.getByRole('checkbox'));

  // assert
  expect(onChange).toHaveBeenCalledOnce();
});

it('exposes native mixed state for partial selections', () => {
  // arrange
  const given = <Checkbox label="Select all" indeterminate />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('checkbox')).toBePartiallyChecked();
});

it('updates mixed state when the consumer changes the prop', () => {
  // arrange
  const { rerender } = render(<Checkbox label="Select all" indeterminate />);

  // act
  rerender(<Checkbox label="Select all" indeterminate={false} />);

  // assert
  expect(screen.getByRole('checkbox')).not.toBePartiallyChecked();
});

it('lets a consumer focus the native control through its ref', () => {
  // arrange
  const ref = createRef<HTMLInputElement>();
  render(<Checkbox label="Email updates" ref={ref} />);

  // act
  ref.current?.focus();

  // assert
  expect(screen.getByRole('checkbox')).toHaveFocus();
});

it('hides the complete field when hidden', () => {
  // arrange
  const given = <Checkbox label="Email updates" hidden />;

  // act
  render(given);

  // assert
  expect(screen.getByText('Email updates')).not.toBeVisible();
});
