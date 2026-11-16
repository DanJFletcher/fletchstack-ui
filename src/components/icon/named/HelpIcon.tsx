import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Icon, type NamedIconProps } from '../Icon.js';

/**
 * Render Help destination artwork with shared icon sizing and accessibility.
 **/
export const HelpIcon: ForwardRefExoticComponent<NamedIconProps & RefAttributes<SVGSVGElement>> = /* @__PURE__ */ forwardRef<SVGSVGElement, NamedIconProps>(function HelpIcon(props, ref) {
  return <Icon {...props} ref={ref} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4m.1 3h.01" /></Icon>;
});
