import { useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from '../../internal/hooks/useReducedMotion.js';
import { clampIndex, nextIndex } from './carousel-policy.js';
import type { CarouselProps } from './types.js';

/**
 * Own selection requests and rotation pauses while preserving controlled state.
 **/
export function useCarousel(props: CarouselProps): CarouselModel {
  const [stopped, stop] = useState(false),
    [hovered, hover] = useState(false);
  const reduced = useReducedMotion(),
    pointerStop = useRef<boolean | null>(null);
  const { index, select } = useSelection(props, stop);
  const playing = Boolean(
    props.autoPlay &&
    !stopped &&
    !reduced &&
    props.slides.length > 1 &&
    (props.loop || index < props.slides.length - 1),
  );
  const rotating = playing && !hovered;
  useRotation(rotating, props.autoPlayInterval, () => select(index + 1, false));
  return {
    index,
    playing,
    rotating,
    reduced,
    select,
    stop,
    hover,
    pointerStop,
    toggle: () => {
      stop(pointerStop.current ?? !stopped);
      pointerStop.current = null;
    },
    stopped,
  };
}

/**
 * Resolve controlled/uncontrolled selection and emit only changed index requests.
 **/
function useSelection(
  props: CarouselProps,
  stop: (stopped: boolean) => void,
): Pick<CarouselModel, 'index' | 'select'> {
  const [internal, setInternal] = useState(props.defaultIndex ?? 0);
  const index = clampIndex(props.index ?? internal, props.slides.length);
  /**
   * Stop manual rotation before requesting a bounded selection.
   **/
  const select = (requested: number, manual = true) => {
    if (manual) {
      stop(true);
    }
    const target = nextIndex(requested, props.slides.length, props.loop ?? false);
    if (target === index) {
      return;
    }
    if (props.index === undefined) {
      setInternal(target);
    }
    props.onIndexChange?.(target);
  };
  return { index, select };
}

/**
 * Schedule one advance from the current render and clean it up on every pause or unmount.
 **/
function useRotation(rotating: boolean, interval: number | undefined, advance: () => void): void {
  useEffect(() => {
    if (!rotating) {
      return;
    }
    const delay =
      interval !== undefined && Number.isFinite(interval) ? Math.max(1000, interval) : 5000;
    const timer = window.setTimeout(advance, delay);
    return () => window.clearTimeout(timer);
  }, [rotating, interval, advance]);
}

export type CarouselModel = {
  index: number;
  playing: boolean;
  rotating: boolean;
  reduced: boolean;
  stopped: boolean;
  select: (index: number, manual?: boolean) => void;
  stop: (stopped: boolean) => void;
  hover: (hovered: boolean) => void;
  pointerStop: RefObject<boolean | null>;
  toggle: () => void;
};
