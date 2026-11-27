import { createRef, type ReactElement } from 'react';
import type { RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Item } from '../../src/components/item/Item';
import {
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '../../src/components/item/ItemParts';

/**
 * Exercise the public row contract in client rendering and independent server hydration.
 **/
export function itemContracts(render: (element: ReactElement) => RenderResult) {
  it('renders passive content without inventing a control', () => {
    // arrange
    const given = <Item>Workspace invitation</Item>;

    // act
    const result = render(given);

    // assert
    expect(result.getByText('Workspace invitation')).not.toHaveAttribute('tabindex');
    expect(result.queryByRole('button')).toBeNull();
    expect(result.queryByRole('link')).toBeNull();
  });
  it('forwards a destination and native anchor attributes', () => {
    // arrange
    const given = (
      <Item as="a" href="/guide" target="_blank" rel="noreferrer" aria-label="Read guide">
        Guide
      </Item>
    );

    // act
    const result = render(given);

    // assert
    expect(result.getByRole('link', { name: 'Read guide' })).toHaveAttribute('href', '/guide');
    expect(result.getByRole('link')).toHaveAttribute('target', '_blank');
  });
  it('forwards the native root ref', () => {
    // arrange
    const ref = createRef<HTMLElement>();

    // act
    const result = render(<Item ref={ref}>Content</Item>);

    // assert
    expect(ref.current).toBe(result.getByText('Content'));
  });
  it('forwards an anchor ref', () => {
    // arrange
    const ref = createRef<HTMLElement>();

    // act
    const result = render(
      <Item as="a" href="/guide" ref={ref}>
        Guide
      </Item>,
    );

    // assert
    expect(ref.current).toBe(result.getByRole('link'));
  });
  it('preserves caller classes and scoped overrides', () => {
    // arrange
    const given = (
      <Item className="custom" style={{ '--fs-item-padding': '32px' }} variant="muted" size="sm">
        Custom
      </Item>
    );

    // act
    const result = render(given);

    // assert
    expect(result.getByText('Custom')).toHaveClass('custom', 'fs-item--muted', 'fs-item--size-sm');
    expect(result.getByText('Custom').style.getPropertyValue('--fs-item-padding')).toBe('32px');
  });
  it('keeps a hidden row out of accessible navigation', () => {
    // arrange
    const given = (
      <Item as="a" href="/guide" hidden>
        Guide
      </Item>
    );

    // act
    const result = render(given);

    // assert
    expect(result.queryByRole('link')).toBeNull();
  });
  it('runs an embedded action exactly once', async () => {
    // arrange
    const onClick = vi.fn();
    const user = userEvent.setup();
    const result = render(
      <Item>
        <ItemContent>
          <ItemTitle>Invitation</ItemTitle>
        </ItemContent>
        <ItemActions>
          <button onClick={onClick}>Accept</button>
        </ItemActions>
      </Item>,
    );

    // act
    await user.click(result.getByRole('button', { name: 'Accept' }));

    // assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('preserves consumer link handlers and cancellation', async () => {
    // arrange
    const onClick = vi.fn((event) => event.preventDefault());
    const user = userEvent.setup();
    const result = render(
      <Item as="a" href="/guide" onClick={onClick}>
        Guide
      </Item>,
    );

    // act
    await user.click(result.getByRole('link'));

    // assert
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[0].defaultPrevented).toBe(true);
  });
  it('composes all content regions in source order', () => {
    // arrange
    const given = (
      <ItemGroup>
        <Item>
          <ItemHeader>Header</ItemHeader>
          <ItemMedia>Media</ItemMedia>
          <ItemContent>
            <ItemTitle>Title</ItemTitle>
            <ItemDescription>Description</ItemDescription>
          </ItemContent>
          <ItemActions>Actions</ItemActions>
          <ItemFooter>Footer</ItemFooter>
        </Item>
        <ItemSeparator />
        <Item>Second</Item>
      </ItemGroup>
    );

    // act
    const result = render(given);

    // assert
    expect(result.container.textContent).toBe('HeaderMediaTitleDescriptionActionsFooterSecond');
    expect(result.container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
  for (const [name, Part] of Object.entries({
    ItemGroup,
    ItemMedia,
    ItemContent,
    ItemTitle,
    ItemActions,
    ItemHeader,
    ItemFooter,
    ItemSeparator,
  })) {
    it(`${name} forwards native attributes, styles and ref`, () => {
      // arrange
      const ref = createRef<HTMLDivElement>();

      // act
      const result = render(
        <Part ref={ref} className="custom" title="Region" style={{ '--fs-item-gap': '8px' }}>
          Content
        </Part>,
      );

      // assert
      expect(ref.current).toBe(result.getByTitle('Region'));
      expect(ref.current).toHaveClass('custom');
      expect(ref.current?.style.getPropertyValue('--fs-item-gap')).toBe('8px');
    });
  }
  it('forwards the native paragraph ref and attributes', () => {
    // arrange
    const ref = createRef<HTMLParagraphElement>();

    // act
    const result = render(
      <ItemDescription ref={ref} className="custom" title="Details">
        Details
      </ItemDescription>,
    );

    // assert
    expect(ref.current).toBe(result.getByTitle('Details'));
    expect(ref.current?.tagName).toBe('P');
  });
  for (const variant of ['icon', 'image', 'avatar'] as const) {
    it(`supports ${variant} media`, () => {
      // arrange
      const given = <ItemMedia variant={variant}>Artwork</ItemMedia>;

      // act
      const result = render(given);

      // assert
      expect(result.getByText('Artwork')).toHaveClass(`fs-item__media--${variant}`);
    });
  }
}
