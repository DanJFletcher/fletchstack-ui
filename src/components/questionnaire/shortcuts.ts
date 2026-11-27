import type { KeyboardEvent } from 'react';

/**
 * Map only the bounded single-character hints assigned to enabled choices in display order.
 **/
export function shortcutLabel(
  mode: 'none' | 'letters' | 'numbers',
  index: number,
): string | undefined {
  if (mode === 'letters' && index < 26) {
    return String.fromCharCode(65 + index);
  }
  if (mode === 'numbers' && index < 9) {
    return String(index + 1);
  }

  return undefined;
}

/**
 * Leave native editing, input-method composition and modified/repeated keystrokes untouched.
 **/
function shortcutIgnored(event: KeyboardEvent<HTMLFormElement>) {
  const editable = (event.target as HTMLElement).closest(
    'textarea, input:not([type="radio"]):not([type="checkbox"]), [contenteditable]:not([contenteditable="false"])',
  );

  return (
    event.defaultPrevented ||
    event.repeat ||
    event.nativeEvent.isComposing ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    Boolean(editable)
  );
}

/**
 * Activate a scoped enabled native control once, preserving its own radio/checkbox change behavior.
 **/
export function activateShortcut(
  event: KeyboardEvent<HTMLFormElement>,
  mode: 'none' | 'letters' | 'numbers',
  fieldset: HTMLFieldSetElement | null,
): void {
  if (mode === 'none' || !fieldset || shortcutIgnored(event)) {
    return;
  }
  const controls = Array.from(
    fieldset.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]:not(:disabled), input[type="checkbox"]:not(:disabled)',
    ),
  );
  const control = controls.find(
    (_, index) => shortcutLabel(mode, index)?.toLowerCase() === event.key.toLowerCase(),
  );
  if (!control) {
    return;
  }
  event.preventDefault();
  control.focus();
  control.click();
}
