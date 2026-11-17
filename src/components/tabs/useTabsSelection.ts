import { useState } from 'react';
import { selectedTab } from './tabs-policy.js';
import type { TabsProps } from './types.js';

export interface TabsSelection { selected: string | undefined; select: (id: string) => void }

/**
 * Preserve controlled authority and settle uncontrolled fallback without change callbacks.
 **/
export function useTabsSelection(props: TabsProps, enabled: readonly string[]): TabsSelection {
  const controlled = props.value !== undefined;
  const [stored, setStored] = useState(() => selectedTab(enabled, props.defaultValue));
  const selected = selectedTab(enabled, controlled ? props.value : stored);
  if (!controlled && stored !== selected) { setStored(selected); }
  const select = (id: string) => {
    if (id === selected || !enabled.includes(id)) { return; }
    if (!controlled) { setStored(id); }
    props.onValueChange?.(id);
  };

  return { selected, select };
}
