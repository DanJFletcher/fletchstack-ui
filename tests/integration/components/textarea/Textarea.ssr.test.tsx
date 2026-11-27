import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { Textarea } from '../../../../src/components/textarea/Textarea';

test.for([
  { theme: 'corporate', expected: 'rgb(255, 255, 255)' },
  { theme: 'luna', expected: 'rgb(17, 19, 41)' },
])(
  'server-rendered Textarea uses the $theme surface before hydration',
  async ({ theme, expected }, { page }) => {
    // arrange
    const css = (
      await Promise.all(
        ['src/generated/tokens.css', 'src/components/textarea/textarea.css'].map((path) =>
          readFile(path, 'utf8'),
        ),
      )
    ).join('\n');
    const markup = renderToString(
      <>
        <Textarea label="Description" />
        <p id="context">Project settings.</p>
        <Textarea
          id="summary"
          label="Summary"
          defaultValue="Hello"
          showCount
          maxLength={200}
          helperText="Keep it short."
          error="Enter a summary."
          aria-describedby="context"
          className="custom"
          wrapperClassName="custom-field"
        />
        <Textarea label="Controlled" value="First" readOnly showCount />
        <Textarea label="Unlimited" defaultValue="ABC" showCount />
        <Textarea label="Ignored limit" showCount maxLength={-1} />
        <Textarea label="Unavailable" disabled />
        <Textarea label="Custom rows" rows={8} />
      </>,
    );
    await page.setContent(
      `<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`,
    );

    // act
    const result = await page
      .getByRole('textbox', { name: 'Description' })
      .evaluate((element) => getComputedStyle(element).backgroundColor);

    // assert
    expect(result).toBe(expected);
  },
);
