import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Icon, type NamedIconProps } from '../Icon.js';

/**
 * Optional Close artwork using the shared Icon sizing and accessibility contract.
 **/
export const CloseIcon: ForwardRefExoticComponent<NamedIconProps & RefAttributes<SVGSVGElement>> =
  /* @__PURE__ */ forwardRef<SVGSVGElement, NamedIconProps>(function CloseIcon(props, ref) {
    return (
      <Icon {...props} ref={ref} viewBox="0 0 24 24">
        <path d="m6 6 12 12M6 18 18 6" />
      </Icon>
    );
  });
