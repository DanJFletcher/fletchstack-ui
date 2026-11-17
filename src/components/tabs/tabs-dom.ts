/**
 * Find a tab directly owned by this list using its original stable item identity.
 **/
export function findTab(list: HTMLDivElement, id: string): HTMLButtonElement {
  return Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]')).find(tab => tab.dataset['tabsId'] === id)!;
}

/**
 * Reveal only the nearest clipped edge inside the horizontal list, never a page ancestor.
 **/
export function revealTab(list: HTMLDivElement, tab: HTMLButtonElement): void {
  const viewport = list.getBoundingClientRect(), target = tab.getBoundingClientRect();
  const offset = target.left < viewport.left ? target.left - viewport.left : Math.max(0, target.right - viewport.right);
  list.scrollLeft += offset;
}
