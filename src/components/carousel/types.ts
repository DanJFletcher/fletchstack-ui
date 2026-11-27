import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

export type CarouselSlide = { id: string; content: ReactNode; label?: string };
export type CarouselStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
export type CarouselProps = Omit<
  ComponentPropsWithoutRef<'section'>,
  'children' | 'style' | 'dangerouslySetInnerHTML' | 'onChange'
> & {
  children?: never;
  dangerouslySetInnerHTML?: never;
  label: string;
  slides: readonly CarouselSlide[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  loop?: boolean;
  showControls?: boolean;
  indicators?: 'dots' | 'fraction' | 'none';
  indicatorTargetSize?: 'comfortable' | 'compact';
  controlsPosition?: 'below' | 'overlay';
  overlaySafeArea?: boolean;
  frameAspectRatio?: number;
  variant?: 'surface' | 'outlined' | 'subtle' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  autoPlay?: boolean;
  autoPlayInterval?: number;
  previousLabel?: string;
  nextLabel?: string;
  pauseLabel?: string;
  startLabel?: string;
  getSlideLabel?: (index: number, total: number, slide: CarouselSlide) => string;
  getIndicatorLabel?: (index: number, total: number) => string;
  emptyMessage?: ReactNode;
  style?: CarouselStyle;
};
