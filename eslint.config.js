import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'storybook-static/**', 'node_modules/**', '.verification/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['**/*.mjs', '**/*.js'], languageOptions: { globals: { console: 'readonly', process: 'readonly', URL: 'readonly' } } },
  { files: ['scripts/verify-browser.mjs'], languageOptions: { globals: { getComputedStyle: 'readonly', document: 'readonly', innerWidth: 'readonly' } } },
  { ignores: ['scripts/fixtures/**'] },
);
