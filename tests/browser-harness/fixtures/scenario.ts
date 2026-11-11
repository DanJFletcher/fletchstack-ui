import { test as runner, type PlaywrightTestArgs } from '@playwright/test';
import { relative } from 'node:path';
import catalog from '../catalog.json' with { type: 'json' };

interface ScenarioOptions {
  theme?: 'corporate' | 'luna';
  args?: Record<string, string | boolean>;
}

/**
 * Mount a scenario only when the current suite declares its ownership.
 **/
export async function openScenario(mount: PlaywrightTestArgs['mount'], id: string, options: ScenarioOptions = {}) {
  const file = relative(process.cwd(), runner.info().file).replaceAll('\\', '/');
  const owner = catalog.suites.find(suite => suite.file === file);
  if (!owner?.scenarios.some(scenario => scenario === id)) { throw new Error(`Undeclared scenario ${id} in ${file}`); }

  await mount(id, { ...options.args, ...(options.theme ? { theme: options.theme } : {}) });
}
