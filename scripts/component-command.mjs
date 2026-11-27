import { parseComponentArgs } from './component-options.mjs';
import { planComponent } from './component-plan.mjs';
import { readComponentProject, validatePlan, applyComponentPlan } from './component-files.mjs';
import { checkComponent } from './component-check.mjs';

/**
 * Render deterministic file actions and outstanding authored work without exposing file contents.
 **/
export function describePlan(plan) {
  return [
    ...plan.changes.map((change) => `${change.before === null ? 'Create' : 'Edit'} ${change.path}`),
    '',
    'Remaining authored work:',
    ...plan.remaining,
  ].join('\n');
}

/**
 * Execute the chosen operation and translate failures into an actionable nonzero CLI result.
 **/
export function componentMain(args, root = process.cwd(), report = console.log) {
  try {
    const options = parseComponentArgs(args);
    const project = readComponentProject(root);
    if (options.command === 'check') {
      const issues = checkComponent(project.files, options.name);
      report(
        issues.length
          ? issues.join('\n')
          : 'Structural checks passed. Behavioral verification remains independently required.',
      );
      return issues.length ? 1 : 0;
    }
    const plan = planComponent(project.files, options);
    validatePlan(project.root, plan);
    if (!options.dryRun) {
      applyComponentPlan(project.root, plan);
    }
    report(`${options.dryRun ? 'Preview' : 'Prepared'} ${plan.name}\n${describePlan(plan)}`);
    return 0;
  } catch (error) {
    report(error.message);
    return 1;
  }
}
