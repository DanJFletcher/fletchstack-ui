// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { expect, it } from 'vitest';
import { TextInput } from '../../../index';

it('names the field using its visible label', () => {
  // arrange
  const given = <TextInput label="Project name" defaultValue="Website refresh" />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox', { name: 'Project name' })).toHaveValue('Website refresh');
});

it('describes the input with helper text', () => {
  // arrange
  const given = <TextInput label="Project name" helperText="Use a short, descriptive name." />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Use a short, descriptive name.');
});

it('links consumer, prefix, suffix, helper, and error descriptions', () => {
  // arrange
  const given = <><p id="context">Project settings.</p><TextInput id="website" label="Website" aria-describedby="context" prefix="https://" suffix="/" helperText="Enter a domain." error="Enter a website." /></>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Project settings. https:// / Enter a domain. Enter a website.');
});

it('marks errors as invalid', () => {
  // arrange
  const given = <TextInput label="Project name" error="Enter a project name." />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toBeInvalid();
});

it('updates the native value when the user types', async () => {
  // arrange
  const user = userEvent.setup();
  render(<TextInput label="Project name" />);

  // act
  await user.type(screen.getByRole('textbox'), 'Website refresh');

  // assert
  expect(screen.getByRole('textbox')).toHaveValue('Website refresh');
});

it('keeps read-only text unchanged while typing', async () => {
  // arrange
  const user = userEvent.setup();
  render(<TextInput label="Project name" defaultValue="Website refresh" readOnly />);

  // act
  await user.type(screen.getByRole('textbox'), ' updated');

  // assert
  expect(screen.getByRole('textbox')).toHaveValue('Website refresh');
});

it('keeps disabled text unchanged while typing', async () => {
  // arrange
  const user = userEvent.setup();
  render(<TextInput label="Project name" defaultValue="Website refresh" disabled />);

  // act
  await user.type(screen.getByRole('textbox'), ' updated');

  // assert
  expect(screen.getByRole('textbox')).toHaveValue('Website refresh');
});

it('forwards the input ref for focus and selection', () => {
  // arrange
  const ref = createRef<HTMLInputElement>();
  render(<TextInput label="Project name" defaultValue="Website refresh" ref={ref} />);

  // act
  ref.current?.focus();

  // assert
  expect(screen.getByRole('textbox')).toHaveFocus();
});

it('hides the entire field when hidden', () => {
  // arrange
  const given = <TextInput label="Project name" hidden />;

  // act
  render(given);

  // assert
  expect(screen.getByText('Project name')).not.toBeVisible();
});
