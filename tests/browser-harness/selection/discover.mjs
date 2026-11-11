import { discoverChanges } from '../../../scripts/affected-git.mjs';
import { discoverOwnership } from './inventory.mjs';
import { selectBrowserTests } from './policy.mjs';

/**
 * Combine read-only Git discovery and static browser ownership into one auditable plan.
 **/
export function discoverBrowserSelection(base, cwd) {
  const comparison = discoverChanges(base, cwd);
  const ownership = discoverOwnership(comparison.root);
  const selected = selectBrowserTests({ ...comparison, ...ownership });
  return { ...comparison, ...selected, inventory: ownership.inventory };
}
