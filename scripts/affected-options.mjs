/**
 * Parse the fixed test project and explicit comparison base for a development run.
 **/
export function parseOptions([project, ...args]) {
  if (!['unit', 'integration'].includes(project)) {
    throw new Error('Choose the unit or integration affected command');
  }
  const options = { project, base: '', dryRun: false };
  while (args.length) {
    readOption(options, args);
  }
  if (!options.base) {
    throw new Error('Required: --base <git-ref>');
  }
  return options;
}

/**
 * Consume one supported option, rejecting ambiguous or unsafe overrides.
 **/
function readOption(options, args) {
  const flag = args.shift();
  if (flag === '--dry-run' && !options.dryRun) {
    options.dryRun = true;
  } else if (flag === '--base' && !options.base && args[0] && !args[0].startsWith('-')) {
    options.base = args.shift();
  } else {
    throw new Error(`Invalid affected option: ${flag}. Use --base <git-ref> [--dry-run]`);
  }
}
