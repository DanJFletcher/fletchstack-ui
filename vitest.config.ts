import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}', 'scripts/*.mjs'],
      exclude: ['scripts/verify-*.mjs', 'src/**/__tests__/**', 'src/**/stories/**'],
      reporter: [['text', { skipFull: false }], 'html', 'json', 'json-summary'],
      thresholds: { perFile: true, statements: 100, branches: 100, functions: 100, lines: 100 },
    },
    projects: [
      {
        test: {
          name: 'unit',
          include: [
            'tests/unit/**/*.test.{ts,tsx,mjs}',
            'src/components/**/__tests__/**/*.test.{ts,tsx,mjs}',
          ],
        },
      },
      { test: { name: 'integration', include: ['tests/integration/**/*.test.{ts,tsx,mjs}'] } },
      {
        plugins: [storybookTest({ configDir: '.storybook' })],
        optimizeDeps: { include: ['storybook/internal/core-events'] },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
