import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { expect } from 'vitest';
import { test } from '../fixtures/token-project.mjs';

test('the token command reproduces the checked-in CSS and reference', async () => {
  // arrange
  const stylesheet = new URL('../../../src/generated/tokens.css', import.meta.url);
  const reference = new URL('../../../docs/tokens.md', import.meta.url);
  const expected = await Promise.all([readFile(stylesheet, 'utf8'), readFile(reference, 'utf8')]);

  // act
  await import('../../../scripts/build-tokens.mjs');

  // assert
  const result = await Promise.all([readFile(stylesheet, 'utf8'), readFile(reference, 'utf8')]);
  expect(result).toEqual(expected);
});

test('the stylesheet command publishes separate and combined CSS exports', async ({ root }) => {
  // arrange
  await mkdir(new URL('src/generated', root), { recursive: true });
  await Promise.all(['stack', 'container', 'separator', 'badge', 'spinner', 'switch', 'link', 'radio', 'textarea', 'field', 'form-group', 'checkbox', 'select', 'text-input', 'button', 'card', 'icon'].map(family => mkdir(new URL(`src/components/${family}`, root), { recursive: true })));
  await mkdir(new URL('dist', root));
  await writeFile(new URL('src/generated/tokens.css', root), ':root { --fs-text: black; }');
  await copyFile(new URL('../../../src/components/button/button.css', import.meta.url), new URL('src/components/button/button.css', root));
  await copyFile(new URL('../../../src/components/icon/icon.css', import.meta.url), new URL('src/components/icon/icon.css', root));
  await copyFile(new URL('../../../src/components/card/card.css', import.meta.url), new URL('src/components/card/card.css', root));

  await copyFile(new URL('../../../src/components/select/select.css', import.meta.url), new URL('src/components/select/select.css', root));
  await copyFile(new URL('../../../src/components/text-input/text-input.css', import.meta.url), new URL('src/components/text-input/text-input.css', root));
  await copyFile(new URL('../../../src/components/checkbox/checkbox.css', import.meta.url), new URL('src/components/checkbox/checkbox.css', root));
  await copyFile(new URL('../../../src/components/form-group/form-group.css', import.meta.url), new URL('src/components/form-group/form-group.css', root));
  await copyFile(new URL('../../../src/components/field/field.css', import.meta.url), new URL('src/components/field/field.css', root));
  await copyFile(new URL('../../../src/components/textarea/textarea.css', import.meta.url), new URL('src/components/textarea/textarea.css', root));
  await copyFile(new URL('../../../src/components/radio/radio.css', import.meta.url), new URL('src/components/radio/radio.css', root));
  await copyFile(new URL('../../../src/components/link/link.css', import.meta.url), new URL('src/components/link/link.css', root));
  await copyFile(new URL('../../../src/components/switch/switch.css', import.meta.url), new URL('src/components/switch/switch.css', root));
  await copyFile(new URL('../../../src/components/spinner/spinner.css', import.meta.url), new URL('src/components/spinner/spinner.css', root));
  await copyFile(new URL('../../../src/components/badge/badge.css', import.meta.url), new URL('src/components/badge/badge.css', root));
  await copyFile(new URL('../../../src/components/separator/separator.css', import.meta.url), new URL('src/components/separator/separator.css', root));
  await copyFile(new URL('../../../src/components/container/container.css', import.meta.url), new URL('src/components/container/container.css', root));
  await copyFile(new URL('../../../src/components/stack/stack.css', import.meta.url), new URL('src/components/stack/stack.css', root));
  const stack = await readFile(new URL('src/components/stack/stack.css', root), 'utf8');
  const container = await readFile(new URL('src/components/container/container.css', root), 'utf8');
  const separator = await readFile(new URL('src/components/separator/separator.css', root), 'utf8');
  const badge = await readFile(new URL('src/components/badge/badge.css', root), 'utf8');
  const spinner = await readFile(new URL('src/components/spinner/spinner.css', root), 'utf8');
  const switchStyles = await readFile(new URL('src/components/switch/switch.css', root), 'utf8');
  const link = await readFile(new URL('src/components/link/link.css', root), 'utf8');
  const radio = await readFile(new URL('src/components/radio/radio.css', root), 'utf8');
  const textarea = await readFile(new URL('src/components/textarea/textarea.css', root), 'utf8');
  const field = await readFile(new URL('src/components/field/field.css', root), 'utf8');
  const formGroup = await readFile(new URL('src/components/form-group/form-group.css', root), 'utf8');
  const checkbox = await readFile(new URL('src/components/checkbox/checkbox.css', root), 'utf8');
  const textInput = await readFile(new URL('src/components/text-input/text-input.css', root), 'utf8');
  const select = await readFile(new URL('src/components/select/select.css', root), 'utf8');
  const icon = await readFile(new URL('src/components/icon/icon.css', root), 'utf8');
  const card = await readFile(new URL('src/components/card/card.css', root), 'utf8');
  const button = await readFile(new URL('src/components/button/button.css', root), 'utf8');
  const previousDirectory = process.cwd();

  // act
  try {
    process.chdir(fileURLToPath(root));
    await import('../../../scripts/copy-styles.mjs');
  } finally {
    process.chdir(previousDirectory);
  }

  // assert
  const result = await Promise.all(['tokens.css', 'field.css', 'button.css', 'icon.css', 'card.css', 'select.css', 'text-input.css', 'checkbox.css', 'form-group.css', 'textarea.css', 'radio.css', 'link.css', 'switch.css', 'spinner.css', 'badge.css', 'separator.css', 'container.css', 'stack.css', 'styles.css'].map(name => readFile(new URL(`dist/${name}`, root), 'utf8')));
  expect(result).toEqual([':root { --fs-text: black; }', field, button, icon, card, select, textInput, checkbox, formGroup, textarea, radio, link, switchStyles, spinner, badge, separator, container, stack, `:root { --fs-text: black; }\n${field}\n${button}\n${icon}\n${card}\n${select}\n${textInput}\n${checkbox}\n${formGroup}\n${textarea}\n${radio}\n${link}\n${switchStyles}\n${spinner}\n${badge}\n${separator}\n${container}\n${stack}`]);
});
