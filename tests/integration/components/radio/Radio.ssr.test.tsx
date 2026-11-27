// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { FormGroup } from '../../../../src/components/form-group/FormGroup';
import { Radio } from '../../../../src/components/radio/Radio';

it('hydrates consumer-owned selection with linked group errors', async () => {
  // arrange
  const user = userEvent.setup();
  const given = <ControlledGroup />;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);
  render(given, { container, hydrate: true });

  // act
  await user.click(screen.getByRole('radio', { name: 'Express' }));

  // assert
  expect(screen.getByRole('radio', { name: 'Express' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Standard' })).not.toBeChecked();
  expect(screen.getByRole('radio', { name: 'Express' })).toHaveAccessibleDescription(
    'Choose delivery.',
  );
});

it('preserves native successful values after resetting a group', async () => {
  // arrange
  const user = userEvent.setup();
  const form = createRef<HTMLFormElement>();
  render(
    <form ref={form}>
      <Radio label="Standard" name="delivery" value="standard" defaultChecked />
      <Radio label="Express" name="delivery" value="express" />
      <Radio label="Unavailable" name="other" value="disabled" defaultChecked disabled />
    </form>,
  );
  await user.click(screen.getByRole('radio', { name: 'Express' }));

  // act
  form.current!.reset();

  // assert
  expect([...new FormData(form.current!).entries()]).toEqual([['delivery', 'standard']]);
});

it('forwards refs and custom styles through the public family entrypoint', () => {
  // arrange
  const ref = createRef<HTMLInputElement>();
  const given = (
    <Radio
      label="Standard"
      id="standard"
      ref={ref}
      description="Arrives soon."
      error="Required."
      className="custom"
      wrapperClassName="wrapper"
      wrapperStyle={{ '--fs-radio-label-gap': '12px' }}
      style={{ '--fs-radio-control-size': '24px' }}
    />
  );

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByRole('radio', { name: 'Standard' }));
  expect(ref.current).toHaveAccessibleDescription('Arrives soon. Required.');
  expect(ref.current).toBeInvalid();
  expect(ref.current).toHaveClass('custom');
});

it.each(['corporate', 'luna'])('renders deterministic native radio markup for %s', (theme) => {
  // arrange
  const given = (
    <section data-theme={theme}>
      <Radio id="delivery" label="Delivery" defaultChecked disabled hidden />
    </section>
  );
  const expected = renderToString(given);

  // act
  const result = renderToString(given);

  // assert
  expect(result).toBe(expected);
  expect(result).toContain('type="radio"');
  expect(result).toContain('checked=""');
});

/**
 * Own group selection and associate each native option with its shared error.
 **/
function ControlledGroup() {
  const [value, setValue] = useState('standard');

  return (
    <FormGroup legend="Delivery method" error="Choose delivery.">
      {(control) => (
        <>
          <Radio
            {...control}
            label="Standard"
            name="delivery"
            value="standard"
            checked={value === 'standard'}
            onChange={(event) => setValue(event.target.value)}
          />
          <Radio
            {...control}
            label="Express"
            name="delivery"
            value="express"
            checked={value === 'express'}
            onChange={(event) => setValue(event.target.value)}
          />
        </>
      )}
    </FormGroup>
  );
}
