import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '../dist/index.js';

/**
 * Convert a CSS rgb color to normalized sRGB channels.
 **/
function channels(color) {
  return color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => value / 255);
}

/**
 * Calculate WCAG relative luminance for an opaque CSS rgb color.
 **/
function luminance(color) {
  const linear = channels(color).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);

  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

/**
 * Calculate a contrast ratio between two opaque CSS rgb colors.
 **/
function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);

  return (values[0] + 0.05) / (values[1] + 0.05);
}

/**
 * Read the rendered state and the region's public surface token.
 **/
async function colors(button) {
  return button.evaluate(element => {
    const style = getComputedStyle(element);

    return { text: style.color, background: style.backgroundColor, border: style.borderTopColor, outline: style.outlineColor, outlineWidth: style.outlineWidth, outlineStyle: style.outlineStyle, surface: style.getPropertyValue('--fs-surface'), focus: element.matches(':focus-visible') };
  });
}

/**
 * Check state contrast on the rendered control, including transparent ghost fills.
 **/
async function checkContrast(button, label, boundary = true) {
  const state = await colors(button);
  const background = state.background === 'rgba(0, 0, 0, 0)' || state.background.endsWith(', 0)') ? state.surface : state.background;
  const ratio = contrast(state.text, background);
  assert.ok(ratio >= 4.5, `${label}: label contrast ${ratio.toFixed(2)} < 4.5`);
  if (boundary) { assert.ok(contrast(state.border, state.surface) >= 3, `${label}: boundary contrast < 3`); }

  return ratio;
}

/**
 * Render a theme's real built Buttons for all variants and sizes.
 **/
function region(theme) {
  const buttons = ['primary', 'secondary', 'ghost'].flatMap(variant => ['small', 'medium', 'large'].map(size => h(Button, { variant, size, key: `${variant}-${size}` }, `${variant} ${size}`)));

  return h('section', { 'data-theme': theme, className: 'region', key: theme }, h('h2', null, theme === 'corporate' ? 'Corporate' : 'Luna'), h('div', { className: 'actions' }, buttons), h(Button, { disabled: true }, 'Disabled'), h('div', { className: 'narrow' }, h(Button, null, 'Save all changes and return to your account settings'), h(Button, { variant: 'secondary' }, 'ReviewYourAccountPreferencesBeforeContinuing')));
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
const css = await readFile('dist/styles.css', 'utf8');
const markup = renderToStaticMarkup(h('main', null, ['corporate', 'luna'].map(region)));
await mkdir('.verification', { recursive: true });
try {
  await page.setContent(`<!doctype html><html lang="en"><head><title>Button verification</title><style>${css}\nbody{margin:0}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr))}.region{background:var(--fs-surface);color:var(--fs-text);padding:var(--fs-space-inset);font-family:var(--fs-font-body)}.actions{display:flex;flex-wrap:wrap;gap:var(--fs-space-inline);margin-block:var(--fs-space-stack)}.narrow{width:180px;max-width:100%;display:grid;gap:var(--fs-space-inline);margin-block:var(--fs-space-stack)}</style></head><body>${markup}</body></html>`);
  for (const theme of ['corporate', 'luna']) {
    const scope = page.locator(`[data-theme="${theme}"]`);
    for (const variant of ['primary', 'secondary', 'ghost']) {
      const button = scope.getByRole('button', { name: `${variant} medium`, exact: true });
      const resting = await checkContrast(button, `${theme} ${variant} default`, variant !== 'ghost');
      const normalColor = (await colors(button)).background;
      await button.hover();
      await checkContrast(button, `${theme} ${variant} hover`, variant !== 'ghost');
      assert.notEqual((await colors(button)).background, normalColor);
      await page.mouse.down();
      await checkContrast(button, `${theme} ${variant} active`, variant !== 'ghost');
      await page.mouse.up();
      await page.keyboard.press('Tab');
      await button.focus();
      const focus = await colors(button);
      assert.equal(focus.focus, true);
      assert.equal(focus.outlineWidth, '3px');
      assert.equal(focus.outlineStyle, 'solid');
      assert.ok(contrast(focus.outline, focus.surface) >= 3);
      console.log(`${theme} ${variant}: default ${resting.toFixed(2)}:1; hover, active, focus passed`);
    }
    await checkContrast(scope.getByRole('button', { name: 'Disabled', exact: true }), `${theme} disabled`);
  }
  await page.mouse.move(0, 0);
  await page.screenshot({ path: '.verification/themes.png', fullPage: true });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.addStyleTag({ content: 'html{font-size:200%}*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}' });
  const layout = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, clipped: [...document.querySelectorAll('button')].filter(button => button.scrollWidth > button.clientWidth + 1 || button.scrollHeight > button.clientHeight + 1).map(button => button.textContent) }));
  assert.deepEqual(layout, { overflow: false, clipped: [] });
  await page.screenshot({ path: '.verification/reflow.png', fullPage: true });
  console.log('320px reflow, 200% text enlargement, and WCAG text-spacing overrides passed.');
} finally {
  await browser.close();
}
