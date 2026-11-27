import { createElement } from 'react';
import catalog from '../catalog.json' with { type: 'json' };
import type { MountRequest, ScenarioModule } from './types';
import { renderScenario, unmountScenario } from './render';
import '../../../src/generated/tokens.css';
import '../../../stories/shared/stories.css';

const loaders = import.meta.glob<ScenarioModule>('../scenarios/*.tsx');
const entries: Record<string, { module: string; export: string }> = catalog.scenarios;

/**
 * Load only an explicitly catalogued scenario, surfacing missing modules/exports.
 **/
async function loadScenario(id: string) {
  const entry = entries[id];
  if (!entry) {
    throw new Error(`Unknown scenario: ${id}`);
  }
  const loader = loaders[entry.module.replace('tests/browser-harness/', '../')];
  if (!loader) {
    throw new Error(`Missing scenario module: ${entry.module}`);
  }
  const module = await loader();
  const scenario = module.scenarios[entry.export];
  if (!scenario) {
    throw new Error(`Missing scenario export: ${entry.export}`);
  }

  return { module, scenario };
}

/**
 * Apply explicit scenario props and theme without running Storybook play functions.
 **/
async function mountScenario({ story, props = {} }: MountRequest) {
  const { module, scenario } = await loadScenario(story);
  const { theme = scenario.theme ?? 'corporate', ...overrides } = props;
  const args = { ...module.defaults, ...scenario.args, ...overrides };
  const content = scenario.render ? scenario.render(args) : createElement(module.component, args);

  await renderScenario(
    <main className="showcase" data-theme={String(theme)}>
      {content}
    </main>,
    story,
  );
}

window.mount = mountScenario;
window.unmount = unmountScenario;
