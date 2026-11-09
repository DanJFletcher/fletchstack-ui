import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Icon, type NamedIconProps } from '../Icon.js';

/**
 * Optional ChevronDown artwork using the shared Icon sizing and accessibility contract.
 **/
export const ChevronDownIcon: ForwardRefExoticComponent<NamedIconProps & RefAttributes<SVGSVGElement>> = /* @__PURE__ */ forwardRef<SVGSVGElement, NamedIconProps>(function ChevronDownIcon(props, ref) {
  return <Icon {...props} ref={ref} viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></Icon>;
});
