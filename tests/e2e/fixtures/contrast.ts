/**
 * Calculate relative luminance for the browser's opaque rgb color serialization.
 **/
function luminance(color: string): number {
  const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => value / 255);
  const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);

  return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722;
}

/**
 * Compare two opaque CSS rgb colors using the WCAG contrast formula.
 **/
export function contrast(first: string, second: string): number {
  const brighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));

  return (brighter + 0.05) / (darker + 0.05);
}
