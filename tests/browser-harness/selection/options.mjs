/**
 * Accept only an explicit comparison base and an optional read-only dry run.
 **/
export function parseBrowserOptions(args) {
  const remaining = [...args];
  const options = { base: '', dryRun: false };
  while (remaining.length) {
    const flag = remaining.shift();
    if (flag === '--dry-run' && !options.dryRun) {
      options.dryRun = true;
    } else if (
      flag === '--base' &&
      !options.base &&
      remaining[0] &&
      !remaining[0].startsWith('-')
    ) {
      options.base = remaining.shift();
    } else {
      throw new Error(`Invalid browser option: ${flag}. Use --base <git-ref> [--dry-run]`);
    }
  }
  if (!options.base.trim()) {
    throw new Error('Required: --base <git-ref>');
  }
  return options;
}
