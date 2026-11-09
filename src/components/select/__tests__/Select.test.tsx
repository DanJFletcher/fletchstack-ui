// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { expect, it, vi } from 'vitest';
import { Select } from '../../../index';

it('names the field using its visible label', () => {
  // arrange
  const given = <Select label="Workspace"><option value="personal">Personal</option></Select>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('combobox', { name: 'Workspace' })).toHaveValue('personal');
});

it('describes the field with its helper text', () => {
  // arrange
  const given = <Select label="Workspace" helperText="Choose where your project lives."><option>Personal</option></Select>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('combobox', { name: 'Workspace' })).toHaveAccessibleDescription('Choose where your project lives.');
});

it('links errors alongside helper and consumer descriptions', () => {
  // arrange
  const given = <><p id="context">Project settings.</p><Select id="workspace" label="Workspace" aria-describedby="context" helperText="Choose a workspace." error="Select a workspace."><option>Personal</option></Select></>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('combobox', { name: 'Workspace' })).toHaveAccessibleDescription('Project settings. Choose a workspace. Select a workspace.');
});

it('marks a field invalid when an error is supplied', () => {
  // arrange
  const given = <Select label="Workspace" error="Select a workspace."><option>Personal</option></Select>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('combobox', { name: 'Workspace' })).toBeInvalid();
});

it('shows an empty prompt until a choice is made', () => {
  // arrange
  const given = <Select label="Workspace" placeholder="Choose a workspace"><option value="personal">Personal</option></Select>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('combobox', { name: 'Workspace' })).toHaveValue('');
});

it('lets the user choose an enabled option', async () => {
  // arrange
  const user = userEvent.setup();
  render(<Select label="Workspace" placeholder="Choose a workspace"><option value="personal">Personal</option></Select>);

  // act
  await user.selectOptions(screen.getByRole('combobox', { name: 'Workspace' }), 'personal');

  // assert
  expect(screen.getByRole('combobox', { name: 'Workspace' })).toHaveValue('personal');
});

it('does not allow a disabled option to be selected', async () => {
  // arrange
  const user = userEvent.setup();
  render(<Select label="Workspace" defaultValue="personal"><option value="personal">Personal</option><option value="archived" disabled>Archived</option></Select>);

  // act
  await user.selectOptions(screen.getByRole('combobox', { name: 'Workspace' }), 'archived');

  // assert
  expect(screen.getByRole('combobox', { name: 'Workspace' })).toHaveValue('personal');
});

it('notifies the consumer when a controlled choice changes', async () => {
  // arrange
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Select label="Workspace" value="personal" onChange={onChange}><option value="personal">Personal</option><option value="design">Design team</option></Select>);

  // act
  await user.selectOptions(screen.getByRole('combobox', { name: 'Workspace' }), 'design');

  // assert
  expect(onChange).toHaveBeenCalledOnce();
});

it('forwards the native select ref', () => {
  // arrange
  const ref = createRef<HTMLSelectElement>();
  render(<Select label="Workspace" ref={ref}><option>Personal</option></Select>);

  // act
  ref.current?.focus();

  // assert
  expect(screen.getByRole('combobox', { name: 'Workspace' })).toHaveFocus();
});

it('hides the complete field when hidden', () => {
  // arrange
  const given = <Select label="Workspace" hidden><option>Personal</option></Select>;

  // act
  render(given);

  // assert
  expect(screen.getByText('Workspace')).not.toBeVisible();
});
