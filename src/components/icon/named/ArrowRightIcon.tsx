import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Icon, type NamedIconProps } from '../Icon.js';

/**
 * Optional ArrowRight artwork using the shared Icon sizing and accessibility contract.
 **/
export const ArrowRightIcon: ForwardRefExoticComponent<
  NamedIconProps & RefAttributes<SVGSVGElement>
> = /* @__PURE__ */ forwardRef<SVGSVGElement, NamedIconProps>(function ArrowRightIcon(props, ref) {
  return (
    <Icon {...props} ref={ref} viewBox="0 0 24 24">
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </Icon>
  );
});
