import { discoverInventory } from './selection/inventory.mjs';
import { executeSelection } from './selection/execute.mjs';
import { completeOptions } from './selection/complete-options.mjs';

try {
  const root = process.cwd();
  const selection = completeOptions(process.argv.slice(2), discoverInventory(root));
  process.exitCode = await executeSelection(
    { root, suites: selection.suites },
    undefined,
    selection.args,
  );
} catch (error) {
  console.error('Complete browser run failed:', error);
  process.exitCode = 1;
}
