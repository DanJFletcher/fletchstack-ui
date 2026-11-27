import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { Button } from '../../../../src/components/button/Button';
import {
  ButtonGroup,
  type ButtonGroupProps,
} from '../../../../src/components/button-group/ButtonGroup';
import { test } from '../../fixtures/browser';

it('renders deterministic native defaults on the server without affecting standalone Buttons', () => {
  // arrange
  const given = (
    <>
      <ButtonGroup aria-label="Actions">
        <Button>Save</Button>
        {false}
        {null}
      </ButtonGroup>
      <Button>Standalone</Button>
    </>
  );

  // act
  const result = renderToString(given);

  // assert
  expect(result).toBe(renderToString(given));
  expect(result).toContain('role="group"');
  expect(result.match(/fs-button--primary fs-button--medium/g)).toHaveLength(2);
  expect(result).not.toMatch(/disabled|tabindex|appearance=|orientation=| wrap=/);
});

it('preserves explicit child defaults, hidden state and native form attributes under group disabled', () => {
  // arrange
  const given = (
    <ButtonGroup
      aria-labelledby="actions"
      aria-label="Fallback"
      appearance="joined"
      orientation="vertical"
      align="end"
      wrap={false}
      equalWidth
      fullWidth
      disabled
      size="large"
      variant="secondary"
      className="consumer"
      style={{ '--fs-space-gap-actions': '20px' }}
    >
      <Button disabled={false} type="submit" form="editor" name="intent" value="save">
        Save
      </Button>
      <Button size="small" variant="ghost" hidden type="reset">
        Reset
      </Button>
    </ButtonGroup>
  );

  // act
  const result = renderToString(given);

  // assert
  expect(result).toContain(
    'fs-button-group--joined fs-button-group--vertical fs-button-group--align-end fs-button-group--full-width fs-button-group--equal-width consumer',
  );
  expect(result).toContain('--fs-space-gap-actions:20px');
  expect(result).toContain('fs-button--secondary fs-button--large');
  expect(result).toContain('fs-button--ghost fs-button--small');
  expect(result.match(/disabled=""/g)).toHaveLength(2);
  expect(result).toContain('form="editor"');
  expect(result).toContain('hidden=""');
  expect(result).toContain('type="reset"');
});

it('retains independently disabled children in an enabled group', () => {
  // arrange
  const given = (
    <ButtonGroup aria-label="Actions" disabled={false}>
      <Button disabled>Delete</Button>
      <Button disabled={false}>Save</Button>
    </ButtonGroup>
  );

  // act
  const result = renderToString(given);

  // assert
  expect(result.match(/disabled=""/g)).toHaveLength(1);
});

it('renders a conditionally empty named group', () => {
  // arrange
  const given = <ButtonGroup aria-label="Pending actions" />;

  // act
  const result = renderToString(given);

  // assert
  expect(result).toContain('></div>');
});

it.each([{}, { 'aria-label': '' }, { 'aria-label': ' ' }, { 'aria-labelledby': '' }])(
  'rejects missing server names %j',
  (name) => {
    // arrange
    const props = name as ButtonGroupProps;

    // act
    const act = () => renderToString(<ButtonGroup {...props} />);

    // assert
    expect(act).toThrow('ButtonGroup requires aria-label or aria-labelledby.');
  },
);

it.each([<span key="unsupported">Other</span>, 'Text'])(
  'rejects unsupported server children %j',
  (child) => {
    // arrange
    const given = <ButtonGroup aria-label="Actions">{child}</ButtonGroup>;

    // act
    const act = () => renderToString(given);

    // assert
    expect(act).toThrow('ButtonGroup supports direct Button children only.');
  },
);

test.for(['corporate', 'luna'])(
  '%s joined CSS has one seam and correct outer edges before hydration',
  async (theme, { page }) => {
    // arrange
    const css = (
      await Promise.all(
        [
          'src/generated/tokens.css',
          'src/components/button/button.css',
          'src/components/button-group/button-group.css',
        ].map((path) => readFile(path, 'utf8')),
      )
    ).join('\n');
    const markup = renderToString(
      <ButtonGroup aria-label="Actions" appearance="joined" variant="secondary">
        <Button hidden>Hidden</Button>
        <Button>Save</Button>
        <Button>Preview</Button>
        <Button>Publish</Button>
      </ButtonGroup>,
    );
    await page.setContent(
      `<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`,
    );

    // act
    const result = await page.locator('button:not([hidden])').evaluateAll((elements) =>
      elements.map((element) => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return {
          left: box.left,
          right: box.right,
          start: style.borderStartStartRadius,
          end: style.borderStartEndRadius,
          margin: style.marginInlineStart,
        };
      }),
    );

    // assert
    expect(result[0]!.start).toBe(theme === 'luna' ? '12px' : '4px');
    expect(result[0]!.end).toBe('0px');
    expect(result[1]!.start).toBe('0px');
    expect(result[1]!.left - result[0]!.right).toBe(-1);
    expect(result[2]!.left - result[1]!.right).toBe(-1);
    expect(result[2]!.end).toBe(theme === 'luna' ? '12px' : '4px');
    expect(await page.locator('script').count()).toBe(0);
  },
);
