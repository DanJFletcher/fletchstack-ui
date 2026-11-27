import { useState, type ReactElement } from 'react';
import { MemoryRouter, NavLink, useLocation, useNavigate } from 'react-router';
import { BottomNavigation, type BottomNavigationStyle } from '../BottomNavigation';
import { HomeIcon } from '../../icon/named/HomeIcon';
import { InboxIcon } from '../../icon/named/InboxIcon';
import { HelpIcon } from '../../icon/named/HelpIcon';
import { AppShell } from '../../app-shell/AppShell';
import { AppContent } from '../../app-content/AppContent';

const destinations = [
  { id: 'home', href: '#home', label: 'Home', Icon: HomeIcon },
  { id: 'inbox', href: '#inbox', label: 'Inbox', Icon: InboxIcon },
  { id: 'help', href: '#help', label: 'Help', Icon: HelpIcon },
] as const;
type DestinationId = (typeof destinations)[number]['id'];

/**
 * Compose mapped native anchors with application-owned current state.
 **/
export function NativeDestinations({
  current = 'inbox',
  label = 'Primary',
  long = false,
  style = {},
}: {
  current?: DestinationId;
  label?: string;
  long?: boolean;
  style?: BottomNavigationStyle;
}): ReactElement {
  return (
    <BottomNavigation aria-label={label} style={style}>
      {destinations.map(({ id, href, label: text, Icon }) => (
        <BottomNavigation.Item key={id}>
          <a href={href} aria-current={current === id ? 'page' : undefined}>
            <Icon />
            {long && id === 'inbox' ? 'Inbox with important messages to review' : text}
          </a>
        </BottomNavigation.Item>
      ))}
    </BottomNavigation>
  );
}

/**
 * Reuse the same destination data and markup in both active themes.
 **/
export function BottomNavigationExample(): ReactElement {
  return (
    <div className="bottom-nav-demo">
      <h1>BottomNavigation</h1>
      <p>A persistent row of destinations with visible labels.</p>
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="bottom-nav-demo__theme">
          <h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2>
          <h3>Inbox</h3>
          <MemoryRouter initialEntries={['/inbox/42']}>
            <RouterBar label={`${theme} primary`} base="#" />
          </MemoryRouter>
        </section>
      ))}
    </div>
  );
}

/**
 * Move only the consumer's current attribute, without a selection API on navigation.
 **/
export function ChangingDestination(): ReactElement {
  const [current, setCurrent] = useState<DestinationId>('inbox');

  return (
    <>
      <button onClick={() => setCurrent('help')}>Show Help</button>
      <NativeDestinations current={current} />
    </>
  );
}

/**
 * Demonstrate scoped overrides alongside an unchanged and a nested themed bar.
 **/
export function NavigationOverrides(): ReactElement {
  return (
    <>
      <NativeDestinations
        label="Custom"
        style={{
          '--fs-bottom-navigation-indicator': 'rgb(255 200 0)',
          '--fs-bottom-navigation-gap': '12px',
        }}
      />
      <NativeDestinations label="Neighbor" />
      <section data-theme="luna">
        <NativeDestinations label="Nested" />
      </section>
    </>
  );
}

/**
 * Show a scrollable app above persistent header and bottom navigation rows.
 **/
export function ShellExample({
  height = 'parent',
  longLabels = false,
  inset = '0px',
}: {
  height?: 'viewport' | 'parent';
  longLabels?: boolean;
  inset?: string;
}): ReactElement {
  return (
    <div className="bottom-nav-demo__frame">
      <AppShell height={height} data-testid="shell">
        <header className="bottom-nav-demo__header">Workspace</header>
        <AppContent as="div" aria-label="Page content" data-testid="content">
          <div className="bottom-nav-demo__copy">
            <h2>Inbox</h2>
            {Array.from({ length: 20 }, (_, index) => (
              <p key={index}>
                Message {index + 1}: content scrolls independently above the destination bar.
              </p>
            ))}
            <a href="#final" id="final-content">
              Final message
            </a>
          </div>
        </AppContent>
        <NativeDestinations
          long={longLabels}
          style={{ '--fs-bottom-navigation-safe-area-inset': inset }}
        />
      </AppShell>
    </div>
  );
}

/**
 * Let router links and native anchors share one destination presentation.
 **/
function RouterBar({
  base,
  label = 'Router primary',
}: {
  base: string;
  label?: string;
}): ReactElement {
  const location = useLocation();

  return (
    <BottomNavigation aria-label={label}>
      <BottomNavigation.Item>
        <NavLink to="/" end>
          <HomeIcon />
          Home
        </NavLink>
      </BottomNavigation.Item>
      <BottomNavigation.Item>
        <NavLink to="/inbox">
          <InboxIcon />
          Inbox
        </NavLink>
      </BottomNavigation.Item>
      <BottomNavigation.Item>
        <a href={`${base}/help`} aria-current={location.pathname === '/help' ? 'page' : undefined}>
          <HelpIcon />
          Help
        </a>
      </BottomNavigation.Item>
    </BottomNavigation>
  );
}

/**
 * Compose actual router links and a native Help anchor inside a consumer-owned router.
 **/
export function RouterDestinations({ base = '' }: { base?: string }): ReactElement {
  const location = useLocation(),
    navigate = useNavigate();

  return (
    <>
      <h2>{location.pathname === '/help' ? 'Help page' : 'Inbox workspace'}</h2>
      <button
        onClick={() => {
          void navigate('/inbox/42');
        }}
      >
        Open message 42
      </button>
      <RouterBar base={base} />
    </>
  );
}

/**
 * Isolate Storybook navigation from the host URL while keeping real NavLink semantics.
 **/
export function RouterExample(): ReactElement {
  return (
    <MemoryRouter initialEntries={['/inbox/42']}>
      <RouterDestinations base="#" />
    </MemoryRouter>
  );
}
