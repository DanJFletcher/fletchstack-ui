// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { createRef, useState } from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Switch } from '../Switch';

it('exposes a named off switch', () => {
  // arrange
  const given = <Switch label="Email notifications" />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('switch', { name: 'Email notifications' })).not.toBeChecked();
});

it('toggles through its visible label without changing its name', async () => {
  // arrange
  const user = userEvent.setup();
  render(<Switch label="Email notifications" />);

  // act
  await user.click(screen.getByText('Email notifications'));

  // assert
  expect(screen.getByRole('switch', { name: 'Email notifications' })).toBeChecked();
});

it('turns an initially on setting off', async () => {
  // arrange
  const user = userEvent.setup();
  render(<Switch label="Notifications" defaultChecked />);

  // act
  await user.click(screen.getByRole('switch'));

  // assert
  expect(screen.getByRole('switch', { name: 'Notifications' })).not.toBeChecked();
});

it('toggles through its clickable description', async () => {
  // arrange
  const user = userEvent.setup();
  render(<Switch label="Notifications" description="Receive project updates." />);

  // act
  await user.click(screen.getByText('Receive project updates.'));

  // assert
  expect(screen.getByRole('switch', { name: 'Notifications' })).toBeChecked();
});

it('updates consumer-controlled state through native changes', async () => {
  // arrange
  const user = userEvent.setup();
  render(<ControlledSwitch />);

  // act
  await user.click(screen.getByRole('switch'));

  // assert
  expect(screen.getByRole('switch', { name: 'Notifications' })).toBeChecked();
});

it.each([false, true])(
  'preserves a disabled setting with initial checked state %s',
  async (checked) => {
    // arrange
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Notifications" disabled defaultChecked={checked} onChange={onChange} />);

    // act
    await user.click(screen.getByText('Notifications'));

    // assert
    expect(screen.getByRole('switch')).toHaveProperty('checked', checked);
    expect(onChange).not.toHaveBeenCalled();
  },
);

it('links local description after existing context without changing its name', () => {
  // arrange
  const given = (
    <>
      <p id="context">Project settings.</p>
      <Switch
        label="Notifications"
        id="notifications"
        description="Receive project updates."
        aria-describedby="context"
      />
    </>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('switch', { name: 'Notifications' })).toHaveAccessibleDescription(
    'Project settings. Receive project updates.',
  );
});

it('keeps descriptions instance-specific', () => {
  // arrange
  const given = (
    <>
      <Switch label="Email" description="Email updates." />
      <Switch label="Push" description="Push updates." />
    </>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('switch', { name: 'Email' })).toHaveAccessibleDescription(
    'Email updates.',
  );
  expect(screen.getByRole('switch', { name: 'Push' })).toHaveAccessibleDescription('Push updates.');
});

it('forwards native refs and scoped consumer styles', () => {
  // arrange
  const ref = createRef<HTMLInputElement>();
  const given = (
    <Switch
      ref={ref}
      label="Notifications"
      className="custom"
      wrapperClassName="custom-wrapper"
      style={{ '--fs-switch-thumb-size': '18px' }}
      wrapperStyle={{ '--fs-switch-label-gap': '12px' }}
    />
  );

  // act
  const { container } = render(given);

  // assert
  expect(ref.current).toBe(screen.getByRole('switch'));
  expect(ref.current).toHaveClass('custom');
  expect(ref.current).toHaveStyle('--fs-switch-thumb-size: 18px');
  expect(container.firstChild).toHaveClass('custom-wrapper');
  expect(container.firstChild).toHaveStyle('--fs-switch-label-gap: 12px');
});

it('hides its complete label and description when hidden', () => {
  // arrange
  const given = <Switch label="Notifications" description="Receive updates." hidden />;

  // act
  render(given);

  // assert
  expect(screen.queryByRole('switch')).not.toBeInTheDocument();
});

/**
 * Let a consumer own the on/off setting through native change events.
 **/
function ControlledSwitch() {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      label="Notifications"
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}
