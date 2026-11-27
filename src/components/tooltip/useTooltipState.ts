import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';

interface Activity {
  hovered: boolean;
  focused: boolean;
  touch: boolean;
  dismissed: boolean;
  touchPointer: boolean;
}
export interface TooltipActions {
  show: (kind: 'hovered' | 'focused') => void;
  leave: () => void;
  blur: () => void;
  pointer: (type: string) => void;
  dismiss: () => void;
}

/**
 * Keep an Escape dismissal closed until a fresh focus or hover interaction.
 **/
function active(activity: Activity) {
  return !activity.dismissed && (activity.hovered || activity.focused || activity.touch);
}

/**
 * Combine focus, pointer and touch ownership without moving focus or modifying the trigger.
 **/
function tooltipActions(
  activity: Activity,
  setOpen: (open: boolean) => void,
  timer: RefObject<number | undefined>,
): TooltipActions {
  const clear = () => window.clearTimeout(timer.current);
  const refresh = () => setOpen(active(activity));
  const show: TooltipActions['show'] = (kind) => {
    clear();
    activity[kind] = true;
    if (kind === 'hovered' || !activity.touchPointer) {
      activity.dismissed = false;
    }
    refresh();
  };
  const leave = () => {
    activity.hovered = false;
    clear();
    timer.current = window.setTimeout(refresh, 100);
  };
  const blur = () => {
    activity.focused = false;
    activity.touch = false;
    activity.touchPointer = false;
    refresh();
  };
  const pointer = (type: string) => {
    activity.touchPointer = type === 'touch';
    if (activity.touchPointer) {
      activity.touch = !active(activity);
      activity.dismissed = !activity.touch;
      clear();
      refresh();
    }
  };
  const dismiss = () => {
    clear();
    activity.touch = false;
    activity.dismissed = true;
    refresh();
  };

  return { show, leave, blur, pointer, dismiss };
}

/**
 * Retain interaction ownership across renders and cancel pointer-transfer grace on unmount.
 **/
export function useTooltipState(): TooltipActions & { open: boolean } {
  const [open, setOpen] = useState(false),
    timer = useRef<number | undefined>(undefined);
  const activity = useRef<Activity>({
    hovered: false,
    focused: false,
    touch: false,
    dismissed: false,
    touchPointer: false,
  });
  const actions = useMemo(() => tooltipActions(activity.current, setOpen, timer), []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { open, ...actions };
}
