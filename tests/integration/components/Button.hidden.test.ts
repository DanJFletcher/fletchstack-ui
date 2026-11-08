import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../fixtures/browser';
import { Button } from '../../../src/Button';

test.beforeEach(async ({ page }) => {
  const css = await readFile(new URL('../../../src/button.css', import.meta.url), 'utf8');
  const markup = ['Before', 'Hidden', 'After'].map(label =>
    renderToStaticMarkup(createElement(Button, { hidden: label === 'Hidden' }, label))).join('');

  await page.setContent(`<style>${css}</style>${markup}`);
});

test('a native hidden Button is not visible', async ({ page }) => {
  // arrange
  const button = page.locator('button[hidden]');

  // act
  const result = await button.isVisible();

  // assert
  expect(result).toBe(false);
});

test('native Tab navigation skips a hidden Button', async ({ page }) => {
  // arrange
  await page.getByRole('button', { name: 'Before' }).focus();

  // act
  await page.keyboard.press('Tab');

  // assert
  const result = await page.locator(':focus').textContent();
  expect(result).toBe('After');
});
