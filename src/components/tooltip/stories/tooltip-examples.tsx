import { useRef, useState } from 'react';
import { Tooltip } from '../Tooltip';
import type { TooltipProps } from '../types';
import { Button } from '../../button/Button';
import { HelpIcon } from '../../icon/named/HelpIcon';
import { Popover } from '../../popover/Popover';
import { Dialog } from '../../dialog/Dialog';

/**
 * Keep the action's meaning independent from its supplementary description.
 **/
export function TooltipDemo(props: Partial<Omit<TooltipProps, 'children'>>) {
  const [actions, setActions] = useState(0), triggerRef = useRef<HTMLButtonElement>(null);

  return <div className="tooltip-demo__controls"><Tooltip content="Brief contextual help appears on hover or keyboard focus." {...props}><Button ref={triggerRef} variant="secondary" onClick={() => setActions(value => value + 1)}>More information</Button></Tooltip><Button variant="secondary">Next action</Button><output aria-label="Activations">{actions}</output></div>;
}

/**
 * Show the same supplementary help under Corporate and Luna token regions.
 **/
export function TooltipExample() {
  return <div className="tooltip-demo"><h1>Tooltip</h1><p>Short supplementary help for hover, keyboard focus, or touch.</p>{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="tooltip-demo__theme"><h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2><TooltipDemo /></section>)}</div>;
}

/**
 * Demonstrate the four preferred sides without hiding essential labels.
 **/
export function TooltipPlacements() {
  return <div className="tooltip-demo__placements">{(['top', 'right', 'bottom', 'left'] as const).map(placement => <Tooltip key={placement} placement={placement} content={`${placement} supplementary help`}><Button variant="secondary">{placement}</Button></Tooltip>)}</div>;
}

/**
 * Share one trigger's existing hint rather than replacing its accessible description.
 **/
export function DescribedTooltip() {
  return <><p id="tooltip-existing-hint">Existing project guidance.</p><Tooltip content="Additional contextual help."><Button aria-describedby="tooltip-existing-hint" variant="secondary">Project help</Button></Tooltip></>;
}

/**
 * Explain an icon-only action without using the tooltip as its accessible name.
 **/
export function IconTooltip() {
  return <Tooltip content="Learn about the current workspace."><Button variant="ghost" aria-label="Workspace help"><HelpIcon /></Button></Tooltip>;
}

/**
 * Keep native links and their consumer navigation behavior intact.
 **/
export function LinkTooltip() {
  return <Tooltip content="Read the workspace documentation."><a href="#workspace-docs">Workspace docs</a></Tooltip>;
}

/**
 * Make clipping and transform boundaries visible while the tooltip escapes through the top layer.
 **/
export function ClippedTooltip() {
  return <div className="tooltip-demo__clipped"><Tooltip placement="right" content="This description escapes the transformed, clipped panel."><Button variant="secondary">Clipped panel help</Button></Tooltip></div>;
}

/**
 * Keep an anchored description aligned when a scrollable ancestor moves.
 **/
export function ScrollableTooltip() {
  return <div className="tooltip-demo__scroll" aria-label="Scrollable help examples" tabIndex={0}><div className="tooltip-demo__scroll-content"><Tooltip content="This help follows its trigger during scrolling."><Button variant="secondary">Scrollable help</Button></Tooltip></div></div>;
}

/**
 * Show per-instance tokens alongside an unchanged neighboring tooltip.
 **/
export function TooltipOverrides() {
  return <div className="tooltip-demo__controls"><Tooltip content="Custom contextual help" style={{ '--fs-tooltip-radius': '20px', '--fs-tooltip-max-width': '200px' }}><Button variant="secondary">Custom tooltip</Button></Tooltip><Tooltip content="Default contextual help"><Button variant="secondary">Default tooltip</Button></Tooltip></div>;
}

/**
 * A tooltip consumes Escape before its surrounding non-modal panel.
 **/
export function TooltipInPopover() {
  return <Popover triggerLabel="Project details" heading="Project details"><Tooltip content="Additional detail without leaving the panel."><Button variant="secondary">Panel help</Button></Tooltip></Popover>;
}

/**
 * Supplement a modal's controls without moving focus out of that modal.
 **/
export function TooltipInDialog() {
  const [open, setOpen] = useState(false);

  return <><Button onClick={() => setOpen(true)}>Open review</Button><Dialog open={open} onOpenChange={setOpen} heading="Review changes"><TooltipDemo /></Dialog></>;
}
