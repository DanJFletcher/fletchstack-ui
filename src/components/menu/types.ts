import type { ComponentPropsWithoutRef, CSSProperties, MouseEvent, ReactNode } from 'react';

export type MenuStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type MenuSelectEvent = MouseEvent<HTMLButtonElement | HTMLAnchorElement>;
interface MenuEntry { id: string; label: string; icon?: ReactNode; disabled?: boolean }
export interface MenuActionItem extends MenuEntry { type: 'item'; onSelect: (event: MenuSelectEvent) => void; href?: never }
export interface MenuLinkItem extends MenuEntry { type: 'item'; href: string; target?: string; rel?: string; onSelect?: (event: MenuSelectEvent) => void }
export interface MenuSubmenuItem extends MenuEntry { type: 'submenu'; items: readonly MenuItem[] }
export interface MenuDividerItem { type: 'divider'; id: string }
export type MenuItem = MenuActionItem | MenuLinkItem | MenuSubmenuItem | MenuDividerItem;
export type MenuProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'style' | 'dangerouslySetInnerHTML'> & {
  triggerLabel: string;
  /** Optional visual trigger content; triggerLabel remains its accessible name. */
  trigger?: ReactNode;
  menuLabel: string;
  items: readonly MenuItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnSelect?: boolean;
  emptyMessage?: ReactNode;
  style?: MenuStyle;
};
