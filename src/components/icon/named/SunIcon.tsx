import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Icon, type NamedIconProps } from '../Icon.js';

/**
 * Optional Sun artwork using the shared Icon sizing and accessibility contract.
 **/
export const SunIcon: ForwardRefExoticComponent<NamedIconProps & RefAttributes<SVGSVGElement>> =
  /* @__PURE__ */ forwardRef<SVGSVGElement, NamedIconProps>(function SunIcon(props, ref) {
    return (
      <Icon {...props} ref={ref} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
      </Icon>
    );
  });
