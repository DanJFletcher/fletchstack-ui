import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';

const directory = resolve('.verification/astro/dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = resolve(directory, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!file.startsWith(`${directory}/`)) { response.writeHead(403).end(); return; }
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' }).end(body);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true });
const address = `http://127.0.0.1:${server.address().port}`;
try {
  const staticPage = await browser.newPage({ javaScriptEnabled: false });
  await staticPage.goto(address);
  assert.equal(await staticPage.getByRole('button', { name: 'Save without JavaScript' }).getAttribute('type'), 'submit');
  assert.equal(await staticPage.getByRole('button', { name: 'Save changes', exact: true }).count(), 1);
  assert.equal(await staticPage.locator('astro-island').count(), 1);
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(address);
  await page.locator('astro-island:not([ssr])').waitFor();
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await page.getByRole('button', { name: 'Saved', exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Saved', exact: true }).isDisabled(), true);
  assert.deepEqual(errors, []);
  console.log('Astro: static React HTML with JavaScript disabled, one client:load island, hydrated click/disabled state, no page errors.');
} finally {
  await browser.close();
  server.close();
}
