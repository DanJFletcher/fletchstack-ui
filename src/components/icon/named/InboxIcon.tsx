import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Icon, type NamedIconProps } from '../Icon.js';

/**
 * Render Inbox destination artwork with shared icon sizing and accessibility.
 **/
export const InboxIcon: ForwardRefExoticComponent<NamedIconProps & RefAttributes<SVGSVGElement>> = /* @__PURE__ */ forwardRef<SVGSVGElement, NamedIconProps>(function InboxIcon(props, ref) {
  return <Icon {...props} ref={ref} viewBox="0 0 24 24"><path d="M4 4h16l3 14v3H1v-3L4 4Zm-2 13h6l2 3h4l2-3h6" /></Icon>;
});
