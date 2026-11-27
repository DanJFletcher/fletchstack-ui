const values = new Set([
  '--workers',
  '--grep',
  '--grep-invert',
  '--reporter',
  '--timeout',
  '--repeat-each',
  '--shard',
]);
const switches = new Set(['--headed', '--debug', '--list', '--ui']);

/**
 * Route explicit file filters before starting servers; reject ambiguous configuration overrides.
 **/
export function completeOptions(args, inventory) {
  const remaining = [...args];
  const forwarded = [];
  const filters = [];
  while (remaining.length) {
    const value = remaining.shift();
    if (!value.startsWith('-')) {
      filters.push(new RegExp(value));
      continue;
    }
    const flag = value.split('=')[0];
    if (!values.has(flag) && !switches.has(flag)) {
      throw new Error(
        `Unsupported complete-run option ${flag}; use a focused project command for other Playwright options`,
      );
    }
    forwarded.push(value);
    if (values.has(flag) && !value.includes('=')) {
      if (!remaining.length) {
        throw new Error(`Missing value for ${flag}`);
      }
      forwarded.push(remaining.shift());
    }
  }
  const suites = filters.length
    ? inventory.filter((suite) => filters.some((filter) => filter.test(suite.file)))
    : inventory;
  if (!suites.length) {
    throw new Error('No browser suites match the requested files');
  }
  return { suites, args: forwarded };
}
