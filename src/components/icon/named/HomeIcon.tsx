import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Icon, type NamedIconProps } from '../Icon.js';

/**
 * Render Home destination artwork with shared icon sizing and accessibility.
 **/
export const HomeIcon: ForwardRefExoticComponent<NamedIconProps & RefAttributes<SVGSVGElement>> =
  /* @__PURE__ */ forwardRef<SVGSVGElement, NamedIconProps>(function HomeIcon(props, ref) {
    return (
      <Icon {...props} ref={ref} viewBox="0 0 24 24">
        <path d="M3 10l9-7 9 7M5 9v12h5v-7h4v7h5V9" />
      </Icon>
    );
  });
