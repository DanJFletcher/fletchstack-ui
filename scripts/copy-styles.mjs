import { copyFile, readFile, writeFile } from 'node:fs/promises';

await copyFile('src/generated/tokens.css', 'dist/tokens.css');
await copyFile('src/button.css', 'dist/button.css');
await copyFile('src/icon.css', 'dist/icon.css');
await copyFile('src/card.css', 'dist/card.css');
const tokens = await readFile('dist/tokens.css', 'utf8');
const button = await readFile('dist/button.css', 'utf8');
const icon = await readFile('dist/icon.css', 'utf8');
const card = await readFile('dist/card.css', 'utf8');
await writeFile('dist/styles.css', `${tokens}\n${button}\n${icon}\n${card}`);
