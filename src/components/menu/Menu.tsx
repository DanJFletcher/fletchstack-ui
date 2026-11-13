import { forwardRef, useImperativeHandle, type ForwardRefExoticComponent, type RefAttributes, type ComponentPropsWithoutRef } from 'react';
import { Button } from '../button/Button.js';
import { MenuLevel } from './MenuLevel.js';
import { menuTriggerKey } from './menu-keyboard.js';
import { useMenu } from './useMenu.js';
import type { MenuProps } from './types.js';
export type { MenuProps, MenuStyle, MenuItem, MenuActionItem, MenuLinkItem, MenuSubmenuItem, MenuDividerItem, MenuSelectEvent } from './types.js';

/**
 * Keep configuration out of native root attributes while forwarding consumer styles and events.
 **/
function menuAttributes(props: MenuProps): ComponentPropsWithoutRef<'div'> {
  const attributes = { ...props };
  for (const key of ['triggerLabel', 'menuLabel', 'items', 'open', 'defaultOpen', 'onOpenChange', 'closeOnSelect', 'emptyMessage', 'className']) { Reflect.deleteProperty(attributes, key); }

  return attributes;
}

/**
 * Present a named action menu with recursive branches and consumer-controlled root expansion.
 **/
export const Menu: ForwardRefExoticComponent<MenuProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, MenuProps>(function Menu(
  props, ref,
) {
  const { className, triggerLabel, menuLabel, items } = props;
  const model = useMenu(props);
  useImperativeHandle(ref, () => model.root.current!);

  return <div {...menuAttributes(props)} ref={model.root} className={['fs-menu', className].filter(Boolean).join(' ')}>
    <Button ref={model.trigger} id={model.triggerId} variant="secondary" className="fs-menu__trigger" aria-haspopup="menu" aria-expanded={model.expanded}
      aria-controls={model.expanded ? model.menuId([]) : undefined} onClick={() => model.change(!model.expanded)}
      onKeyDown={event => menuTriggerKey(event, model)}>{triggerLabel}<span className="fs-menu__trigger-chevron" aria-hidden="true" /></Button>
    {model.expanded && <MenuLevel model={model} items={items} path={[]} label={menuLabel} config={props} />}
  </div>;
});
