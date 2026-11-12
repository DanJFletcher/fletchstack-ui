export const elements = Object.freeze({ div: 'HTMLDivElement', span: 'HTMLSpanElement', section: 'HTMLElement', button: 'HTMLButtonElement', input: 'HTMLInputElement' });
export const usage = 'component:new <PascalName> --category <group> --element <div|span|section|button|input> [--dry-run]';

/**
 * Validate explicit single-root choices and derive stable local identifiers.
 **/
export function componentOptions(name, category, element) {
  if (!/^[A-Z][A-Za-z0-9]{0,63}$/.test(name)) { throw new Error('Use a PascalCase component name (1–64 letters/digits).'); }
  if (!/^[A-Z][A-Za-z ]{0,39}$/.test(category)) { throw new Error('Use a category starting with a capital letter (letters/spaces only).'); }
  if (!Object.hasOwn(elements, element)) { throw new Error(`Unsupported element: ${element}. Use manual authoring for other structures.`); }
  const slug = name.replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  return { name, category, element, refType: elements[element], slug, id: `components-${slug}` };
}

/**
 * Parse strict CLI options without prompting or starting unrelated commands.
 **/
export function parseComponentArgs(args) {
  const [command, name, ...rest] = args;
  if (command === 'check' && rest.length === 0 && /^[A-Z][A-Za-z0-9]{0,63}$/.test(name)) { return { command, name }; }
  if (command !== 'new') { throw new Error(`Usage: ${usage}; component:check <PascalName>`); }
  const values = new Map();
  for (let index = 0; index < rest.length; index++) {
    const key = rest[index];
    if (!['--category', '--element', '--dry-run'].includes(key) || values.has(key)) { throw new Error(`Unknown or repeated option: ${key}`); }
    values.set(key, key === '--dry-run' ? true : rest[++index]);
  }
  return { command, ...componentOptions(name, values.get('--category'), values.get('--element')), dryRun: values.has('--dry-run') };
}
