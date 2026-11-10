// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { FormGroup, Switch } from '../../../../src/index';

it('hydrates a controlled setting and retains its stable name after toggling', async () => {
  // arrange
  const user = userEvent.setup();
  const given = <ControlledSetting />;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);
  const onRecoverableError = vi.fn();
  render(given, { container, hydrate: true, onRecoverableError });

  // act
  await user.click(screen.getByRole('switch', { name: 'Notifications' }));

  // assert
  expect(screen.getByRole('switch', { name: 'Notifications' })).toBeChecked();
  expect(screen.getByRole('switch')).toHaveAccessibleDescription('Project settings. Receive updates.');
  expect(onRecoverableError).not.toHaveBeenCalled();
});

it('resets native settings to their initial successful form values', async () => {
  // arrange
  const user = userEvent.setup();
  const form = createRef<HTMLFormElement>();
  render(<form ref={form}><Switch label="Email" name="notifications" value="email" defaultChecked /><Switch label="Push" name="notifications" value="push" /><Switch label="Unavailable" name="notifications" value="disabled" disabled defaultChecked /></form>);
  await user.click(screen.getByRole('switch', { name: 'Push' }));

  // act
  form.current!.reset();

  // assert
  expect([...new FormData(form.current!).entries()]).toEqual([['notifications', 'email']]);
});

it('exposes the native input ref through the package API', () => {
  // arrange
  const ref = createRef<HTMLInputElement>();
  const given = <Switch ref={ref} id="notifications" label="Notifications" description="Receive updates." className="custom" wrapperClassName="wrapper" wrapperStyle={{ '--fs-switch-label-gap': '12px' }} style={{ '--fs-switch-track-width': '48px' }} />;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByRole('switch', { name: 'Notifications' }));
  expect(ref.current).toHaveClass('custom');
  expect(ref.current).toHaveAccessibleDescription('Receive updates.');
});

it('server renders a disabled hidden on-state without client state synchronization', () => {
  // arrange
  const given = <Switch id="notifications" label="Notifications" disabled hidden defaultChecked />;

  // act
  const result = renderToString(given);

  // assert
  expect(result).toContain('role="switch"');
  expect(result).toContain('checked=""');
  expect(result).toContain('disabled=""');
  expect(result).toContain('hidden=""');
});

/**
 * Own checked state in a real consumer while sharing group description relationships.
 **/
function ControlledSetting() {
  const [checked, setChecked] = useState(false);

  return <FormGroup legend="Settings" description="Project settings.">{control => <Switch {...control} label="Notifications" description="Receive updates." checked={checked} onChange={event => setChecked(event.target.checked)} />}</FormGroup>;
}
