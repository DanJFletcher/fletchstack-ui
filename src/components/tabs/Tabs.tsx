import { forwardRef, useId, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { validateTabs } from './tabs-policy.js';
import { useTabsSelection } from './useTabsSelection.js';
import { useTabsFocus, type TabsFocus } from './useTabsFocus.js';
import type { TabsItem, TabsProps } from './types.js';

/**
 * Connect a native button to its persistently mounted panel without replacing content.
 **/
function Tab({ item, prefix, selected, focus, select }: { item: TabsItem; prefix: string; selected: string | undefined; focus: TabsFocus; select: (id: string) => void }) {
  const id = `${prefix}-${encodeURIComponent(item.id)}`;

  return <button type="button" role="tab" id={`${id}-tab`} data-tabs-id={item.id} aria-controls={`${id}-panel`} aria-selected={selected === item.id} disabled={item.disabled}
    tabIndex={!item.disabled && focus.entry === item.id ? 0 : -1} className="fs-tabs__tab" onFocus={() => focus.focus(item.id)} onClick={() => select(item.id)}>{item.label}</button>;
}

/**
 * Render stable, immediately hidden panels so switching selection preserves local state.
 **/
function Panels({ items, prefix, selected }: { items: readonly TabsItem[]; prefix: string; selected: string | undefined }) {
  return <div className="fs-tabs__panels">{items.map(item => {
    const id = `${prefix}-${encodeURIComponent(item.id)}`;
    return <div key={item.id} role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab`} hidden={selected !== item.id} tabIndex={selected === item.id ? 0 : -1} className="fs-tabs__panel">{item.content}</div>;
  })}</div>;
}

/**
 * Switch related panels through automatic or manual native-button tab navigation.
 **/
export const Tabs: ForwardRefExoticComponent<TabsProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, ref) {
  validateTabs(props.items, props.label);
  const prefix = `tabs-${useId()}`, enabled = props.items.filter(item => !item.disabled).map(item => item.id);
  const selection = useTabsSelection(props, enabled), focus = useTabsFocus(props, selection, enabled);
  const { items, label, className, variant = 'line', orientation = 'horizontal', fullWidth = false, ...native } = props;
  for (const name of ['value', 'defaultValue', 'onValueChange', 'activationMode']) { Reflect.deleteProperty(native, name); }

  return <div {...native} ref={ref} className={['fs-tabs', `fs-tabs--${variant}`, `fs-tabs--${orientation}`, fullWidth && 'fs-tabs--full-width', className].filter(Boolean).join(' ')}>
    <div ref={focus.list} role="tablist" aria-label={label} aria-orientation={orientation} tabIndex={-1} className="fs-tabs__list" onKeyDown={focus.key} onBlur={focus.blur} onFocusCapture={() => { focus.inside.current = true; }}
      onPointerDownCapture={() => { focus.pointer.current = true; }} onPointerUp={() => { focus.pointer.current = false; }} onPointerCancel={() => { focus.pointer.current = false; }}>
      {items.map(item => <Tab key={item.id} item={item} prefix={prefix} selected={selection.selected} focus={focus} select={selection.select} />)}
    </div><Panels items={items} prefix={prefix} selected={selection.selected} />
  </div>;
});
