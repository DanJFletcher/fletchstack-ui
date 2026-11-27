import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { AspectRatio } from '../../../../src/components/aspect-ratio/AspectRatio';

test('server-rendered frames preserve ratios despite oversized intrinsic children before hydration', async ({
  page,
}) => {
  // arrange
  const css = await readFile('src/components/aspect-ratio/aspect-ratio.css', 'utf8');
  const markup = renderToString(
    <div>
      {[1, 16 / 9, 3 / 4, 2.4].map((ratio) => (
        <div key={ratio} style={{ width: '240px' }}>
          <AspectRatio ratio={ratio}>
            <img
              alt="Synthetic artwork"
              width="1000"
              height="1000"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'/%3E"
            />
          </AspectRatio>
        </div>
      ))}
    </div>,
  );
  await page.setContent(
    `<!doctype html><html lang="en"><head><style>${css}</style></head><body>${markup}</body></html>`,
  );

  // act
  const result = await page.locator('.fs-aspect-ratio').evaluateAll((elements) =>
    elements.map((element) => ({
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
      overflow: getComputedStyle(element).overflow,
    })),
  );

  // assert
  expect(result).toEqual([
    { width: 240, height: 240, overflow: 'visible' },
    { width: 240, height: 135, overflow: 'visible' },
    { width: 240, height: 320, overflow: 'visible' },
    { width: 240, height: 100, overflow: 'visible' },
  ]);
});

test('empty frames derive height from a narrow or zero-width parent without child layout', async ({
  page,
}) => {
  // arrange
  const css = await readFile('src/components/aspect-ratio/aspect-ratio.css', 'utf8');
  const markup = renderToString(
    <div>
      <div style={{ width: '160px' }}>
        <AspectRatio />
      </div>
      <div style={{ width: 0 }}>
        <AspectRatio />
      </div>
    </div>,
  );
  await page.setContent(
    `<!doctype html><html lang="en"><head><style>${css}</style></head><body>${markup}</body></html>`,
  );

  // act
  const result = await page.locator('.fs-aspect-ratio').evaluateAll((elements) =>
    elements.map((element) => ({
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
    })),
  );

  // assert
  expect(result).toEqual([
    { width: 160, height: 90 },
    { width: 0, height: 0 },
  ]);
});

test('frames resist block-axis stretching in flex and grid parents', async ({ page }) => {
  // arrange
  const css = await readFile('src/components/aspect-ratio/aspect-ratio.css', 'utf8');
  const markup = renderToString(
    <div>
      <div style={{ display: 'flex', width: '300px' }}>
        <div style={{ flex: '0 0 100px', height: '500px' }} />
        <AspectRatio style={{ flex: '1 1 0%' }} />
      </div>
      <div style={{ display: 'grid', width: '200px', height: '500px' }}>
        <AspectRatio />
      </div>
    </div>,
  );
  await page.setContent(
    `<!doctype html><html lang="en"><head><style>${css}</style></head><body>${markup}</body></html>`,
  );

  // act
  const result = await page.locator('.fs-aspect-ratio').evaluateAll((elements) =>
    elements.map((element) => ({
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
    })),
  );

  // assert
  expect(result).toEqual([
    { width: 200, height: 112.5 },
    { width: 200, height: 112.5 },
  ]);
});
