import { createRef, forwardRef, type ReactElement } from 'react';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { BottomNavigation } from '../../src/components/bottom-navigation/BottomNavigation';
import { HomeIcon } from '../../src/components/icon/named/HomeIcon';
import { InboxIcon } from '../../src/components/icon/named/InboxIcon';
import { HelpIcon } from '../../src/components/icon/named/HelpIcon';

/**
 * Exercise the native navigation contract with either fresh DOM or hydrated server markup.
 **/
export function bottomNavigationContracts(render: (element: ReactElement) => unknown) {
  it('forwards the named nav ref and native customization', () => {
    // arrange
    const ref = createRef<HTMLElement>();
    const given = (
      <BottomNavigation
        ref={ref}
        aria-label="Primary"
        id="primary"
        className="custom"
        style={{ '--fs-bottom-navigation-gap': '12px' }}
      >
        <BottomNavigation.Item>
          <a href="/help">Help</a>
        </BottomNavigation.Item>
      </BottomNavigation>
    );

    // act
    render(given);

    // assert
    const result = screen.getByRole('navigation', { name: 'Primary' });
    expect(ref.current).toBe(result);
    expect(result).toHaveAttribute('id', 'primary');
    expect(result).toHaveClass('custom');
    expect(result.style.getPropertyValue('--fs-bottom-navigation-gap')).toBe('12px');
  });

  it('retains supplied destinations in semantic source order', () => {
    // arrange
    const given = (
      <>
        <h2 id="destinations">Destinations</h2>
        <BottomNavigation aria-labelledby="destinations">
          <BottomNavigation.Item>
            <a href="/">
              <HomeIcon />
              Home
            </a>
          </BottomNavigation.Item>
          <BottomNavigation.Item>
            <a href="/inbox" aria-current="page">
              <InboxIcon />
              Inbox
            </a>
          </BottomNavigation.Item>
          <BottomNavigation.Item>
            <a href="/help">
              <HelpIcon />
              Help
            </a>
          </BottomNavigation.Item>
        </BottomNavigation>
      </>
    );

    // act
    render(given);

    // assert
    const result = within(screen.getByRole('navigation', { name: 'Destinations' }));
    expect(result.getAllByRole('listitem')).toHaveLength(3);
    expect(
      result.getAllByRole('link').map((link) => [link.textContent, link.getAttribute('href')]),
    ).toEqual([
      ['Home', '/'],
      ['Inbox', '/inbox'],
      ['Help', '/help'],
    ]);
    expect(result.getByRole('link', { name: 'Inbox' })).toHaveAttribute('aria-current', 'page');
    expect(result.queryByRole('img')).not.toBeInTheDocument();
  });

  it('preserves custom link refs and nested click handlers', async () => {
    // arrange
    const user = userEvent.setup(),
      rootClick = vi.fn(),
      nestedClick = vi.fn(),
      ref = createRef<HTMLAnchorElement>();
    const CustomLink = forwardRef<HTMLAnchorElement>(function CustomLink(_, linkRef) {
      return (
        <a ref={linkRef} href="#help" onClick={(event) => event.preventDefault()}>
          <span onClick={nestedClick}>Help</span>
        </a>
      );
    });
    render(
      <BottomNavigation aria-label="Primary" onClick={rootClick}>
        <BottomNavigation.Item>
          <CustomLink ref={ref} />
        </BottomNavigation.Item>
      </BottomNavigation>,
    );

    // act
    await user.click(screen.getByText('Help'));

    // assert
    expect(nestedClick).toHaveBeenCalledOnce();
    expect(rootClick).toHaveBeenCalledOnce();
    expect(ref.current).toBe(screen.getByRole('link', { name: 'Help' }));
  });
}
