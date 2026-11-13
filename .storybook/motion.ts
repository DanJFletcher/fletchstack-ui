import { addons } from 'storybook/preview-api';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';

/**
 * Apply the preview's explicit mode once at the document boundary, shared by all Docs canvases.
 **/
export function applyMotionPreview({ globals }: { globals: Record<string, unknown> }): void {
  const mode = globals['motion'];
  const root = document.documentElement;

  if (mode === 'reduced' || mode === 'full') { root.dataset['fsPreviewMotion'] = mode; }
  else { delete root.dataset['fsPreviewMotion']; }
}

/**
 * Subscribe once per preview lifecycle and remove both the listener and marker on teardown.
 **/
export function installMotionPreview(): () => void {
  const channel = addons.getChannel();
  channel.on(GLOBALS_UPDATED, applyMotionPreview);

  return () => {
    channel.off(GLOBALS_UPDATED, applyMotionPreview);
    delete document.documentElement.dataset['fsPreviewMotion'];
  };
}
