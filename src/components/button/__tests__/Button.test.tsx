// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button, type ButtonProps } from '../../../index';

describe('Button', () => {
  it('uses its visible label as the accessible name', () => {
    // arrange
    const given = <Button>Save changes</Button>;

    // act
    render(given);

    // assert
    const result = screen.getByRole('button', { name: 'Save changes' });
    expect(result).toHaveAccessibleName('Save changes');
  });

  it('uses an explicit accessible name for an icon-only action', () => {
    // arrange
    const given = <Button aria-label="Add item"><span aria-hidden="true">+</span></Button>;

    // act
    render(given);

    // assert
    const result = screen.getByRole('button', { name: 'Add item' });
    expect(result).toHaveAccessibleName('Add item');
  });

  it('lets an explicit accessible name override the visible label', () => {
    // arrange
    const given = <Button aria-label="Save settings">Save</Button>;

    // act
    render(given);

    // assert
    const result = screen.getByRole('button', { name: 'Save settings' });
    expect(result).toHaveAccessibleName('Save settings');
  });

  it('excludes decorative children from the composed label', () => {
    // arrange
    const given = <Button><span aria-hidden="true">✓</span><span>Save changes</span></Button>;

    // act
    render(given);

    // assert
    const result = screen.getByRole('button', { name: 'Save changes' });
    expect(result).toHaveAccessibleName('Save changes');
  });
});

describe('Button native attributes', () => {
  it.each<{ name: string; props: ButtonProps; expected: string }>([
    { name: 'defaults to a non-submitting action', props: {}, expected: 'button' },
    { name: 'accepts an explicit ordinary action', props: { type: 'button' }, expected: 'button' },
    { name: 'accepts an explicit submit action', props: { type: 'submit' }, expected: 'submit' },
    { name: 'accepts an explicit reset action', props: { type: 'reset' }, expected: 'reset' },
  ])('$name', ({ props, expected }) => {
    // arrange
    const given = <Button {...props}>Save changes</Button>;

    // act
    render(given);

    // assert
    const result = screen.getByRole('button', { name: 'Save changes' });
    expect(result).toHaveAttribute('type', expected);
  });

  it.each([
    { name: 'is enabled by default', props: {} },
    { name: 'is enabled when disabled is explicitly false', props: { disabled: false } },
  ])('$name', ({ props }) => {
    // arrange
    const given = <Button {...props}>Save changes</Button>;

    // act
    render(given);

    // assert
    const result = screen.getByRole('button', { name: 'Save changes' });
    expect(result).toBeEnabled();
  });

  it('exposes the native disabled state', () => {
    // arrange
    const given = <Button disabled>Save changes</Button>;

    // act
    render(given);

    // assert
    const result = screen.getByRole('button', { name: 'Save changes' });
    expect(result).toBeDisabled();
  });

  it('forwards the native hidden attribute', () => {
    // arrange
    const given = <Button hidden>Save changes</Button>;

    // act
    render(given);

    // assert
    // A hidden element has no accessible name; opt in only to inspect its attribute.
    const result = screen.getByRole('button', { hidden: true });
    expect(result).toHaveAttribute('hidden');
  });

  it('associates with a form outside its parent', () => {
    // arrange
    const given = <><form id="preferences" aria-label="Preferences" /><Button form="preferences">Save changes</Button></>;

    // act
    render(given);

    // assert
    const result = screen.getByRole<HTMLButtonElement>('button', { name: 'Save changes' });
    expect(result.form).toBe(screen.getByRole('form', { name: 'Preferences' }));
  });
});

describe('Button consumer customization', () => {
  it('retains component classes alongside a consumer class', () => {
    // arrange
    const given = <Button className="save-action">Save changes</Button>;

    // act
    render(given);

    // assert
    const result = screen.getByRole('button', { name: 'Save changes' });
    expect(result).toHaveClass('save-action', 'fs-button', 'fs-button--primary', 'fs-button--medium');
  });

  it('forwards a conventional inline style', () => {
    // arrange
    const given = <Button style={{ color: 'red' }}>Save changes</Button>;

    // act
    render(given);

    // assert
    const result = screen.getByRole('button', { name: 'Save changes' }).style.color;
    expect(result).toBe('red');
  });

  it('forwards a semantic custom property without altering its unit', () => {
    // arrange
    const given = <Button style={{ '--fs-button-radius': '0px' }}>Save changes</Button>;

    // act
    render(given);

    // assert
    const result = screen.getByRole('button', { name: 'Save changes' }).style.getPropertyValue('--fs-button-radius');
    expect(result).toBe('0px');
  });
});

describe('Button styling hooks', () => {
  it('selects primary medium styling by default', () => {
    // arrange
    const given = <Button>Save changes</Button>;

    // act
    render(given);

    // assert
    const result = screen.getByRole('button', { name: 'Save changes' });
    expect(result).toHaveClass('fs-button fs-button--primary fs-button--medium', { exact: true });
  });

  it.each([
    { variant: 'primary', expected: 'fs-button fs-button--primary fs-button--medium' },
    { variant: 'secondary', expected: 'fs-button fs-button--secondary fs-button--medium' },
    { variant: 'ghost', expected: 'fs-button fs-button--ghost fs-button--medium' },
  ] as const)('selects styling for the $variant variant', ({ variant, expected }) => {
    // arrange
    const given = <Button variant={variant}>Save changes</Button>;

    // act
    render(given);

    // assert
    const result = screen.getByRole('button', { name: 'Save changes' });
    expect(result).toHaveClass(expected, { exact: true });
  });

  it.each([
    { size: 'small', expected: 'fs-button fs-button--primary fs-button--small' },
    { size: 'medium', expected: 'fs-button fs-button--primary fs-button--medium' },
    { size: 'large', expected: 'fs-button fs-button--primary fs-button--large' },
  ] as const)('selects styling for the $size size', ({ size, expected }) => {
    // arrange
    const given = <Button size={size}>Save changes</Button>;

    // act
    render(given);

    // assert
    const result = screen.getByRole('button', { name: 'Save changes' });
    expect(result).toHaveClass(expected, { exact: true });
  });
});

describe('Button interactions', () => {
  it('forwards a user click to the consumer handler', async () => {
    // arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save changes</Button>);

    // act
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    // assert
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not activate a disabled action', async () => {
    // arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Save changes</Button>);

    // act
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    // assert
    expect(onClick).not.toHaveBeenCalled();
  });

  it('lets a consumer focus the native button through its ref', () => {
    // arrange
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save changes</Button>);

    // act
    ref.current?.focus();

    // assert
    const result = screen.getByRole('button', { name: 'Save changes' });
    expect(result).toHaveFocus();
  });

  it('becomes disabled when its props are updated', () => {
    // arrange
    const { rerender } = render(<Button>Save changes</Button>);

    // act
    rerender(<Button disabled>Save changes</Button>);

    // assert
    const result = screen.getByRole('button', { name: 'Save changes' });
    expect(result).toBeDisabled();
  });

  it('ignores activation after becoming disabled', async () => {
    // arrange
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Save changes</Button>);
    rerender(<Button disabled onClick={onClick}>Save changes</Button>);

    // act
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    // assert
    expect(onClick).not.toHaveBeenCalled();
  });
});
