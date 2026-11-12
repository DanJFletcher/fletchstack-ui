import { createRef, type ReactElement } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Chip, type ChipProps } from '../../src/components/chip/Chip';

/**
 * Exercise the same public contract with fresh client rendering and with hydrated server markup.
 **/
export function chipContracts(mount: (element: ReactElement) => unknown) {
  describe('Chip content and actions', () => {
    it('renders a passive span by default', () => {
      // arrange
      const ref = createRef<HTMLSpanElement>();
      // act
      mount(<Chip ref={ref}>Design systems</Chip>);
      // assert
      expect(ref.current?.tagName).toBe('SPAN');
      expect(ref.current).toHaveTextContent('Design systems');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(ref.current).not.toHaveAttribute('tabindex');
    });
    it('preserves a numeric zero label', () => {
      // arrange
      // act
      mount(<Chip>{0}</Chip>);
      // assert
      expect(screen.getByText('0')).toBeVisible();
    });
    it('accepts noninteractive rich label content', () => {
      // arrange
      // act
      mount(<Chip><strong>Design</strong> systems</Chip>);
      // assert
      expect(screen.getByText('Design').tagName).toBe('STRONG');
    });
    it.each(['small', 'medium', 'large'] as const)('forwards %s sizing and native customization', size => {
      // arrange
      const ref = createRef<HTMLSpanElement>();
      // act
      mount(<Chip size={size} ref={ref} id="topic" title="Content topic" className="consumer" style={{ '--fs-chip-radius': '4px' }} aria-describedby="help" lang="fr">Design</Chip>);
      // assert
      expect(ref.current).toHaveClass('fs-chip', `fs-chip--${size}`, 'consumer');
      expect(ref.current).toHaveAttribute('title', 'Content topic');
      expect(ref.current).toHaveAttribute('aria-describedby', 'help');
      expect(ref.current).toHaveStyle('--fs-chip-radius: 4px');
      expect(ref.current).toHaveAttribute('lang', 'fr');
    });
    it('uses medium sizing when omitted', () => {
      // arrange
      const ref = createRef<HTMLSpanElement>();
      // act
      mount(<Chip ref={ref}>Design</Chip>);
      // assert
      expect(ref.current).toHaveClass('fs-chip--medium');
    });
    it.each([{ selected: false, expected: true }, { selected: true, expected: false }])('requests $expected from selected=$selected', ({ selected, expected }) => {
      // arrange
      const onSelect = vi.fn();
      mount(<Chip selected={selected} onSelect={onSelect}>Design</Chip>);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'Design' }));
      // assert
      expect(onSelect).toHaveBeenCalledWith(expected);
      expect(screen.getByRole('button', { name: 'Design' })).toHaveAttribute('aria-pressed', String(selected));
    });
    it('keeps the selection mark decorative', () => {
      // arrange
      // act
      mount(<Chip selected onSelect={() => {}}>Design</Chip>);
      // assert
      expect(screen.getByRole('button', { name: 'Design' })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
    it('requests removal without selecting', () => {
      // arrange
      const onSelect = vi.fn();
      const onRemove = vi.fn();
      mount(<Chip selected={false} onSelect={onSelect} onRemove={onRemove} removeLabel="Supprimer Design">Design</Chip>);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'Supprimer Design' }));
      // assert
      expect(onRemove).toHaveBeenCalledWith();
      expect(onSelect).not.toHaveBeenCalled();
    });
    it('selects without requesting removal', () => {
      // arrange
      const onRemove = vi.fn();
      mount(<Chip selected={false} onSelect={() => {}} onRemove={onRemove} removeLabel="Remove Design">Design</Chip>);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'Design' }));
      // assert
      expect(onRemove).not.toHaveBeenCalled();
    });
    it('renders action buttons as siblings with safe form defaults', () => {
      // arrange
      // act
      mount(<Chip selected={false} onSelect={() => {}} onRemove={() => {}} removeLabel="Remove Design">Design</Chip>);
      // assert
      expect(screen.getByRole('button', { name: 'Design' }).parentElement).toBe(screen.getByRole('button', { name: 'Remove Design' }).parentElement);
      expect(screen.getByRole('button', { name: 'Remove Design' })).toHaveAttribute('type', 'button');
      expect(screen.getByRole('button', { name: 'Design' })).toHaveAttribute('type', 'button');
    });
    it('lets the parent own whether a removable chip stays mounted', () => {
      // arrange
      mount(<Chip onRemove={() => {}} removeLabel="Remove Design">Design</Chip>);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'Remove Design' }));
      // assert
      expect(screen.getByText('Design')).toBeVisible();
    });
    it('disables both actions', () => {
      // arrange
      const onSelect = vi.fn();
      const onRemove = vi.fn();
      mount(<Chip disabled selected onSelect={onSelect} onRemove={onRemove} removeLabel="Remove Design">Design</Chip>);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'Design' }));
      fireEvent.click(screen.getByRole('button', { name: 'Remove Design' }));
      // assert
      expect(screen.getByRole('button', { name: 'Design' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Remove Design' })).toBeDisabled();
      expect(onSelect).not.toHaveBeenCalled();
      expect(onRemove).not.toHaveBeenCalled();
    });
    it('retains native wrapper events', () => {
      // arrange
      const clicked = vi.fn();
      mount(<Chip onClick={clicked}>Design</Chip>);
      // act
      fireEvent.click(screen.getByText('Design'));
      // assert
      expect(clicked).toHaveBeenCalledOnce();
    });
    it('forwards hidden to the root', () => {
      // arrange
      const ref = createRef<HTMLSpanElement>();
      // act
      mount(<Chip hidden ref={ref}>Design</Chip>);
      // assert
      expect(ref.current).toHaveAttribute('hidden');
    });
    it('preserves its label against untyped raw markup', () => {
      // arrange
      const unsafe = { dangerouslySetInnerHTML: { __html: 'Wrong content' } } as unknown as ChipProps;
      // act
      mount(<Chip {...unsafe}>Design</Chip>);
      // assert
      expect(screen.getByText('Design')).toBeVisible();
      expect(screen.queryByText('Wrong content')).not.toBeInTheDocument();
    });
    it.each([
      { selected: true }, { selected: false }, { onSelect: () => {} },
      { onRemove: () => {} }, { removeLabel: 'Remove tag' }, { onRemove: () => {}, removeLabel: '  ' },
    ])('rejects incomplete action configuration $0', props => {
      // arrange
      const unsafe = props as unknown as ChipProps;
      // act
      const result = () => renderToString(<Chip {...unsafe}>Design</Chip>);
      // assert
      expect(result).toThrow(Error);
    });
  });
}
