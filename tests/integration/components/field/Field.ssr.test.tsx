import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { Field } from '../../../../src/components/field/Field';
import {
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../../../../src/components/field/FieldPrimitives';

test.for([
  { theme: 'corporate', expected: 'rgb(180, 35, 24)' },
  { theme: 'luna', expected: 'rgb(255, 180, 171)' },
])(
  'Field server rendering exposes the $theme message palette before hydration',
  async ({ theme, expected }, { page }) => {
    // arrange
    const css = (
      await Promise.all(
        ['src/generated/tokens.css', 'src/components/field/field.css'].map((path) =>
          readFile(path, 'utf8'),
        ),
      )
    ).join('\n');
    const markup = renderToString(
      <>
        <p id="context">Settings.</p>
        <Field
          id="notes"
          label="Notes"
          aria-describedby="context"
          descriptionIds={['context']}
          helperText="Keep it short."
          error="Enter notes."
          className="custom"
          classNames={{ label: 'label', helper: 'helper', error: 'error' }}
        >
          {(props) => <textarea {...props} />}
        </Field>
        <Field label="Empty" aria-invalid={false}>
          {(props) => <input {...props} />}
        </Field>
        <Field label="Hint only" helperText="Hint.">
          {(props) => <input {...props} />}
        </Field>
        <Field label="Error only" error="Error.">
          {(props) => <input {...props} />}
        </Field>
        <FieldLabel htmlFor="standalone">Standalone</FieldLabel>
        <input id="standalone" />
        <FieldDescription>Paragraph description.</FieldDescription>
        <FieldDescription as="span" className="inline-description">
          Inline description.
        </FieldDescription>
        <FieldError as="span" className="inline-error">
          Inline error.
        </FieldError>
      </>,
    );
    await page.setContent(
      `<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`,
    );

    // act
    const result = await page
      .getByText('Enter notes.')
      .evaluate((element) => getComputedStyle(element).color);

    // assert
    expect(result).toBe(expected);
  },
);

test('server-rendered Field provides native label behavior and message relationships', async ({
  page,
}) => {
  // arrange
  const markup = renderToString(
    <Field label="Notes" helperText="Keep it short." error="Enter notes.">
      {(props) => <textarea {...props} />}
    </Field>,
  );
  await page.setContent(markup);

  // act
  await page.getByText('Notes', { exact: true }).click();

  // assert
  expect(
    await page
      .getByRole('textbox', { name: 'Notes' })
      .evaluate((element) => element === document.activeElement),
  ).toBe(true);
  expect(await page.getByRole('textbox').getAttribute('aria-invalid')).toBe('true');
});
