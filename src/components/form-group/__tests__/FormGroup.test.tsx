// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { FormGroup } from '../FormGroup';
import { Checkbox } from '../../checkbox/Checkbox';
import { TextInput } from '../../text-input/TextInput';
import { Select } from '../../select/Select';

it('names a native group using its legend', () => {
  // arrange
  const given = (
    <FormGroup legend="Notifications">
      <input aria-label="Email" />
    </FormGroup>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('group', { name: 'Notifications' }).tagName).toBe('FIELDSET');
});

it('links shared messages to composed controls without replacing local hints', () => {
  // arrange
  const given = (
    <>
      <p id="context">Settings.</p>
      <FormGroup
        id="channels"
        legend="Notifications"
        aria-describedby="context"
        description="Choose channels."
        helperText="Change later."
        error="Choose one."
      >
        {(props) => <Checkbox {...props} label="Email" description="Product news." />}
      </FormGroup>
    </>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
    'Settings. Choose channels. Change later. Choose one. Product news.',
  );
});

it('marks controls with a group error as invalid', () => {
  // arrange
  const given = (
    <FormGroup legend="Notifications" error="Choose one.">
      {(props) => <Checkbox {...props} label="Email" />}
    </FormGroup>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('checkbox')).toBeInvalid();
});

it('preserves an explicit invalid state without an error message', () => {
  // arrange
  const given = (
    <FormGroup legend="Contact" aria-invalid="spelling">
      {(props) => <TextInput {...props} label="Name" />}
    </FormGroup>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'spelling');
});

it('omits empty description references', () => {
  // arrange
  const given = (
    <FormGroup legend="Contact">{(props) => <TextInput {...props} label="Name" />}</FormGroup>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
});

it('disables all native descendant controls', () => {
  // arrange
  const given = (
    <FormGroup legend="Contact" disabled>
      <TextInput label="Name" />
      <Select label="Workspace">
        <option>Personal</option>
      </Select>
      <Checkbox label="Email" />
    </FormGroup>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toBeDisabled();
  expect(screen.getByRole('combobox')).toBeDisabled();
  expect(screen.getByRole('checkbox')).toBeDisabled();
});

it('retains native label activation inside the group', async () => {
  // arrange
  const user = userEvent.setup();
  render(
    <FormGroup legend="Notifications">
      <Checkbox label="Email" />
    </FormGroup>,
  );

  // act
  await user.click(screen.getByText('Email'));

  // assert
  expect(screen.getByRole('checkbox')).toBeChecked();
});

it('forwards the native fieldset reference', () => {
  // arrange
  const ref = createRef<HTMLFieldSetElement>();

  // act
  render(<FormGroup legend="Contact" ref={ref} />);

  // assert
  expect(ref.current).toBe(screen.getByRole('group'));
});

it('keeps generated descriptions unique across groups', () => {
  // arrange
  const given = (
    <>
      <FormGroup legend="First" helperText="First help." />
      <FormGroup legend="Second" helperText="Second help." />
    </>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('group', { name: 'First' })).toHaveAccessibleDescription('First help.');
  expect(screen.getByRole('group', { name: 'Second' })).toHaveAccessibleDescription('Second help.');
});

it('applies consumer attributes and semantic token overrides to the fieldset', () => {
  // arrange
  const given = (
    <FormGroup
      legend="Contact"
      className="custom"
      name="contact"
      style={{ '--fs-form-group-control-gap': '24px' }}
    />
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('group')).toHaveClass('custom');
  expect(screen.getByRole('group')).toHaveAttribute('name', 'contact');
  expect(screen.getByRole('group').style.getPropertyValue('--fs-form-group-control-gap')).toBe(
    '24px',
  );
});

it('keeps nested group descriptions independent', () => {
  // arrange
  const given = (
    <FormGroup legend="Outer" helperText="Outer help.">
      <FormGroup legend="Inner" description="Inner context.">
        {(props) => <TextInput {...props} label="Name" />}
      </FormGroup>
    </FormGroup>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Inner context.');
});
