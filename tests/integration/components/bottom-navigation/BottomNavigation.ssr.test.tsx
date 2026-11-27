import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { BottomNavigation } from '../../../../src/components/bottom-navigation/BottomNavigation';
import { AppShell } from '../../../../src/components/app-shell/AppShell';
import { AppContent } from '../../../../src/components/app-content/AppContent';
import { HomeIcon } from '../../../../src/components/icon/named/HomeIcon';
import { InboxIcon } from '../../../../src/components/icon/named/InboxIcon';
import { HelpIcon } from '../../../../src/components/icon/named/HelpIcon';

test.for(['corporate', 'luna'])(
  'native %s current destination is styled before hydration',
  async (theme, { page }) => {
    const css = (
      await Promise.all(
        [
          'src/generated/tokens.css',
          'src/components/bottom-navigation/bottom-navigation.css',
          'src/components/icon/icon.css',
          'src/components/app-shell/app-shell.css',
          'src/components/app-content/app-content.css',
        ].map((path) => readFile(path, 'utf8')),
      )
    ).join('\n');
    const markup = renderToString(
      <AppShell>
        <AppContent>Server page</AppContent>
        <BottomNavigation aria-label="Primary">
          <BottomNavigation.Item>
            <a href="/">
              <HomeIcon />
              Home
            </a>
          </BottomNavigation.Item>
          <BottomNavigation.Item>
            <a href="/inbox">
              <InboxIcon />
              Inbox
            </a>
          </BottomNavigation.Item>
          <BottomNavigation.Item>
            <a href="/help" aria-current="page">
              <HelpIcon />
              Help
            </a>
          </BottomNavigation.Item>
        </BottomNavigation>
      </AppShell>,
    );
    await page.setContent(
      `<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`,
    );
    const current = await page.getByRole('link', { name: 'Help' }).evaluate((element) => ({
      color: getComputedStyle(element).color,
      content: getComputedStyle(element, '::before').content,
    }));
    const ordinary = await page.getByRole('link', { name: 'Inbox' }).evaluate((element) => ({
      color: getComputedStyle(element).color,
      content: getComputedStyle(element, '::before').content,
    }));
    expect(current.content).toBe('""');
    expect(ordinary.content).toBe('none');
    expect(current.color).not.toBe(ordinary.color);
  },
);
