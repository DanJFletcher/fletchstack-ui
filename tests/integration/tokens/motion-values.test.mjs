import { readFile } from 'node:fs/promises';
import { describe, expect } from 'vitest';
import { buildTokens } from '../../../scripts/token-build.mjs';
import { test, writeProject } from '../fixtures/token-project.mjs';
import { motionContracts } from '../../support/motion-contracts.mjs';

describe('motion token boundary', motionContracts);
test('builds shared motion roles into distributable stylesheets', async ({ root }) => {
  await writeProject(root, { primitive: { duration: { $type: 'duration', $value: { value: 160, unit: 'ms' } }, easing: { $type: 'cubicBezier', $value: [0.2, 0.8, 0.2, 1] } }, semantic: { motion: { duration: { $type: 'duration', $value: '{primitive.duration}', $description: 'Duration.' }, easing: { $type: 'cubicBezier', $value: '{primitive.easing}', $description: 'Easing.' } } } });
  await buildTokens(root);
  const result = await readFile(new URL('src/generated/tokens.css', root), 'utf8');
  expect(result).toContain('--fs-motion-duration: 160ms;');
  expect(result).toContain('--fs-motion-easing: cubic-bezier(0.2, 0.8, 0.2, 1);');
});
