// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { expect, it } from 'vitest';
import { FieldLabel, FieldDescription, FieldError } from '../FieldPrimitives';

it('connects the standalone native label to a control', () => {
  // arrange
  const given = <><FieldLabel htmlFor="name">Project name</FieldLabel><input id="name" /></>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('textbox')).toHaveAccessibleName('Project name');
});

it('forwards the native label ref and consumer attributes', () => {
  // arrange
  const ref = createRef<HTMLLabelElement>();
  const given = <FieldLabel ref={ref} htmlFor="name" className="custom-label" style={{ color: 'red' }}>Name</FieldLabel>;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByText('Name'));
  expect(ref.current).toHaveClass('custom-label');
  expect(ref.current).toHaveStyle({ color: 'rgb(255, 0, 0)' });
});

it.each([
  { Component: FieldDescription, as: 'p' as const, expected: 'P' },
  { Component: FieldDescription, as: 'span' as const, expected: 'SPAN' },
  { Component: FieldError, as: 'p' as const, expected: 'P' },
  { Component: FieldError, as: 'span' as const, expected: 'SPAN' },
])('renders $expected message content without changing its meaning', ({ Component, as, expected }) => {
  // arrange
  const ref = createRef<HTMLParagraphElement | HTMLSpanElement>();
  const given = <Component as={as} ref={ref} id="message" className="custom-message">Message</Component>;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByText('Message'));
  expect(ref.current?.tagName).toBe(expected);
  expect(ref.current).toHaveAttribute('id', 'message');
  expect(ref.current).toHaveClass('custom-message');
});

it('keeps inline descriptions inside a clickable checkbox label', async () => {
  // arrange
  const user = userEvent.setup();
  render(<FieldLabel htmlFor="email"><input id="email" type="checkbox" aria-describedby="email-help" />Email<FieldDescription as="span" id="email-help">Product news.</FieldDescription></FieldLabel>);

  // act
  await user.click(screen.getByText('Product news.'));

  // assert
  expect(screen.getByRole('checkbox')).toBeChecked();
});

it('does not add live announcements to error messages', () => {
  // arrange
  const given = <FieldError>Enter a name.</FieldError>;

  // act
  render(given);

  // assert
  expect(screen.getByText('Enter a name.')).not.toHaveAttribute('role');
  expect(screen.getByText('Enter a name.')).not.toHaveAttribute('aria-live');
});
