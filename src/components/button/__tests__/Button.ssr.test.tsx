// @vitest-environment node
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button, type ButtonProps } from '../Button';

describe('Button server rendering', () => {
  it('runs without browser globals', () => {
    // arrange
    const expected = { document: 'undefined', window: 'undefined' };

    // act
    const result = { document: typeof document, window: typeof window };

    // assert
    expect(result).toEqual(expected);
  });

  it('renders a native button containing the label', () => {
    // arrange
    const given = createElement(Button, null, 'Save changes');

    // act
    const result = renderToStaticMarkup(given);

    // assert
    expect(result).toMatch(/^<button\b[^>]*>Save changes<\/button>$/);
  });

  it('produces identical initial HTML on repeated renders', () => {
    // arrange
    const given = createElement(Button, null, 'Save changes');
    // This baseline tests repeatability rather than fixing a serialized class order.
    const expected = renderToStaticMarkup(given);

    // act
    const result = renderToStaticMarkup(given);

    // assert
    expect(result).toBe(expected);
  });

  it.each<{ name: string; props: ButtonProps; expected: string }>([
    { name: 'the default non-submitting type', props: {}, expected: 'type="button"' },
    { name: 'an explicit ordinary type', props: { type: 'button' }, expected: 'type="button"' },
    { name: 'an explicit submit type', props: { type: 'submit' }, expected: 'type="submit"' },
    { name: 'an explicit reset type', props: { type: 'reset' }, expected: 'type="reset"' },
    { name: 'disabled state', props: { disabled: true }, expected: 'disabled=""' },
    { name: 'hidden state', props: { hidden: true }, expected: 'hidden=""' },
    { name: 'an accessible name', props: { 'aria-label': 'Save settings' }, expected: 'aria-label="Save settings"' },
    { name: 'native form association', props: { form: 'preferences' }, expected: 'form="preferences"' },
    { name: 'a semantic style override', props: { style: { '--fs-button-radius': '0px' } }, expected: '--fs-button-radius:0px' },
  ])('includes $name before hydration', ({ props, expected }) => {
    // arrange
    const given = createElement(Button, props, 'Save changes');

    // act
    const result = renderToStaticMarkup(given);

    // assert
    expect(result).toContain(expected);
  });

  it('omits disabled state when explicitly enabled', () => {
    // arrange
    const given = createElement(Button, { disabled: false }, 'Save changes');

    // act
    const result = renderToStaticMarkup(given);

    // assert
    expect(result).not.toMatch(/\sdisabled(?:=|\s|>)/);
  });
});
