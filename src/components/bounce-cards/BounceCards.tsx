import {
  forwardRef,
  useImperativeHandle,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';
import { FanCard } from './FanCard.js';
import { useFan, type FanModel, type FanStyle } from './useFan.js';
import type { BounceCardsProps, BounceCardsStyle } from './types.js';
export type {
  BounceCardsProps,
  BounceCardsStyle,
  BounceCardsImage,
  BounceCardsPosition,
} from './types.js';

/**
 * Keep component configuration off the native wrapper while preserving consumer attributes.
 **/
function nativeProps(props: BounceCardsProps) {
  const native = { ...props };
  for (const key of [
    'images',
    'label',
    'containerWidth',
    'containerHeight',
    'cardSize',
    'spread',
    'rotation',
    'arc',
    'pushDistance',
    'hoverScale',
    'bounciness',
    'animationDelay',
    'animationStagger',
    'enableHover',
    'shadow',
    'positions',
    'onCardClick',
    'getCardLabel',
    'emptyMessage',
  ]) {
    Reflect.deleteProperty(native, key);
  }
  return native;
}

/**
 * Apply responsive geometry without scaling below usable native action targets.
 **/
function rootStyle(model: FanModel, style: BounceCardsStyle | undefined): FanStyle {
  return {
    inlineSize: model.settings.containerWidth,
    blockSize: model.grid
      ? 'auto'
      : Math.max(model.settings.containerHeight * model.scale, model.bounds.height * model.scale),
    '--fan-width': `${model.bounds.width}px`,
    '--fan-height': `${model.bounds.height}px`,
    '--fan-layout-scale': model.scale,
    '--fan-card-size': `${model.settings.cardSize}px`,
    '--fan-overshoot': 1 + model.settings.bounciness * 0.15,
    ...style,
  };
}

/**
 * Present a responsive photo fan with staggered entrances and equivalent action focus feedback.
 **/
export const BounceCards: ForwardRefExoticComponent<
  BounceCardsProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, BounceCardsProps>(function BounceCards(props, ref) {
  const model = useFan(props);
  useImperativeHandle(ref, () => model.root.current!, [model.root]);
  return (
    <div
      {...nativeProps(props)}
      ref={model.root}
      role="group"
      aria-label={props.label ?? props['aria-label'] ?? 'Photo cards'}
      className={['fs-bounce-cards', props.className].filter(Boolean).join(' ')}
      style={rootStyle(model, props.style)}
      data-layout={model.grid ? 'grid' : 'fan'}
      data-shadow={props.shadow !== false}
      onPointerMove={(event) => {
        props.onPointerMove?.(event);
        if (!model.grid) {
          model.move(event);
        }
      }}
      onPointerLeave={(event) => {
        props.onPointerLeave?.(event);
        model.clear();
      }}
    >
      {model.images.length === 0 ? (
        <p className="fs-bounce-cards__empty">{props.emptyMessage ?? 'No photos to display.'}</p>
      ) : (
        <ul className="fs-bounce-cards__scene">
          {model.images.map((image, index) => (
            <FanCard key={image.id} image={image} index={index} model={model} props={props} />
          ))}
        </ul>
      )}
    </div>
  );
});
