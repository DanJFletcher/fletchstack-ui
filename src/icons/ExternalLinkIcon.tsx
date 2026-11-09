import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Icon, type NamedIconProps } from '../Icon.js';

/**
 * Optional ExternalLink artwork using the shared Icon sizing and accessibility contract.
 **/
export const ExternalLinkIcon: ForwardRefExoticComponent<NamedIconProps & RefAttributes<SVGSVGElement>> = /* @__PURE__ */ forwardRef<SVGSVGElement, NamedIconProps>(function ExternalLinkIcon(props, ref) {
  return <Icon {...props} ref={ref} viewBox="0 0 24 24"><path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" /></Icon>;
});
