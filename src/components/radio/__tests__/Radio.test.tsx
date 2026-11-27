// @vitest-environment jsdom
import '../../../../tests/support/dom';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Radio } from '../Radio';

it('names its native radio with a visible label', () => {
  // arrange
  const given = <Radio label="Standard delivery" />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('radio', { name: 'Standard delivery' })).toBeVisible();
});

it('selects an option when its description is clicked', async () => {
  // arrange
  const user = userEvent.setup();
  render(<Radio label="Standard" description="Arrives in 3–5 days." />);

  // act
  await user.click(screen.getByText('Arrives in 3–5 days.'));

  // assert
  expect(screen.getByRole('radio', { name: 'Standard' })).toBeChecked();
});

it('clears the previous selection within a named group', async () => {
  // arrange
  const user = userEvent.setup();
  render(
    <>
      <Radio label="Standard" name="delivery" defaultChecked />
      <Radio label="Express" name="delivery" />
    </>,
  );

  // act
  await user.click(screen.getByRole('radio', { name: 'Express' }));

  // assert
  expect(screen.getAllByRole('radio', { checked: true })).toEqual([
    screen.getByRole('radio', { name: 'Express' }),
  ]);
});

it('retains independent selection in different named groups', async () => {
  // arrange
  const user = userEvent.setup();
  render(
    <>
      <Radio label="Standard" name="delivery" defaultChecked />
      <Radio label="Personal" name="workspace" />
    </>,
  );

  // act
  await user.click(screen.getByRole('radio', { name: 'Personal' }));

  // assert
  expect(screen.getAllByRole('radio', { checked: true })).toHaveLength(2);
});

it('keeps a selected radio selected when clicked again', async () => {
  // arrange
  const user = userEvent.setup();
  render(<Radio label="Standard" defaultChecked />);

  // act
  await user.click(screen.getByRole('radio'));

  // assert
  expect(screen.getByRole('radio')).toBeChecked();
});

it('preserves consumer-controlled selection', async () => {
  // arrange
  const user = userEvent.setup();
  render(<ControlledRadio />);

  // act
  await user.click(screen.getByRole('radio', { name: 'Express' }));

  // assert
  expect(screen.getAllByRole('radio', { checked: true })).toEqual([
    screen.getByRole('radio', { name: 'Express' }),
  ]);
});

it('combines external context with local messages without changing the name', () => {
  // arrange
  const given = (
    <>
      <p id="context">Delivery settings.</p>
      <Radio
        id="standard"
        label="Standard"
        aria-describedby="context"
        aria-invalid={false}
        description="Arrives soon."
        error="Choose a delivery method."
      />
    </>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('radio', { name: 'Standard' })).toHaveAccessibleDescription(
    'Delivery settings. Arrives soon. Choose a delivery method.',
  );
  expect(screen.getByRole('radio')).toBeInvalid();
});

it('preserves an explicit invalid state without an error', () => {
  // arrange
  const given = <Radio label="Standard" aria-invalid="true" />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('radio')).toBeInvalid();
});

it('does not select a disabled option', async () => {
  // arrange
  const user = userEvent.setup();
  render(<Radio label="Unavailable" disabled />);

  // act
  await user.click(screen.getByText('Unavailable'));

  // assert
  expect(screen.getByRole('radio')).not.toBeChecked();
});

it('forwards the native input ref and consumer customization', () => {
  // arrange
  const ref = createRef<HTMLInputElement>();
  const given = (
    <Radio
      ref={ref}
      label="Standard"
      className="custom-input"
      wrapperClassName="custom-wrapper"
      style={{ '--fs-radio-dot-size': '8px' }}
      wrapperStyle={{ '--fs-radio-label-gap': '12px' }}
    />
  );

  // act
  const { container } = render(given);

  // assert
  expect(ref.current).toBe(screen.getByRole('radio'));
  expect(ref.current).toHaveClass('custom-input');
  expect(ref.current).toHaveStyle('--fs-radio-dot-size: 8px');
  expect(container.firstChild).toHaveClass('custom-wrapper');
  expect(container.firstChild).toHaveStyle('--fs-radio-label-gap: 12px');
});

it('gives repeated options distinct message relationships', () => {
  // arrange
  const given = (
    <>
      <Radio label="Standard" description="Slower." />
      <Radio label="Express" description="Faster." />
    </>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('radio', { name: 'Standard' })).toHaveAccessibleDescription('Slower.');
  expect(screen.getByRole('radio', { name: 'Express' })).toHaveAccessibleDescription('Faster.');
});

it('hides the complete option when hidden', () => {
  // arrange
  const given = <Radio label="Standard" description="Slower." error="Required." hidden />;

  // act
  render(given);

  // assert
  expect(screen.queryByRole('radio')).not.toBeInTheDocument();
});

/**
 * Let a consumer own the selected value using native change events.
 **/
function ControlledRadio() {
  const [value, setValue] = useState('standard');

  return (
    <>
      {['standard', 'express'].map((option) => (
        <Radio
          key={option}
          label={option === 'standard' ? 'Standard' : 'Express'}
          name="delivery"
          value={option}
          checked={value === option}
          onChange={(event) => setValue(event.target.value)}
        />
      ))}
    </>
  );
}
