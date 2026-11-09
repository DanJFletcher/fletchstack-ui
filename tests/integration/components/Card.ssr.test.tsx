import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../fixtures/browser';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle } from '../../../src';

test.for([
  { theme: 'corporate', surface: 'rgb(255, 255, 255)' },
  { theme: 'luna', surface: 'rgb(17, 19, 41)' },
])('server-rendered cards use the $theme contract before hydration', async ({ theme, surface }, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/card.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<><Card aria-label="Default collection" role="group"><CardHeader><CardTitle>Default collection</CardTitle></CardHeader><CardFooter>Metadata</CardFooter></Card><Card as="article" aria-labelledby="collection" variant="outlined" padding="large" orientation="horizontal" className="collection"><CardMedia>Preview</CardMedia><CardContent><CardTitle as="h3" id="collection">Collection</CardTitle><CardDescription>Shared components</CardDescription><CardFooter divided>Collection details</CardFooter></CardContent></Card></>);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);
  const expected = surface;

  // act
  const result = await page.getByRole('article', { name: 'Collection' }).evaluate(element => getComputedStyle(element).backgroundColor);

  // assert
  expect(result).toBe(expected);
  expect(await page.getByRole('heading', { name: 'Collection', level: 3 }).textContent()).toBe('Collection');
});
