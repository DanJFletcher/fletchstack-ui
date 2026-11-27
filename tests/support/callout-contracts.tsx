import { createRef, type ReactElement } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Callout, type CalloutTone } from '../../src/components/callout/Callout';

/**
 * Exercise the public content and semantics contract under rendering and hydration.
 **/
export function calloutContracts(mount: (element: ReactElement) => unknown) {
  it.each(['info', 'success', 'warning', 'error', 'neutral'] as CalloutTone[])(
    '%s adds no announcement semantics',
    (tone) => {
      // arrange
      const ref = createRef<HTMLDivElement>();

      // act
      mount(
        <Callout ref={ref} tone={tone}>
          Persistent guidance
        </Callout>,
      );

      // assert
      expect(ref.current).not.toHaveAttribute('role');
      expect(ref.current).not.toHaveAttribute('aria-live');
    },
  );
  it.each(['note', 'status', 'alert'] as const)('honors the explicit %s role', (role) => {
    // arrange
    // act
    mount(
      <Callout role={role} tone="neutral">
        Workspace updated
      </Callout>,
    );

    // assert
    expect(screen.getByRole(role)).toHaveTextContent('Workspace updated');
  });
  it('composes renderable title and body content', () => {
    // arrange
    // act
    mount(
      <Callout title={<strong>Review publishing</strong>}>
        <p>
          Read the <a href="#review">publishing guide</a>.
        </p>
      </Callout>,
    );

    // assert
    expect(screen.getByText('Review publishing')).toBeVisible();
    expect(screen.getByRole('link', { name: 'publishing guide' })).toHaveAttribute(
      'href',
      '#review',
    );
  });
  it('hides supplied decorative artwork from the accessibility tree', () => {
    // arrange
    // act
    mount(
      <Callout icon={<svg role="img" aria-label="Warning icon" />} title="Review publishing">
        Two pages need approval.
      </Callout>,
    );

    // assert
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Two pages need approval.')).toBeVisible();
  });
  it('runs the consumer action without dismissing the message', () => {
    // arrange
    const reviewed = vi.fn();
    mount(
      <Callout
        action={
          <button type="button" onClick={reviewed}>
            Review pages
          </button>
        }
      >
        Two pages need approval.
      </Callout>,
    );

    // act
    fireEvent.click(screen.getByRole('button', { name: 'Review pages' }));

    // assert
    expect(reviewed).toHaveBeenCalledOnce();
    expect(screen.getByText('Two pages need approval.')).toBeVisible();
  });
  it('forwards the native ref and consumer attributes', () => {
    // arrange
    const ref = createRef<HTMLDivElement>();

    // act
    mount(
      <Callout
        ref={ref}
        id="draft-warning"
        className="publishing-message"
        aria-label="Publishing guidance"
      >
        Draft content
      </Callout>,
    );

    // assert
    expect(ref.current).toHaveAttribute('id', 'draft-warning');
    expect(ref.current).toHaveClass('publishing-message');
    expect(ref.current).toHaveAccessibleName('Publishing guidance');
  });
  it('keeps style hooks scoped to the selected instance', () => {
    // arrange
    const custom = createRef<HTMLDivElement>();
    const neighbor = createRef<HTMLDivElement>();

    // act
    mount(
      <>
        <Callout ref={custom} style={{ '--fs-callout-radius': '0px' }}>
          Custom
        </Callout>
        <Callout ref={neighbor}>Neighbor</Callout>
      </>,
    );

    // assert
    expect(custom.current!.style.getPropertyValue('--fs-callout-radius')).toBe('0px');
    expect(neighbor.current!.style.getPropertyValue('--fs-callout-radius')).toBe('');
  });
  it('renders numeric zero in optional content slots', () => {
    // arrange
    // act
    mount(
      <Callout title={0} action={0} icon={0}>
        Body
      </Callout>,
    );

    // assert
    expect(screen.getAllByText('0')).toHaveLength(3);
  });
  it.each([undefined, null, false, true, ''])('omits empty optional slots for %s', (empty) => {
    // arrange
    const ref = createRef<HTMLDivElement>();

    // act
    mount(
      <Callout ref={ref} title={empty} icon={empty} action={empty}>
        Body only
      </Callout>,
    );

    // assert
    expect(ref.current!.textContent).toBe('Body only');
    expect(
      ref.current!.querySelectorAll('.fs-callout__icon, .fs-callout__title, .fs-callout__action'),
    ).toHaveLength(0);
  });
  it('allows an empty message body without leaving a body slot', () => {
    // arrange
    const ref = createRef<HTMLDivElement>();

    // act
    mount(
      <Callout ref={ref} title="Workspace updated">
        {null}
      </Callout>,
    );

    // assert
    expect(ref.current!.querySelector('.fs-callout__body')).toBeNull();
  });
}
