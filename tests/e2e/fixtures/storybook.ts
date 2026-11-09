import { expect, type Page } from '@playwright/test';

interface StoryOptions {
  theme?: 'corporate' | 'luna';
  args?: Record<string, string | boolean>;
}

/**
 * Encode preview settings using Storybook's globals and simple-args protocol.
 **/
function previewPath(story: string, options: StoryOptions) {
  const query = new URLSearchParams({ id: story, viewMode: 'story' });
  if (options.theme) {
    query.set('globals', `theme:${options.theme}`);
  }
  if (options.args) {
    query.set('args', Object.entries(options.args).map(([name, value]) => `${name}:${value}`).join(';'));
  }

  return `/iframe.html?${query}`;
}

/**
 * Open a preview and require Storybook's render/play lifecycle to succeed.
 * Isolate the pinned Storybook runtime readiness boundary in this adapter.
 **/
export async function openStory(page: Page, story: string, options: StoryOptions = {}) {
  await page.goto(previewPath(story, options));
  await expect(page.locator('main.showcase')).toBeVisible();

  await expect.poll(() => page.evaluate(() => {
    const previewWindow = window as Window & {
      __STORYBOOK_PREVIEW__?: { channel: { last(event: string): [{ status: string }] | undefined } };
    };
    return previewWindow.__STORYBOOK_PREVIEW__?.channel.last('storyFinished')?.[0].status;
  })).toBe('success');
}
