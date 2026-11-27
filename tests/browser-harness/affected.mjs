import { parseBrowserOptions } from './selection/options.mjs';
import { discoverBrowserSelection } from './selection/discover.mjs';
import { executeSelection } from './selection/execute.mjs';

try {
  const options = parseBrowserOptions(process.argv.slice(2));
  const selection = discoverBrowserSelection(options.base, process.cwd());
  console.log(JSON.stringify(selection, null, 2));
  if (!options.dryRun) {
    process.exitCode = await executeSelection(selection);
  }
} catch (error) {
  console.error(JSON.stringify({ mode: 'error', error: error.message }));
  process.exitCode = 1;
}
