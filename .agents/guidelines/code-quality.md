# TypeScript code quality

Apply this guideline when writing, refactoring, or reviewing TypeScript. Optimize for the person reading the code next. Choose clear control flow, direct expressions, and familiar TypeScript constructs. Use an explicit loop, guard clause, or named intermediate value when it makes the behavior easier to follow.

## Breathing room inside functions

Use a single blank line when the function moves from one logical step to the next. Separate setup from a guard or early return, then give the main path its own space after the guard. Keep statements that perform the same step together, such as reading a file and putting its contents in a map. Put a blank line before the final return when it assembles the result from that work.

In `loadItem`, the four groups are input unpacking, the skill branch, loading the Markdown file, and assembling the result.

```ts
function loadItem(directory: string, artifact: Artifact): CatalogItem {
  const { kind, slug } = artifact;

  if (kind === 'skill') {
    return loadSkill(join(directory, slug), artifact);
  }

  const file = readFileSync(join(directory, slug + '.md'));
  const files = new Map([[slug + '.md', file]]);

  return kind === 'agent' ? { ...artifact, files, profile: parseProfile(file.toString(), slug, kind) } : { ...artifact, files };
}
```

## Sandi Metz's rules, adapted to TypeScript

- **Classes have at most 100 lines of code.** Count nonblank, noncomment lines, including the declaration and closing brace. Keep each class focused on one responsibility. Use the same cohesion test for modules that use functions and plain objects.
- **Aim for five lines of code per function or method, with a maximum of 15.** Count lines containing code, including the signature and closing brace. Skip blank lines and lines that contain only comments. Extract a helper when you can name a useful operation or give a decision a clear home.
- **Functions and methods accept at most four parameters.** Count optional parameters too. Group values in an object when they form a coherent concept or a genuine set of options. Avoid broad context objects and bags of unrelated values that hide what the function needs.
- **Keep adapters thin.** A CLI command parses inputs, calls a focused application operation, and translates the result into output and an exit status. Put decisions such as which files AGI owns or when a local edit is a conflict in that operation or its collaborators. Apply the same boundary to HTTP handlers and other framework entry points.

Apply these limits to new and changed production code. Keep test scenarios and fixtures readable. Use the room between five and 15 lines when keeping a cohesive operation together makes it easier to follow. Avoid packed expressions, needless wrappers, and extra layers introduced solely to satisfy a count.

## Function documentation

Add a JSDoc block directly above each new named function or method, including private helpers and test helpers. When changing a function, update its JSDoc if its behavior changes or add one if it is missing. Explain what the function does and mention relevant side effects, error conditions, or return conventions when they help a caller use it correctly.

Use the multiline format even for a one-sentence description. Put `/**` and `**/` on their own lines and begin each description line with ` * `.

```ts
/**
 * Validate and return a lowercase artifact slug with optional hyphen-separated segments.
 **/
export function slugOf(value: unknown): string {
  // Implementation
}
```

## Relevant cleanup and naming

Follow the Scout's Principle. Leave touched code cleaner through clearer names, removal of obsolete helpers, imports, and comments, reduced duplication, and focused responsibilities. Keep cleanup related to the change and easy to review. Make cleanup edits when they solve a concrete problem in the code you touched.

Choose names according to scope, lifetime, distance from declaration, and ambiguity at use sites. `orders.map(x => x.amount)` is acceptable in that tiny scope. If the callback grows, gains competing values, or uses the binding farther from its declaration, reconsider `x` and prefer `order` when that clarifies the use. Reassess short names when moving bindings to wider scopes. Prefer descriptive domain names such as `currencySymbol` when `c` would leave the meaning unclear. Conventional local indices and coordinates may stay short. Use your judgment at the use site instead of applying a fixed length or distance cutoff.

Name classes, types, and objects for their role in the domain. `InstallPlan` and `installPlan` identify what a reader is working with. Distinguish values such as `requestedSkills` and `installedSkills` when their roles affect behavior. Name functions for the action or decision a caller can expect, as in `readInstalledManifest` or `findGuidelineConflicts`.

During review, read the changed code from its callers. Check whether the names explain the data, the control flow exposes important decisions, and the code keeps policy in one clear place.
