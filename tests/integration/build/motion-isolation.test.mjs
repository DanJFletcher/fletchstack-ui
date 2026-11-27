import { readFile, readdir } from 'node:fs/promises';
import { expect, it } from 'vitest';

it('keeps motion preview override markers out of distributed code and styles', async () => {
  const files = (await readdir('dist')).filter((name) => /\.(?:css|js)$/.test(name));

  const content = await Promise.all(files.map((name) => readFile(`dist/${name}`, 'utf8')));

  expect(files).toContain('styles.css');
  expect(content.join('\n')).not.toMatch(/fs-preview-motion|fsPreviewMotion|installMotionPreview/);
});
