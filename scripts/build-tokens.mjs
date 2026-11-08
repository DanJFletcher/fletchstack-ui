import { buildTokens } from './token-build.mjs';

await buildTokens(new URL('../', import.meta.url));
