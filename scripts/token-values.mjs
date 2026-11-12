const genericFamilies = new Set(['serif', 'sans-serif', 'monospace', 'system-ui']);

/**
 * Reject a value when it cannot be represented by the supported DTCG subset.
 **/
export function validateValue(type, value, path) {
  const validators = {
    duration: v => typeof v?.value === 'number' && Number.isFinite(v.value) && v.value >= 0 && ['ms', 's'].includes(v.unit),
    cubicBezier: validBezier,
    dimension: v => typeof v?.value === 'number' && Number.isFinite(v.value) && ['px', 'rem'].includes(v.unit),
    color: v => v?.colorSpace === 'srgb' && Array.isArray(v.components) && v.components.length === 3 && v.components.every(unitInterval) && unitInterval(v.alpha ?? 1),
    fontFamily: v => Array.isArray(v) && v.length > 0 && v.every(name => typeof name === 'string' && name.length > 0),
    fontWeight: v => Number.isFinite(v) && v >= 1 && v <= 1000,
    number: v => typeof v === 'number' && Number.isFinite(v),
  };

  if (!validators[type]?.(value)) { throw new Error(`Invalid ${type} value at ${path}`); }
}

/**
 * Validate CSS cubic bezier coordinates; only the two time-axis coordinates are bounded.
 **/
function validBezier(value) {
  return Array.isArray(value) && value.length === 4 && value.every(coordinate => typeof coordinate === 'number' && Number.isFinite(coordinate)) && unitInterval(value[0]) && unitInterval(value[2]);
}

/**
 * Identify finite normalized sRGB components and opacity.
 **/
function unitInterval(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
}

/**
 * Convert a validated raw value into CSS without changing typography units.
 **/
export function cssValue(type, value) {
  if (type === 'cubicBezier') { return `cubic-bezier(${value.join(', ')})`; }
  if (type === 'dimension' || type === 'duration') { return `${value.value}${value.unit}`; }
  if (type === 'color') { return `rgb(${value.components.map(channel => Math.round(channel * 255)).join(' ')} / ${value.alpha ?? 1})`; }
  if (type === 'fontFamily') { return value.map(name => genericFamilies.has(name) ? name : JSON.stringify(name)).join(', '); }

  return String(value);
}
