import { useSyncExternalStore } from 'react';

/**
 * Subscribe to the caller's CSS viewport width while preserving a complete, hydration-safe server trail.
 **/
export function useBreadcrumbBreakpoint(collapseAt: string): boolean {
  const query = `(max-width: ${collapseAt})`;
  const subscribe = (changed: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener('change', changed);
    return () => media.removeEventListener('change', changed);
  };

  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
