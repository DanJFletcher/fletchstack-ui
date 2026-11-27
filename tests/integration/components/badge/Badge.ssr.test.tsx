import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { Badge } from '../../../../src/components/badge/Badge';
import { CheckIcon } from '../../../../src/components/icon/named/CheckIcon';

test.for(['corporate', 'luna'])(
  'server-rendered %s badges retain standalone geometry when Icon CSS loads last',
  async (theme, { page }) => {
    // arrange
    const css = (
      await Promise.all(
        [
          'src/generated/tokens.css',
          'src/components/badge/badge.css',
          'src/components/icon/icon.css',
        ].map((path) => readFile(path, 'utf8')),
      )
    ).join('\n');
    const markup = renderToString(
      <Badge icon={<CheckIcon />} tone="success" style={{ '--fs-badge-icon-size': '16px' }}>
        Published
      </Badge>,
    );
    await page.setContent(
      `<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`,
    );

    // act
    const result = await page.locator('.fs-badge').evaluate((element) => ({
      size: getComputedStyle(element).fontSize,
      height: getComputedStyle(element).minHeight,
      icon: getComputedStyle(element.querySelector('svg')!).width,
    }));

    // assert
    expect(result).toEqual({ size: '12px', height: '20px', icon: '16px' });
    expect(await page.getByText('Published').textContent()).toBe('Published');
  },
);
