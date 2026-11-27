const shared = [
  /^(?:package(?:-lock)?\.json$|(?:playwright|vite|vitest)\.|tsconfig.*\.json$|tokens\/|src\/generated\/|src\/index\.ts$|src\/components\/[^/]+\/index\.ts$)/,
  /^(?:\.storybook\/|stories\/shared\/|tests\/e2e\/(?:fixtures|coverage)\/|tests\/browser-harness\/(?:selection\/|gallery\/|fixtures\/|catalog\.json$|run\.mjs$|affected\.mjs$|index\.html$)|scripts\/)/,
];
const unrelated = /^(?:openspec\/.*\.(?:md|ya?ml)$|\.agents\/.*\.md$|AGENTS\.md$)/;

/**
 * Explain changed-input ownership; uncertain source and resources never mean empty.
 **/
function classify(change, owners) {
  if (unrelated.test(change.path) && !owners.length) {
    return { full: false, reason: 'Planning or agent instructions only' };
  }
  if (/^[DRC]/.test(change.status)) {
    return { full: true, reason: 'Deleted or renamed dependency' };
  }
  if (shared.some((pattern) => pattern.test(change.path))) {
    return { full: true, reason: 'Shared browser infrastructure, tokens, styles or exports' };
  }
  if (owners.length) {
    return { full: false, reason: 'Declared scenario/resource and transitive dependencies' };
  }
  return { full: true, reason: 'No proven browser owners' };
}

/**
 * Select exact project/file pairs or the complete inventory with auditable reasons.
 **/
export function selectBrowserTests({ changes, inventory, graphs, fallback, ownershipIssues = [] }) {
  if (!inventory.length) {
    throw new Error('Cannot discover complete browser inventory');
  }
  const reasons = changes.map((change) => {
    const owners = inventory.filter(
      (suite) => suite.file === change.path || graphs.get(suite.file)?.files.includes(change.path),
    );
    const evidence = owners.map((suite) => ({
      file: suite.file,
      via: graphs.get(suite.file)?.paths?.[change.path] ?? [change.path],
      ownership:
        suite.project === 'chromium'
          ? 'Conservative complete Storybook runtime'
          : 'Scenario dependency closure or directly changed test',
    }));
    return {
      ...change,
      ...classify(change, owners),
      owners: owners.map((suite) => suite.file),
      evidence,
    };
  });
  const unknown = [...ownershipIssues, ...[...graphs.values()].flatMap((graph) => graph.unknown)];
  const full = Boolean(fallback) || unknown.length > 0 || reasons.some((reason) => reason.full);
  const selected = new Set(reasons.flatMap((reason) => reason.owners));
  const suites = full ? inventory : inventory.filter((suite) => selected.has(suite.file));
  const mode = full ? 'full-fallback' : selectionMode(suites);
  return { mode, suites, reasons, fallback, ownershipIssues: [...new Set(unknown)].sort() };
}

/**
 * Distinguish a proven empty scope from selected execution.
 **/
function selectionMode(suites) {
  return suites.length ? 'selected' : 'safely-empty';
}
