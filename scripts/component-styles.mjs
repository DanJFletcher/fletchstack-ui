import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';

/**
 * Publish tokens first and component styles in reviewed inventory order; propagate I/O failures.
 **/
export async function publishStyles(families) {
  const sources = [
    'src/generated/tokens.css',
    ...families.filter((family) => family.style).map((family) => family.style),
  ];
  const contents = [];
  for (const source of sources) {
    const destination = `dist/${basename(source)}`;
    await copyFile(source, destination);
    contents.push(await readFile(destination, 'utf8'));
  }
  await writeFile('dist/styles.css', contents.join('\n'));
}
