// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { Field } from '../../../index';

it('associates its visible label with a consumer-owned native control', () => {
  // arrange
  const given = <Field label="Notes">{props => <textarea {...props} />}</Field>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveAttribute('id');
});

it('keeps consumer context before helper and error messages', () => {
  // arrange
  const given = <><p id="context">Project settings.</p><p id="units">Characters.</p><Field id="notes" label="Notes" aria-describedby="context" descriptionIds={['units']} helperText="Keep it short." error="Enter notes.">{props => <textarea {...props} />}</Field></>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Project settings. Characters. Keep it short. Enter notes.');
});

it('gives an error precedence over an explicit valid state', () => {
  // arrange
  const given = <Field label="Notes" error="Enter notes." aria-invalid={false}>{props => <textarea {...props} />}</Field>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
});

it('preserves the consumer invalid state without a message', () => {
  // arrange
  const given = <Field label="Notes" aria-invalid="grammar">{props => <textarea {...props} />}</Field>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'grammar');
});

it('omits references for empty messages', () => {
  // arrange
  const given = <Field label="Notes" helperText="" error="">{props => <textarea {...props} />}</Field>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
});

it('forwards its wrapper reference and native attributes', () => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const given = <Field ref={ref} label="Notes" className="custom-field" title="Context" style={{ '--fs-field-gap': '24px' }}>{props => <textarea {...props} />}</Field>;

  // act
  render(given);

  // assert
  expect(ref.current).toHaveClass('custom-field');
  expect(ref.current).toHaveAttribute('title', 'Context');
  expect(ref.current?.style.getPropertyValue('--fs-field-gap')).toBe('24px');
});

it('preserves hidden wrapper behavior', () => {
  // arrange
  const given = <Field label="Notes" hidden>{props => <textarea {...props} />}</Field>;

  // act
  render(given);

  // assert
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});

it('isolates generated message references between fields', () => {
  // arrange
  const given = <><Field label="First" helperText="First hint.">{props => <input {...props} />}</Field><Field label="Second" helperText="Second hint.">{props => <input {...props} />}</Field></>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox', { name: 'First' })).toHaveAccessibleDescription('First hint.');
  expect(screen.getByRole('textbox', { name: 'Second' })).toHaveAccessibleDescription('Second hint.');
});

it('retains native label clicking behavior', async () => {
  // arrange
  const user = userEvent.setup();
  render(<Field label="Notes">{props => <textarea {...props} />}</Field>);

  // act
  await user.click(screen.getByText('Notes'));

  // assert
  expect(screen.getByRole('textbox')).toHaveFocus();
});

it('allows each message and label slot to be styled', () => {
  // arrange
  const given = <Field label="Notes" helperText="Keep it short." error="Enter notes." classNames={{ label: 'label-slot', helper: 'hint-slot', error: 'error-slot' }}>{props => <textarea {...props} />}</Field>;

  // act
  render(given);

  // assert
  expect(screen.getByText('Notes')).toHaveClass('label-slot');
  expect(screen.getByText('Keep it short.')).toHaveClass('hint-slot');
  expect(screen.getByText('Enter notes.')).toHaveClass('error-slot');
});
