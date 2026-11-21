import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';

/**
 * Subscribe automatic movement to live operating-system preference changes.
 **/
function subscribe(update: () => void): () => void {
  const media = window.matchMedia(query);
  media.addEventListener('change', update);
  return () => media.removeEventListener('change', update);
}

/**
 * Read the actual visitor preference independently of Storybook inspection overrides.
 **/
function snapshot(): boolean {
  return window.matchMedia(query).matches;
}

/**
 * Keep automatic movement disabled until a browser preference can be read.
 **/
function serverSnapshot(): boolean {
  return true;
}

/**
 * Follow live reduced-motion changes with a conservative server-rendered snapshot.
 **/
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
