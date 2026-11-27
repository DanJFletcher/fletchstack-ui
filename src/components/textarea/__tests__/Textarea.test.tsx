// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { act, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Textarea } from '../Textarea';

/**
 * Exercise a consumer that owns the textarea value through its change callback.
 **/
function ControlledTextarea() {
  const [value, setValue] = useState('');

  return (
    <Textarea
      label="Description"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      showCount
    />
  );
}

it('preserves consumer-controlled multiline edits with the counter enabled', async () => {
  // arrange
  const user = userEvent.setup();
  render(<ControlledTextarea />);

  // act
  await user.type(screen.getByRole('textbox'), 'Edited{Enter}summary');

  // assert
  expect(screen.getByRole('textbox')).toHaveValue('Edited\nsummary');
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('14');
});

it('names the native multiline control with a visible label', () => {
  // arrange
  const given = <Textarea label="Project description" />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox', { name: 'Project description' }).tagName).toBe('TEXTAREA');
});

it('keeps consumer context alongside helper text and errors', () => {
  // arrange
  const given = (
    <>
      <p id="context">Project settings.</p>
      <Textarea
        id="description"
        label="Description"
        aria-describedby="context"
        helperText="Describe the goals."
        error="Enter a description."
      />
    </>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
    'Project settings. Describe the goals. Enter a description.',
  );
});

it('gives an error precedence over an explicit valid state', () => {
  // arrange
  const given = <Textarea label="Description" error="Enter a description." aria-invalid={false} />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toBeInvalid();
});

it('inserts a newline with Enter', async () => {
  // arrange
  const user = userEvent.setup();
  render(<Textarea label="Description" />);

  // act
  await user.type(screen.getByRole('textbox'), 'First{Enter}Second');

  // assert
  expect(screen.getByRole('textbox')).toHaveValue('First\nSecond');
});

it('forwards the native textarea ref', () => {
  // arrange
  const ref = createRef<HTMLTextAreaElement>();

  // act
  render(<Textarea label="Description" ref={ref} />);

  // assert
  expect(ref.current).toBe(screen.getByRole('textbox'));
});

it.each([
  { maxLength: undefined, expected: '3' },
  { maxLength: 200, expected: '3 / 200' },
  { maxLength: 0, expected: '3 / 0' },
  { maxLength: -1, expected: '3' },
])('displays $expected for the supplied native limit', ({ maxLength, expected }) => {
  // arrange
  const given = <Textarea label="Description" defaultValue="ABC" maxLength={maxLength} showCount />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription(expected);
});

it('counts native UTF-16 code units', () => {
  // arrange
  const given = <Textarea label="Description" defaultValue="😀" showCount />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('2');
});

it('updates the uncontrolled count without swallowing the consumer change handler', async () => {
  // arrange
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Textarea label="Description" showCount onChange={onChange} />);

  // act
  await user.type(screen.getByRole('textbox'), 'Hello');

  // assert
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('5');
  expect(onChange).toHaveBeenCalledTimes(5);
});

it('updates the counter when the controlled value changes', () => {
  // arrange
  const { rerender } = render(<Textarea label="Description" value="First" readOnly showCount />);

  // act
  rerender(<Textarea label="Description" value="Updated" readOnly showCount />);

  // assert
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('7');
});

it('uses the current native value when defaultValue changes after editing', async () => {
  // arrange
  const user = userEvent.setup();
  const { rerender } = render(<Textarea label="Description" defaultValue="First" showCount />);
  await user.type(screen.getByRole('textbox'), '!');

  // act
  rerender(<Textarea label="Description" defaultValue="New default" showCount />);

  // assert
  expect(screen.getByRole('textbox')).toHaveValue('First!');
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('6');
});

it('restores the default count after a native form reset', async () => {
  // arrange
  const user = userEvent.setup();
  render(
    <form>
      <Textarea label="Description" defaultValue="First" showCount />
      <button type="reset">Reset</button>
    </form>,
  );
  await user.type(screen.getByRole('textbox'), '!');

  // act
  await user.click(screen.getByRole('button', { name: 'Reset' }));

  // assert
  expect(screen.getByRole('textbox')).toHaveValue('First');
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('5');
});

it('preserves the count when a consumer cancels form reset', async () => {
  // arrange
  const user = userEvent.setup();
  render(
    <form onReset={(event) => event.preventDefault()}>
      <Textarea label="Description" defaultValue="First" showCount />
      <button type="reset">Reset</button>
    </form>,
  );
  await user.type(screen.getByRole('textbox'), '!');

  // act
  await user.click(screen.getByRole('button', { name: 'Reset' }));

  // assert
  expect(screen.getByRole('textbox')).toHaveValue('First!');
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('6');
});

it('cleans up a reset observer when the textarea unmounts during reset', async () => {
  // arrange
  const { unmount } = render(
    <form onReset={() => unmount()}>
      <Textarea label="Description" showCount />
      <button type="reset">Reset</button>
    </form>,
  );
  const form = screen.getByRole('textbox').closest('form')!;

  // act
  await act(async () => {
    form.reset();
  });

  // assert
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});

it('observes a newly assigned external form owner', async () => {
  // arrange
  const user = userEvent.setup();
  const { rerender } = render(
    <>
      <form id="first" />
      <form id="second">
        <button type="reset">Reset second</button>
      </form>
      <Textarea label="Description" form="first" defaultValue="First" showCount />
    </>,
  );
  await user.type(screen.getByRole('textbox'), '!');
  rerender(
    <>
      <form id="first" />
      <form id="second">
        <button type="reset">Reset second</button>
      </form>
      <Textarea label="Description" form="second" defaultValue="First" showCount />
    </>,
  );

  // act
  await user.click(screen.getByRole('button', { name: 'Reset second' }));

  // assert
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('5');
});

it('does not change a read-only value', async () => {
  // arrange
  const user = userEvent.setup();
  render(<Textarea label="Description" readOnly defaultValue="First" showCount />);

  // act
  await user.type(screen.getByRole('textbox'), 'Changed');

  // assert
  expect(screen.getByRole('textbox')).toHaveValue('First');
});

it('preserves native disabled semantics', () => {
  // arrange
  const given = (
    <fieldset disabled>
      <Textarea label="Description" />
    </fieldset>
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toBeDisabled();
});

it('supports wrapper and control customization independently', () => {
  // arrange
  const given = (
    <Textarea
      label="Description"
      wrapperClassName="custom-wrapper"
      className="custom-control"
      wrapperStyle={{ '--fs-textarea-radius': '24px' }}
      style={{ resize: 'none' }}
      rows={8}
    />
  );

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toHaveClass('custom-control');
  expect(screen.getByRole('textbox')).toHaveAttribute('rows', '8');
  expect(screen.getByRole('textbox').parentElement).toHaveClass('custom-wrapper');
  expect(screen.getByRole('textbox')).toHaveStyle({ resize: 'none' });
});

it('supports hiding the complete field', () => {
  // arrange
  const given = <Textarea label="Description" helperText="Context." hidden showCount />;

  // act
  render(given);

  // assert
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
});
