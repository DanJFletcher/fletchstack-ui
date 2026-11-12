import { createHash } from 'node:crypto';

/**
 * Project generated CSS onto the independently frozen token identities, retaining selectors and order.
 **/
export function protectedStylesheet(content, names) {
  return content.split(/(?<=\n)/).filter(line => {
    const declaration = line.match(/^\s*(--fs-[\w-]+):/);
    return !declaration || names.includes(declaration[1]);
  }).join('');
}

/**
 * Compare protected stylesheet bytes against the original migration hash.
 **/
export function preservesStylesheet(content, names, hash) {
  return createHash('sha256').update(protectedStylesheet(content, names)).digest('hex') === hash;
}

/**
 * Read individual named runtime/type exports independently of the build inventory.
 **/
export function exportIdentities(content) {
  return [...content.matchAll(/export (type )?\{([^}]+)\}/g)]
    .flatMap(match => match[2].split(',').map(name => `${match[1] ?? ''}${name.trim()}`)).sort();
}
