import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Icon, type NamedIconProps } from '../Icon.js';

/**
 * Optional Moon artwork using the shared Icon sizing and accessibility contract.
 **/
export const MoonIcon: ForwardRefExoticComponent<NamedIconProps & RefAttributes<SVGSVGElement>> =
  /* @__PURE__ */ forwardRef<SVGSVGElement, NamedIconProps>(function MoonIcon(props, ref) {
    return (
      <Icon {...props} ref={ref} viewBox="0 0 24 24">
        <path d="M20.9 13.4A9 9 0 0 1 10.6 3.1 9 9 0 1 0 20.9 13.4Z" />
      </Icon>
    );
  });
