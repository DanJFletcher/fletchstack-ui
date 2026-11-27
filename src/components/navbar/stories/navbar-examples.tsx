import { useRef, useState, type ReactElement } from 'react';
import { Navbar } from '../Navbar';
import type { NavbarMobilePlacement, NavbarProps } from '../types';
import { Switch } from '../../switch/Switch';
import { Heading } from '../../typography/Heading';

/**
 * Supply the example's brand artwork without coupling the Navbar API to an application logo.
 **/
export function NavbarLogo(): ReactElement {
  return (
    <span className="navbar-demo__logo">
      <svg viewBox="0 0 32 40" aria-hidden="true">
        <path
          d="m1 10 21-10 10 5-21 10zM1 14l10 5 20-10v8L11 27 1 22zM1 26l10 5 12-6v9l-12 6L1 35z"
          fill="currentColor"
        />
      </svg>
      <strong>
        Fletch<span>Stack</span>
      </strong>
    </span>
  );
}

/**
 * Keep a local theme control's state observable across every responsive layout change.
 **/
export function NavbarThemeToggle(): ReactElement {
  const [dark, setDark] = useState(false);

  return (
    <Switch
      label="Dark mode"
      checked={dark}
      onChange={(event) => setDark(event.currentTarget.checked)}
      wrapperClassName="navbar-demo__switch"
    />
  );
}

/**
 * Declare the design sheet's links, local control and persistent CTA exactly once.
 **/
export function ProjectNavbar(props: Omit<NavbarProps, 'children'>): ReactElement {
  return (
    <Navbar aria-label="Primary" {...props}>
      <Navbar.Brand>
        <a className="navbar-demo__brand" href="#home" aria-label="FletchStack home">
          <NavbarLogo />
        </a>
      </Navbar.Brand>
      <Navbar.Item>
        <a className="navbar-demo__link" href="#services">
          <span>What we do</span>
        </a>
      </Navbar.Item>
      <Navbar.Item>
        <a className="navbar-demo__link" href="#approach">
          How we work
        </a>
      </Navbar.Item>
      <Navbar.Item>
        <NavbarThemeToggle />
      </Navbar.Item>
      <Navbar.Item mobilePlacement="bar">
        <a className="fs-button fs-button--primary fs-button--small contact-cta" href="#contact">
          Let’s talk
        </a>
      </Navbar.Item>
    </Navbar>
  );
}

/**
 * Compare persistent navigation in both themes and independently compact example containers.
 **/
export function NavbarExample(): ReactElement {
  return (
    <main className="navbar-demo">
      <p>FLETCHSTACK UI / COMPONENT DESIGN</p>
      <Heading as="h1" size="page">
        Navbar
      </Heading>
      <p>Keep the main action in reach as the navigation collapses.</p>
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="navbar-demo__theme">
          <Heading as="h2" size="section">
            {theme === 'corporate' ? 'Corporate' : 'Luna'}
          </Heading>
          <ProjectNavbar aria-label={`${theme} primary`} />
        </section>
      ))}
      <div className="navbar-demo__compact">
        <section>
          <Heading as="h2" size="section">
            Compact / closed
          </Heading>
          <ProjectNavbar aria-label="Compact closed" />
        </section>
        <section>
          <Heading as="h2" size="section">
            Compact / open
          </Heading>
          <ProjectNavbar aria-label="Compact open" defaultOpen />
        </section>
      </div>
    </main>
  );
}

type Destination = { href: string; label: string; mobilePlacement?: NavbarMobilePlacement };
const destinations: Destination[] = [
  { href: '#docs', label: 'Docs' },
  { href: '#examples', label: 'Examples' },
  { href: '#support', label: 'Support', mobilePlacement: 'bar' },
];

/**
 * Mix typed application data, a conditional item, fragments and handwritten composition.
 **/
