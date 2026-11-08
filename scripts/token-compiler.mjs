import { cssValue, validateValue } from './token-values.mjs';

/**
 * Flatten nested DTCG groups, retaining inherited token types.
 **/
export function flattenTokens(group, prefix = '', inheritedType, result = {}) {
  for (const [name, value] of Object.entries(group)) {
    if (name.startsWith('$')) continue;
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Invalid group: ${prefix}${name}`);
    const path = prefix ? `${prefix}.${name}` : name;
    const type = value.$type ?? inheritedType ?? group.$type;

    if ('$value' in value) result[path] = { ...value, $type: type };
    else flattenTokens(value, path, type, result);
  }

  return result;
}

/**
 * Resolve an alias with cycle, missing-target and type checks.
 **/
function resolveToken(path, tokens, trail = []) {
  if (trail.includes(path)) throw new Error(`Alias cycle: ${[...trail, path].join(' -> ')}`);
  const token = tokens[path];
  if (!token) throw new Error(`Unresolved reference: ${path}`);
  const reference = typeof token.$value === 'string' && token.$value.match(/^\{([^{}]+)\}$/)?.[1];
  if (!reference) return token.$value;
  const value = resolveToken(reference, tokens, [...trail, path]);
  if (token.$type !== tokens[reference].$type) throw new Error(`Alias type mismatch: ${path} -> ${reference}`);

  return value;
}

/**
 * Enforce the public two-layer contract and spatial unit conventions.
 **/
function validateRole(path, token, value) {
  const layer = path.split('.')[0];
  if (!['primitive', 'semantic'].includes(layer)) throw new Error(`Unknown token layer: ${layer}`);
  if (layer === 'primitive' && typeof token.$value === 'string' && token.$value.startsWith('{')) throw new Error(`Primitive must be raw: ${path}`);
  if (layer === 'semantic' && !/^\{primitive\.[^{}]+\}$/.test(token.$value)) throw new Error(`Semantic must reference a primitive: ${path}`);
  if (layer === 'semantic' && !token.$description) throw new Error(`Missing purpose: ${path}`);
  const typography = path.includes('.font.') || path.endsWith('.font');
  if (layer === 'semantic' && token.$type === 'dimension' && !typography && value.unit !== 'px') throw new Error(`Spatial dimension must use px: ${path}`);
}

/**
 * Map a semantic path to its stable public CSS custom-property name.
 **/
export function cssName(path) {
  return `--fs-${path.replace(/^semantic\./, '').replaceAll('.', '-').replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`;
}

/**
 * Validate the complete graph and compile literal semantic values per scope.
 **/
export function compileTokens(document) {
  const tokens = flattenTokens(document);
  const output = {};
  for (const [path, token] of Object.entries(tokens)) {
    const value = resolveToken(path, tokens);
    validateValue(token.$type, value, path);
    validateRole(path, token, value);
    if (!path.startsWith('semantic.')) continue;
    const name = cssName(path);
    if (name in output) throw new Error(`CSS name collision: ${name}`);
    output[name] = cssValue(token.$type, value);
  }

  return output;
}
