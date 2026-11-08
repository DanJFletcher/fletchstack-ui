import { copyFile, readFile, writeFile } from 'node:fs/promises';

await copyFile('src/generated/tokens.css', 'dist/tokens.css');
await copyFile('src/button.css', 'dist/button.css');
const tokens = await readFile('dist/tokens.css', 'utf8');
const button = await readFile('dist/button.css', 'utf8');
await writeFile('dist/styles.css', `${tokens}\n${button}`);
