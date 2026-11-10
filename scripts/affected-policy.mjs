const shared = /^(?:package(?:-lock)?\.json$|(?:vitest|vite|eslint)\.config\.|tsconfig.*\.json$|tokens\/|src\/generated\/|scripts\/|docs\/tokens\.md$|src\/(?:index\.ts$|components\/[^/]+\/index\.ts$))/;
const resource = /(?:^(?:docs\/|stories\/|\.storybook\/|tests\/fixtures\/)|\/fixtures\/)/;
const code = /\.(?:tsx?|mjs|js)$/;
const testFile = /(?:^tests\/(?:unit|integration)\/|\/__tests__\/).*\.test\.(?:tsx?|mjs)$/;
const planning = /^openspec\/.*\.(?:md|yaml|yml)$/;

/**
 * Explain the conservative policy for one changed path after import discovery.
 **/
export function classifyChange(change, project, owners) {
  const { path, status } = change;
  if (planning.test(path) && !owners.length) { return { full: false, reason: 'Unrelated OpenSpec planning' }; }
  if (/^[DRC]/.test(status)) { return { full: true, reason: 'Deleted or renamed dependency' }; }
  if (shared.test(path)) { return { full: true, reason: 'Shared tooling, tokens, configuration or public exports' }; }
  if (path.endsWith('.css')) { return { full: project === 'integration', reason: 'CSS: integration owns computed appearance' }; }
  if (project === 'integration' && (resource.test(path) || /\/stories\//.test(path) || /^[A?]/.test(status) && /^(?:src|tests)\//.test(path))) {
    return { full: true, reason: 'Filesystem, fixture or inventory dependency' };
  }
  if (code.test(path) && owners.length) { return { full: false, reason: 'Vitest import dependencies / directly changed test' }; }
  if (testFile.test(path) && !owners.length) { return { full: false, reason: 'Test belongs to another project' }; }
  return { full: true, reason: 'Unclassified input or no proven test owners' };
}

/**
 * Select known owners or the complete inventory; uncertainty is never an empty success.
 **/
export function selectTests({ project, changes, inventory, owners, fallback }) {
  if (!inventory.length) { throw new Error(`Cannot discover ${project} test inventory`); }
  const reasons = changes.map(change => ({ ...change, ...classifyChange(change, project, owners.get(change.path) ?? []) }));
  const full = Boolean(fallback) || reasons.some(reason => reason.full);
  const related = changes.flatMap(change => owners.get(change.path) ?? []);
  const files = [...new Set(full ? inventory : related)].sort();
  const partialMode = files.length ? 'selected' : 'safely-empty';
  return { mode: full ? 'full-fallback' : partialMode, files, reasons, fallback };
}
