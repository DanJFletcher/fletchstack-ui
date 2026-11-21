import { Children, Fragment, cloneElement, forwardRef, useId, useImperativeHandle, useMemo, useRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import type { TooltipProps } from './types.js';
import { useTooltipState, type TooltipActions } from './useTooltipState.js';
import { useTooltipLayer } from './useTooltipLayer.js';
import { useTooltipDismissal } from './useTooltipDismissal.js';

/**
 * Add a supplementary description without replacing the child's refs, handlers or existing IDs.
 **/
function describedTrigger(children: TooltipProps['children'], id: string) {
  const child = Children.only(children);
  if (child.type === Fragment) { throw new Error('Tooltip requires one trigger element, not a Fragment.'); }

  return cloneElement(child, { 'aria-describedby': [child.props['aria-describedby'], id].filter(Boolean).join(' ') });
}

/**
 * Compose native wrapper handlers and respect cancellation without cloning child event handlers.
 **/
function tooltipEvents(props: TooltipProps, actions: TooltipActions & { open: boolean }): Pick<TooltipProps, 'onFocus' | 'onBlur' | 'onPointerEnter' | 'onPointerLeave' | 'onPointerDown' | 'onKeyDown'> {
  return {
    onFocus: event => { props.onFocus?.(event); if (!event.defaultPrevented) { actions.show('focused'); } },
    onBlur: event => { props.onBlur?.(event); if (!event.defaultPrevented && !event.currentTarget.contains(event.relatedTarget)) { actions.blur(); } },
    onPointerEnter: event => { props.onPointerEnter?.(event); if (!event.defaultPrevented && event.pointerType !== 'touch') { actions.show('hovered'); } },
    onPointerLeave: event => { props.onPointerLeave?.(event); if (!event.defaultPrevented && event.pointerType !== 'touch') { actions.leave(); } },
    onPointerDown: event => { props.onPointerDown?.(event); if (!event.defaultPrevented) { actions.pointer(event.pointerType); } },
    onKeyDown: event => { props.onKeyDown?.(event); if (!event.defaultPrevented && event.key === 'Escape' && actions.open) { event.preventDefault(); event.stopPropagation(); actions.dismiss(); } },
  };
}

/**
 * Attach non-interactive contextual help to one unchanged focusable trigger.
 **/
export const Tooltip: ForwardRefExoticComponent<TooltipProps & RefAttributes<HTMLSpanElement>> = /* @__PURE__ */ forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(props, ref) {
  const { children, content, placement = 'top', className, style, ...native } = props;
  const anchor = useRef<HTMLSpanElement>(null), panel = useRef<HTMLDivElement>(null), id = `tooltip-${useId()}`;
  const elements = useMemo(() => ({ anchor, panel }), []), state = useTooltipState();
  useImperativeHandle(ref, () => anchor.current!, []);
  useTooltipLayer(elements, state.open, placement); useTooltipDismissal(elements, state.open, state.dismiss);

  return <span {...native} {...tooltipEvents(props, state)} ref={anchor} style={style} className={['fs-tooltip', className].filter(Boolean).join(' ')}>
    {describedTrigger(children, id)}
    <div ref={panel} id={id} role="tooltip" popover="manual" hidden={!state.open} className="fs-tooltip__content">{content}</div>
  </span>;
});
