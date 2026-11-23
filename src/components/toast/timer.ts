import { useEffect, useRef, type RefObject } from 'react';

type Timer = { remaining: number; started: number; handle: ReturnType<typeof setTimeout> | undefined; expired: boolean; paused: Set<string>; expire: () => void };

/**
 * Stop the running clock and retain only the unconsumed lifetime.
 **/
function pause(timer: Timer, reason: string): void {
  timer.paused.add(reason);
  if (timer.handle === undefined) { return; }
  clearTimeout(timer.handle);
  timer.handle = undefined;
  timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.started));
}

/**
 * Resume once every independent pause reason has cleared; expire at most once.
 **/
function resume(timer: Timer, reason: string): void {
  timer.paused.delete(reason);
  if (timer.paused.size || timer.expired || timer.handle !== undefined) { return; }
  timer.started = Date.now();
  timer.handle = setTimeout(() => {
    timer.expired = true;
    timer.handle = undefined;
    timer.expire();
  }, timer.remaining);
}

type Listener = readonly [string, EventListener];

/**
 * Subscribe one event target and return a matching cleanup for every listener.
 **/
function observeEvents(target: EventTarget, listeners: readonly Listener[]): () => void {
  for (const [name, listener] of listeners) { target.addEventListener(name, listener); }

  return () => {
    for (const [name, listener] of listeners) { target.removeEventListener(name, listener); }
  };
}

/**
 * Keep focus transfers within a toast paused independently of pointer interaction.
 **/
function interactionListeners(element: HTMLElement, timer: Timer): Listener[] {
  return [
    ['pointerenter', () => pause(timer, 'pointer')],
    ['pointerleave', () => resume(timer, 'pointer')],
    ['focusin', () => pause(timer, 'focus')],
    ['focusout', event => {
      if (!element.contains((event as FocusEvent).relatedTarget as Node | null)) { resume(timer, 'focus'); }
    }],
  ];
}

/**
 * Bind hover, keyboard focus and tab visibility to one remaining-time clock.
 **/
function observeTimer(element: HTMLElement, timer: Timer): () => void {
  const visibility = () => { if (document.hidden) { pause(timer, 'document'); } else { resume(timer, 'document'); } };
  const stopInteraction = observeEvents(element, interactionListeners(element, timer));
  const stopVisibility = observeEvents(document, [['visibilitychange', visibility]]);
  if (element.matches(':hover')) { pause(timer, 'pointer'); }
  if (element.contains(document.activeElement)) { pause(timer, 'focus'); }
  visibility();

  return () => {
    clearTimeout(timer.handle);
    stopInteraction();
    stopVisibility();
  };
}

/**
 * Start a fresh lifetime only when visibility or duration changes, never on callback updates.
 **/
export function useToastTimer(element: RefObject<HTMLDivElement | null>, options: { active: boolean; duration: number }, expire: () => void): void {
  const callback = useRef(expire);
  callback.current = expire;
  const { active, duration } = options;

  useEffect(() => {
    if (!active || !Number.isFinite(duration) || duration <= 0) { return; }
    const timer: Timer = { remaining: Math.min(duration, 2147483647), started: 0, handle: undefined, expired: false, paused: new Set(), expire: () => callback.current() };
    return observeTimer(element.current!, timer);
  }, [active, duration, element]);
}
