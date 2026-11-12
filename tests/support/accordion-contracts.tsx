import { createRef, useState, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Accordion, type AccordionProps } from '../../src/components/accordion/Accordion';
import { validateAccordion } from '../../src/components/accordion/useAccordion';

const items = [
  { id: 'join', title: 'Who can join?', content: <input aria-label="Member name" defaultValue="Example" /> },
  { id: 'invite', title: 'How do I invite someone?', content: <a href="#settings">Team settings</a> },
  { id: 'role', title: 'Can I change a role?', content: 'Ask an administrator.', disabled: true },
];

/**
 * Verify disclosure contracts under client rendering and server hydration without internal state access.
 **/
export function accordionContracts(mount: (element: ReactElement) => unknown) {
  describe('Accordion expansion contract', () => {
    it('starts collapsed with native heading buttons', () => {
      // arrange
      // act
      mount(<Accordion items={items} />);
      // assert
      expect(screen.getAllByRole('button').map(button => button.getAttribute('aria-expanded'))).toEqual(['false', 'false', 'false']);
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
    it('opens the requested initial panel', () => {
      // arrange
      // act
      mount(<Accordion items={items} defaultOpenItems={['invite']} />);
      // assert
      expect(screen.getByRole('region', { name: 'How do I invite someone?' })).toContainElement(screen.getByRole('link', { name: 'Team settings' }));
    });
    it('closes the previous panel when another opens', () => {
      // arrange
      mount(<Accordion items={items} defaultOpenItems={['join']} />);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'How do I invite someone?' }));
      // assert
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Team settings' })).toBeVisible();
    });
    it('collapses an active item', () => {
      // arrange
      mount(<Accordion items={items} defaultOpenItems={['invite']} />);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'How do I invite someone?' }));
      // assert
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'How do I invite someone?' })).toHaveAttribute('aria-expanded', 'false');
    });
    it('opens independent panels in multiple mode', () => {
      // arrange
      mount(<Accordion items={items} multiple defaultOpenItems={['join']} />);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'How do I invite someone?' }));
      // assert
      expect(screen.getAllByRole('region')).toHaveLength(2);
    });
    it('closes only the active target in multiple mode', () => {
      // arrange
      mount(<Accordion items={items} multiple defaultOpenItems={['join', 'invite']} />);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'Who can join?' }));
      // assert
      expect(screen.getAllByRole('region').map(region => region.getAttribute('aria-labelledby'))).toEqual([screen.getByRole('button', { name: 'How do I invite someone?' }).id]);
    });
    it('does not toggle disabled items', () => {
      // arrange
      const changed = vi.fn();
      mount(<Accordion items={items} onOpenItemsChange={changed} />);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'Can I change a role?' }));
      // assert
      expect(screen.getByRole('button', { name: 'Can I change a role?' })).toBeDisabled();
      expect(changed).not.toHaveBeenCalled();
    });
    it('requests a controlled change without overriding the parent', () => {
      // arrange
      const changed = vi.fn();
      mount(<Accordion items={items} openItems={['join']} onOpenItemsChange={changed} />);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'How do I invite someone?' }));
      // assert
      expect(changed).toHaveBeenCalledWith(['invite']);
      expect(screen.getByRole('textbox', { name: 'Member name' })).toBeVisible();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
    it('reflects controlled parent updates', () => {
      // arrange
      mount(<ControlledFixture />);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'How do I invite someone?' }));
      // assert
      expect(screen.getByRole('link', { name: 'Team settings' })).toBeVisible();
    });
    it('preserves state inside a closed mounted panel', () => {
      // arrange
      mount(<Accordion items={items} defaultOpenItems={['join']} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Edited' } });
      fireEvent.click(screen.getByRole('button', { name: 'Who can join?' }));
      // act
      fireEvent.click(screen.getByRole('button', { name: 'Who can join?' }));
      // assert
      expect(screen.getByRole('textbox')).toHaveValue('Edited');
    });
    it('keeps generated relationships distinct even with the same caller id', () => {
      // arrange
      mount(<><Accordion id="faq" label="First" items={items} /><Accordion id="faq" label="Second" items={items} /></>);
      const first = within(screen.getByRole('group', { name: 'First' })).getByRole('button', { name: 'Who can join?' });
      const second = within(screen.getByRole('group', { name: 'Second' })).getByRole('button', { name: 'Who can join?' });
      // act
      fireEvent.click(first);
      // assert
      expect(first.id).not.toBe(second.id);
      expect(first).toHaveAttribute('aria-controls', screen.getByRole('region', { name: 'Who can join?' }).id);
      expect(screen.getByRole('region', { name: 'Who can join?' })).toHaveAttribute('aria-labelledby', first.id);
    });
    it.each([1, 2, 3, 4, 5, 6] as const)('uses heading level %s', headingLevel => {
      // arrange
      // act
      mount(<Accordion items={items} headingLevel={headingLevel} />);
      // assert
      expect(screen.getAllByRole('heading', { level: headingLevel })).toHaveLength(3);
    });
    it.each(['divided', 'outlined', 'surface'] as const)('forwards %s appearance and native attributes', variant => {
      // arrange
      const ref = createRef<HTMLDivElement>();
      // act
      mount(<Accordion items={items} variant={variant} ref={ref} label="FAQ" title="Team guidance" className="consumer" style={{ '--fs-space-gap-related': '20px' }} />);
      // assert
      expect(ref.current).toBe(screen.getByRole('group', { name: 'FAQ' }));
      expect(ref.current).toHaveClass(`fs-accordion--${variant}`, 'consumer');
      expect(ref.current).toHaveAttribute('title', 'Team guidance');
      expect(ref.current).toHaveStyle('--fs-space-gap-related: 20px');
    });
    it('preserves native group semantics when no label prop is supplied', () => {
      // arrange
      // act
      mount(<Accordion items={items} role="group" aria-label="Native FAQ" />);
      // assert
      expect(screen.getByRole('group', { name: 'Native FAQ' })).toHaveClass('fs-accordion--divided');
    });
    it('forwards hidden to the complete group', () => {
      // arrange
      const ref = createRef<HTMLDivElement>();
      // act
      mount(<Accordion items={items} hidden ref={ref} />);
      // assert
      expect(ref.current).toHaveAttribute('hidden');
    });
    it('exposes closed animated content as inert and hidden from assistive technology', () => {
      // arrange
      mount(<Accordion items={items} panelMotion="expand" defaultOpenItems={['invite']} />);
      const panel = screen.getByRole('region', { name: 'How do I invite someone?' });
      // act
      fireEvent.click(screen.getByRole('button', { name: 'How do I invite someone?' }));
      // assert
      expect(panel).toHaveAttribute('aria-hidden', 'true');
      expect(panel.inert).toBe(true);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
    it('removes inert when an animated panel opens', () => {
      // arrange
      mount(<Accordion items={items} panelMotion="expand" />);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'How do I invite someone?' }));
      // assert
      expect(screen.getByRole('region', { name: 'How do I invite someone?' }).inert).toBe(false);
    });
    it('keeps expansion and relationships attached to stable IDs after reordering', () => {
      // arrange
      mount(<ReorderFixture />);
      fireEvent.click(screen.getByRole('button', { name: 'How do I invite someone?' }));
      const triggerId = screen.getByRole('button', { name: 'How do I invite someone?' }).id;
      // act
      fireEvent.click(screen.getByRole('button', { name: 'Reorder questions' }));
      // assert
      expect(screen.getByRole('button', { name: 'How do I invite someone?' })).toHaveAttribute('id', triggerId);
      expect(screen.getByRole('link', { name: 'Team settings' })).toBeVisible();
    });
    it('supports an empty collection', () => {
      // arrange
      // act
      mount(<Accordion items={[]} label="Empty FAQ" />);
      // assert
      expect(screen.getByRole('group', { name: 'Empty FAQ' })).toBeEmptyDOMElement();
    });
    it('ignores untyped raw markup and children overrides', () => {
      // arrange
      const unsafe = { children: 'Wrong child', dangerouslySetInnerHTML: { __html: 'Wrong markup' } } as unknown as AccordionProps;
      // act
      mount(<Accordion {...unsafe} items={items} />);
      // assert
      expect(screen.getByRole('button', { name: 'Who can join?' })).toBeInTheDocument();
      expect(screen.queryByText('Wrong child')).not.toBeInTheDocument();
    });
    it.each([
      { items: [{ ...items[0]!, id: '  ' }] }, { items: [items[0]!, items[0]!] },
      { openItems: ['missing'] }, { openItems: ['join', 'join'], multiple: true }, { openItems: ['join', 'invite'] },
    ])('rejects ambiguous identities or expansion $0', props => {
      // arrange
      const given = { items, ...props };
      // act
      const result = () => validateAccordion(given, props.openItems ?? []);
      // assert
      expect(result).toThrow(Error);
    });
  });
}

/**
 * Provide a controlled parent using the public expansion callback.
 **/
function ControlledFixture() {
  const [openItems, setOpenItems] = useState<readonly string[]>([]);
  return <Accordion items={items} openItems={openItems} onOpenItemsChange={setOpenItems} />;
}

/**
 * Verify immediate SSR fallback before any client-side inert setup runs.
 **/
export function animatedServerMarkup(): string {
  return renderToString(<Accordion items={items} panelMotion="expand" />);
}

/**
 * Change order while retaining the same item identities and uncontrolled expansion.
 **/
function ReorderFixture() {
  const [ordered, setOrdered] = useState(items);
  return <><Accordion items={ordered} /><button type="button" onClick={() => setOrdered([...ordered].reverse())}>Reorder questions</button></>;
}
