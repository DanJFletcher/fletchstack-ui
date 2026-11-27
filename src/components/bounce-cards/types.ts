import type { ComponentPropsWithoutRef, CSSProperties } from 'react';

export type BounceCardsImage = { id?: string; src: string; alt?: string };
export type BounceCardsPosition = { x: number; y: number; rotation?: number };
export type BounceCardsStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
export type BounceCardsProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'style' | 'dangerouslySetInnerHTML'
> & {
  children?: never;
  dangerouslySetInnerHTML?: never;
  images: readonly (string | BounceCardsImage)[];
  label?: string;
  containerWidth?: number;
  containerHeight?: number;
  cardSize?: number;
  spread?: number;
  rotation?: number;
  arc?: number;
  pushDistance?: number;
  hoverScale?: number;
  bounciness?: number;
  /** Seconds before entrance; defaults to 0.5. */
  animationDelay?: number;
  /** Seconds between entrances; defaults to 0.06. */
  animationStagger?: number;
  enableHover?: boolean;
  shadow?: boolean;
  positions?: readonly BounceCardsPosition[];
  onCardClick?: (index: number, image: BounceCardsImage) => void;
  getCardLabel?: (index: number, image: BounceCardsImage) => string;
  emptyMessage?: string;
  style?: BounceCardsStyle;
};
