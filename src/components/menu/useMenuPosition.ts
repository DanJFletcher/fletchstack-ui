import { useEffect, type RefObject } from 'react';

/**
 * Clamp a panel to the viewport, flipping a child horizontally or a root vertically when useful.
 **/
function placeMenu(panel: HTMLUListElement, anchor: HTMLElement, nested: boolean): void {
  const bounds = anchor.getBoundingClientRect();
  const style = getComputedStyle(panel);
  const inset = Number.parseFloat(style.getPropertyValue('--fs-menu-viewport-inset')) || 0;
  const gap = Number.parseFloat(style.getPropertyValue('--fs-menu-panel-gap')) || 0;
  const width = panel.offsetWidth,
    height = panel.offsetHeight;
  let left = nested ? bounds.right + gap : bounds.left;
  let top = nested ? bounds.top : bounds.bottom + gap;
  if (nested && left + width > window.innerWidth - inset) {
    left = bounds.left - width - gap;
  }
  if (!nested && top + height > innerHeight - inset) {
    top = bounds.top - height - gap;
  }
  left = Math.max(inset, Math.min(left, innerWidth - width - inset));
  top = Math.max(inset, Math.min(top, innerHeight - height - inset));
  Object.assign(panel.style, {
    left: `${left}px`,
    top: `${top}px`,
    maxHeight: `${innerHeight - top - inset}px`,
  });
}

/**
 * Reposition open panels after resize/scroll; inline children let CSS own their geometry.
 **/
export function useMenuPosition(
  panel: RefObject<HTMLUListElement | null>,
  anchorId: string,
  nested: boolean,
): void {
  useEffect(() => {
    const position = () => {
      if (getComputedStyle(panel.current!).position !== 'static') {
        placeMenu(panel.current!, document.getElementById(anchorId)!, nested);
      }
    };
    position();
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    return () => {
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
    };
  }, [panel, anchorId, nested]);
}
