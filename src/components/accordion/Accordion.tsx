import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { ChevronDownIcon } from '../icon/named/ChevronDownIcon.js';
import { useAccordion, type AccordionModel } from './useAccordion.js';
import type { AccordionItem, AccordionProps } from './types.js';
export type { AccordionItem, AccordionProps, AccordionStyle } from './types.js';

/**
 * Set inert during the DOM commit, before a closing panel can receive another keyboard action.
 **/
function panelInert(node: HTMLDivElement | null, open: boolean): void {
  if (node) {
    node.inert = !open;
  }
}

/**
 * Connect one heading's native button to a persistently mounted, independently labelled panel.
 **/
function Item({
  item,
  model,
  props,
}: {
  item: AccordionItem;
  model: AccordionModel;
  props: AccordionProps;
}) {
  const Heading = `h${props.headingLevel ?? 3}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const open = model.open.includes(item.id);
  const id = `${model.id}-${encodeURIComponent(item.id)}`;
  const immediate = props.panelMotion !== 'expand' || !model.motionReady;

  return (
    <div className="fs-accordion__item">
      <Heading className="fs-accordion__heading">
        <button
          type="button"
          id={`${id}-trigger`}
          aria-controls={`${id}-panel`}
          aria-expanded={open}
          disabled={item.disabled}
          className="fs-accordion__trigger"
          onClick={() => model.toggle(item.id)}
        >
          <span className="fs-accordion__title">{item.title}</span>
          <span className="fs-accordion__chevron" aria-hidden="true">
            <ChevronDownIcon />
          </span>
        </button>
      </Heading>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        aria-hidden={!open}
        hidden={!open && immediate}
        ref={(node) => panelInert(node, open)}
        className="fs-accordion__panel"
      >
        <div className="fs-accordion__clip">
          <div className="fs-accordion__content">{item.content}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Group full-width disclosure buttons with controlled or uncontrolled single/multiple expansion.
 **/
export const Accordion: ForwardRefExoticComponent<AccordionProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, AccordionProps>(
    function Accordion(accordionProps, ref) {
      const model = useAccordion(accordionProps);
      const {
        items,
        label,
        variant = 'divided',
        panelMotion = 'none',
        className,
        ...native
      } = accordionProps;
      for (const name of [
        'headingLevel',
        'multiple',
        'openItems',
        'defaultOpenItems',
        'onOpenItemsChange',
        'children',
        'dangerouslySetInnerHTML',
      ]) {
        Reflect.deleteProperty(native, name);
      }

      return (
        <div
          {...native}
          ref={ref}
          role={label ? 'group' : native.role}
          aria-label={label ?? native['aria-label']}
          className={[
            'fs-accordion',
            `fs-accordion--${variant}`,
            `fs-accordion--motion-${panelMotion}`,
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {items.map((item) => (
            <Item key={item.id} item={item} model={model} props={accordionProps} />
          ))}
        </div>
      );
    },
  );
