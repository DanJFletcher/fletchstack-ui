import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { AvatarGroup } from '../../../../src/components/avatar-group/AvatarGroup';

const members = [
  { id: 'a', name: 'Alex Example' },
  { id: 'b', name: 'Blair Sample' },
  { id: 'c', name: 'Casey Demo' },
  { id: 'd', name: 'Drew Example' },
];

test.for(['corporate', 'luna'])(
  'server-rendered %s disclosure works without hydration',
  async (theme, { page }) => {
    const css = (
      await Promise.all(
        [
          'src/generated/tokens.css',
          'src/components/avatar/avatar.css',
          'src/components/avatar-group/avatar-group.css',
        ].map((path) => readFile(path, 'utf8')),
      )
    ).join('\n');
    const markup = renderToString(<AvatarGroup label="Editors" members={members} />);
    await page.setContent(
      `<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`,
    );
    const summary = page.getByLabel('Show 1 more member');
    await expect
      .poll(() => summary.evaluate((element) => element.getBoundingClientRect().width))
      .toBe(32);
    await expect.poll(() => page.getByRole('list').isVisible()).toBe(false);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    expect(await page.getByRole('list', { name: 'Additional team members' }).isVisible()).toBe(
      true,
    );
    expect(await page.getByText('Drew Example').isVisible()).toBe(true);
    expect(await page.getByRole('img').count()).toBe(3);
  },
);