export function NavbarResources(): ReactElement {
  const [signedIn, setSignedIn] = useState(true);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={signedIn}
          onChange={(event) => setSignedIn(event.currentTarget.checked)}
        />
        Signed in
      </label>
      <Navbar aria-label="Resources">
        {destinations.map(({ href, label, mobilePlacement }) => (
          <Navbar.Item key={href} mobilePlacement={mobilePlacement}>
            <a className="navbar-demo__link" href={href}>
              {label}
            </a>
          </Navbar.Item>
        ))}
        {signedIn && (
          <Navbar.Item>
            <button type="button">Account settings</button>
          </Navbar.Item>
        )}
        <>
          <Navbar.Item>
            <button type="button">Handwritten action</button>
          </Navbar.Item>
        </>
      </Navbar>
    </>
  );
}

/**
 * Let the consumer dismiss a controlled disclosure after completing a custom action.
 **/
export function NavbarControlled(): ReactElement {
  const [open, setOpen] = useState(false),
    [workspace, setWorkspace] = useState('Main');

  return (
    <>
      <button type="button" onClick={() => setOpen(!open)}>
        Toggle from parent
      </button>
      <p role="status">Workspace: {workspace}</p>
      <Navbar aria-label="Workspace" open={open} onOpenChange={setOpen}>
        <Navbar.Item>
          <NavbarThemeToggle />
        </Navbar.Item>
        <Navbar.Item>
          <button
            type="button"
            onClick={() => {
              setWorkspace('Studio');
              setOpen(false);
            }}
          >
            Switch to Studio
          </button>
        </Navbar.Item>
      </Navbar>
    </>
  );
}

/**
 * Retain externally controlled truth until a separate parent action accepts the requested state.
 **/
export function NavbarDeferred(): ReactElement {
  const [open, setOpen] = useState(false),
    [requested, setRequested] = useState(false);

  return (
    <>
      <p role="status">Requested: {String(requested)}</p>
      <button type="button" onClick={() => setOpen(requested)}>
        Accept request
      </button>
      <ProjectNavbar open={open} onOpenChange={setRequested} />
    </>
  );
}

/**
 * Keep ordinary links visible at every width without rendering a meaningless disclosure.
 **/
export function NavbarAllVisible(): ReactElement {
  return (
    <Navbar aria-label="Account">
      <Navbar.Item mobilePlacement="bar">
        <a className="navbar-demo__link" href="#help">
          Help
        </a>
      </Navbar.Item>
      <Navbar.Item mobilePlacement="bar">
        <a className="navbar-demo__link" href="#sign-in">
          Sign in
        </a>
      </Navbar.Item>
    </Navbar>
  );
}

/**
 * Resize only the navigation container and retain a locally edited input, selection and ref.
 **/
export function NavbarIdentity(): ReactElement {
  const [width, setWidth] = useState(1000);

  return (
    <>
      <button type="button" onClick={() => setWidth(380)}>
        Shrink container
      </button>
      <button type="button" onClick={() => setWidth(1000)}>
        Widen container
      </button>
      <div style={{ width, maxWidth: '100%' }}>
        <Navbar aria-label="Identity">
          <Navbar.Brand>
            <a href="#home">FletchStack</a>
          </Navbar.Brand>
          <Navbar.Item>
            <StatefulNavbarInput />
          </Navbar.Item>
          <Navbar.Item>
            <NavbarThemeToggle />
          </Navbar.Item>
          <Navbar.Item mobilePlacement="bar">
            <a className="fs-button fs-button--primary fs-button--small" href="#contact">
              Let’s talk
            </a>
          </Navbar.Item>
        </Navbar>
      </div>
    </>
  );
}

/**
 * Expose local text state and an unchanged child ref without a parent storing the input value.
 **/
function StatefulNavbarInput(): ReactElement {
  const [value, setValue] = useState('Original');
  const input = useRef<HTMLInputElement>(null);

  return (
    <label>
      Workspace name
      <input ref={input} value={value} onChange={(event) => setValue(event.currentTarget.value)} />
    </label>
  );
}
