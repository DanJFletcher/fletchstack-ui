import { forwardRef, type ComponentPropsWithoutRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import type { ItemStyle } from './Item.js';

export type ItemPartProps = Omit<ComponentPropsWithoutRef<'div'>, 'style' | 'dangerouslySetInnerHTML'> & { style?: ItemStyle };
export type ItemDescriptionProps = Omit<ComponentPropsWithoutRef<'p'>, 'style' | 'dangerouslySetInnerHTML'> & { style?: ItemStyle };
export type ItemMediaProps = ItemPartProps & { variant?: 'default' | 'icon' | 'image' | 'avatar' };

/**
 * Provide the group region of a content row without adding interaction behavior.
 **/
export const ItemGroup: ForwardRefExoticComponent<ItemPartProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, ItemPartProps>(function ItemGroup({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={['fs-item-group', className].filter(Boolean).join(' ')} />;
});

/**
 * Provide the media region of a content row without adding interaction behavior.
 **/
export const ItemMedia: ForwardRefExoticComponent<ItemMediaProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, ItemMediaProps>(function ItemMedia({ variant = 'default', className, ...props }, ref) {
  return <div {...props} ref={ref} className={['fs-item__media', `fs-item__media--${variant}`, className].filter(Boolean).join(' ')} />;
});

/**
 * Provide the content region of a content row without adding interaction behavior.
 **/
export const ItemContent: ForwardRefExoticComponent<ItemPartProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, ItemPartProps>(function ItemContent({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={['fs-item__content', className].filter(Boolean).join(' ')} />;
});

/**
 * Provide the title region of a content row without adding interaction behavior.
 **/
export const ItemTitle: ForwardRefExoticComponent<ItemPartProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, ItemPartProps>(function ItemTitle({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={['fs-item__title', className].filter(Boolean).join(' ')} />;
});

/**
 * Provide the description region of a content row without adding interaction behavior.
 **/
export const ItemDescription: ForwardRefExoticComponent<ItemDescriptionProps & RefAttributes<HTMLParagraphElement>> = /* @__PURE__ */ forwardRef<HTMLParagraphElement, ItemDescriptionProps>(function ItemDescription({ className, ...props }, ref) {
  return <p {...props} ref={ref} className={['fs-item__description', className].filter(Boolean).join(' ')} />;
});

/**
 * Provide the actions region of a content row without adding interaction behavior.
 **/
export const ItemActions: ForwardRefExoticComponent<ItemPartProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, ItemPartProps>(function ItemActions({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={['fs-item__actions', className].filter(Boolean).join(' ')} />;
});

/**
 * Provide the header region of a content row without adding interaction behavior.
 **/
export const ItemHeader: ForwardRefExoticComponent<ItemPartProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, ItemPartProps>(function ItemHeader({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={['fs-item__header', className].filter(Boolean).join(' ')} />;
});

/**
 * Provide the footer region of a content row without adding interaction behavior.
 **/
export const ItemFooter: ForwardRefExoticComponent<ItemPartProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, ItemPartProps>(function ItemFooter({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={['fs-item__footer', className].filter(Boolean).join(' ')} />;
});

/**
 * Provide the separator region of a content row without adding interaction behavior.
 **/
export const ItemSeparator: ForwardRefExoticComponent<ItemPartProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, ItemPartProps>(function ItemSeparator({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={['fs-item-separator', className].filter(Boolean).join(' ')} aria-hidden="true" />;
});
