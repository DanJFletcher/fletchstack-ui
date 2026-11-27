import { useEffect, useRef, useState, type RefObject } from 'react';

export interface NavbarWidth {
  compact: boolean;
  resizeFocus: RefObject<HTMLElement | null>;
}

/**
 * Observe available component width instead of the viewport, with complete server-rendered content.
 **/
export function useNavbarWidth(root: RefObject<HTMLElement | null>): NavbarWidth {
  const [compact, setCompact] = useState(false),
    current = useRef(false),
    resizeFocus = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = root.current!;
    const observer = new ResizeObserver((entries) => {
      const next = compactNavbar(element, entries[0]!.contentRect.width);
      if (next !== current.current) {
        resizeFocus.current = element.contains(document.activeElement)
          ? (document.activeElement as HTMLElement)
          : null;
        current.current = next;
        setCompact(next);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [root]);

  return { compact, resizeFocus };
}

/**
 * Interpret the component's semantic pixel boundary against its available content width.
 **/
function compactNavbar(element: HTMLElement, width: number): boolean {
  return (
    width <=
    Number.parseFloat(getComputedStyle(element).getPropertyValue('--fs-navbar-collapse-width'))
  );
}
