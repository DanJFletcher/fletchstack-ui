const metrics = ['statements', 'branches', 'functions', 'lines'];

/**
 * Keep demonstration helpers separate from production and preview configuration.
 **/
function category(path) {
  if (path.startsWith('tests/browser-harness/')) { return 'harness'; }
  if (path.startsWith('.storybook/')) { return 'preview'; }
  if (path.startsWith('stories/') || path.includes('/stories/')) { return 'story-demo'; }

  return 'production';
}

/**
 * Sum exact counters, leaving metrics with no executable code unscored.
 **/
function totals(files) {
  return Object.fromEntries(metrics.map(metric => {
    const covered = files.reduce((sum, file) => sum + file.summary[metric].covered, 0);
    const total = files.reduce((sum, file) => sum + file.summary[metric].total, 0);

    return [metric, { covered, total, percent: total ? 100 * covered / total : null }];
  }));
}

/**
 * Describe the measured inventory and selection without claiming verification completeness.
 **/
export function diagnosticSummary(files, scope) {
  const categories = Object.fromEntries(['production', 'story-demo', 'preview', 'harness'].map(name => {
    const members = files.filter(file => category(file.sourcePath) === name);

    return [name, { files: members.map(file => file.sourcePath).sort(), metrics: totals(members) }];
  }));

  return { diagnostic: true, note: 'Informational JavaScript execution coverage; not browser-behavior matrix verification.', scope, categories };
}
