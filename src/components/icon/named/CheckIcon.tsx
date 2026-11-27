import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Icon, type NamedIconProps } from '../Icon.js';

/**
 * Optional Check artwork using the shared Icon sizing and accessibility contract.
 **/
export const CheckIcon: ForwardRefExoticComponent<NamedIconProps & RefAttributes<SVGSVGElement>> =
  /* @__PURE__ */ forwardRef<SVGSVGElement, NamedIconProps>(function CheckIcon(props, ref) {
    return (
      <Icon {...props} ref={ref} viewBox="0 0 24 24">
        <path d="m5 12 4 4L19 6" />
      </Icon>
    );
  });
