import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import sonarjs from 'eslint-plugin-sonarjs';
import prettier from 'eslint-config-prettier/flat';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'storybook-static/**',
      'node_modules/**',
      '.verification/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  sonarjs.configs.recommended,
  {
    files: ['**/*.mjs', '**/*.js'],
    languageOptions: { globals: { console: 'readonly', process: 'readonly', URL: 'readonly' } },
  },
  {
    files: ['scripts/verify-browser.mjs'],
    languageOptions: {
      globals: { getComputedStyle: 'readonly', document: 'readonly', innerWidth: 'readonly' },
    },
  },
  { ignores: ['scripts/fixtures/**'] },
  // Keep this last: Prettier owns formatting; ESLint owns code-quality checks.
  prettier,
);
