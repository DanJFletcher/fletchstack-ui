// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, it } from 'vitest';
import { Text, type TextStyle } from '../Text';

it('defaults to body copy in a native paragraph', () => {
  // arrange
  const given = <Text>Manage your workspace.</Text>;

  // act
  render(given);

  // assert
  expect(screen.getByText('Manage your workspace.').tagName).toBe('P');
  expect(screen.getByText('Manage your workspace.')).toHaveClass(
    'fs-text--body',
    'fs-text--default',
  );
});

it.each(['lead', 'body', 'small'] as const)(
  'supports %s text without changing semantics',
  (size) => {
    // arrange
    const given = <Text size={size}>Description</Text>;

    // act
    render(given);

    // assert
    expect(screen.getByText('Description')).toHaveClass(`fs-text--${size}`);
    expect(screen.getByText('Description').tagName).toBe('P');
  },
);

it('supports an inline span with a native ref and muted tone', () => {
  // arrange
  const ref = createRef<HTMLSpanElement>();
  const given = (
    <p>
      Saved{' '}
      <Text as="span" tone="muted" ref={ref}>
        yesterday
      </Text>
      .
    </p>
  );

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByText('yesterday'));
  expect(ref.current?.tagName).toBe('SPAN');
  expect(ref.current).toHaveClass('fs-text--muted');
});

it('preserves native paragraph refs, attributes, classes and typed overrides', () => {
  // arrange
  const ref = createRef<HTMLParagraphElement>();
  const style: TextStyle = { '--fs-typography-text-font-body': '1.25rem' };
  const given = (
    <Text id="summary" dir="rtl" className="consumer" ref={ref} style={style}>
      <strong>Project</strong> summary
    </Text>
  );

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByText(/summary/));
  expect(ref.current).toHaveAttribute('id', 'summary');
  expect(ref.current).toHaveAttribute('dir', 'rtl');
  expect(ref.current).toHaveClass('consumer');
  expect(ref.current?.style.getPropertyValue('--fs-typography-text-font-body')).toBe('1.25rem');
});
