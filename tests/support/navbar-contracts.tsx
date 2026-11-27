import { createRef, useState, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Navbar } from '../../src/components/navbar/Navbar';
import { navbarWidth } from './navbar-width';

const items = (
  <>
    <Navbar.Brand>
      <a href="#home">Home</a>
    </Navbar.Brand>
    <Navbar.Item>
      <a href="#docs">
        <span>Docs</span>
      </a>
    </Navbar.Item>
    <Navbar.Item mobilePlacement="bar">
      <a href="#support">Support</a>
    </Navbar.Item>
  </>
);

/**
 * Verify public navigation and disclosure contracts with client rendering or server hydration.
 **/
export function navbarContracts(mount: (element: ReactElement) => unknown) {
  beforeEach(() => navbarWidth(1000));
  afterEach(() => vi.unstubAllGlobals());
  it('forwards native naming, attributes, styles and the root ref', () => {
    // arrange
    const ref = createRef<HTMLElement>();

    // act
    mount(
      <Navbar
        ref={ref}
        aria-label="Primary"
        id="primary"
        className="custom"
        style={{ '--fs-navbar-gap': '20px' }}
      >
        {items}
      </Navbar>,
    );

    // assert
    expect(ref.current).toBe(screen.getByRole('navigation', { name: 'Primary' }));
    expect(ref.current).toHaveAttribute('id', 'primary');
    expect(ref.current).toHaveClass('custom');
    expect(ref.current!.style.getPropertyValue('--fs-navbar-gap')).toBe('20px');
  });
  it('preserves aria-labelledby instead of manufacturing a label', () => {
    // arrange
    // act
    mount(
      <>
        <h2 id="name">Resources</h2>
        <Navbar aria-labelledby="name">{items}</Navbar>
      </>,
    );

    // assert
    expect(screen.getByRole('navigation', { name: 'Resources' })).not.toHaveAttribute('aria-label');
  });
  it('wide layout exposes all content without a disclosure trigger', () => {
    // arrange
    // act
    mount(<Navbar>{items}</Navbar>);

    // assert
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Home',
      'Docs',
      'Support',
    ]);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  it('compact closed layout hides menu items but retains the brand and bar links', () => {
    // arrange
    navbarWidth(400);

    // act
    mount(<Navbar>{items}</Navbar>);

    // assert
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Home',
      'Support',
    ]);
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
    expect(
      document.getElementById(screen.getByRole('button').getAttribute('aria-controls')!),
    ).not.toBeVisible();
  });
  it.each(['{Enter}', ' '])('%s opens a native non-submitting disclosure', async (key) => {
    // arrange
    navbarWidth(400);
    const user = userEvent.setup();
    mount(<Navbar>{items}</Navbar>);
    screen.getByRole('button').focus();

    // act
    await user.keyboard(key);

    // assert
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Docs' })).toBeVisible();
  });
  it('uncontrolled interaction updates state and notifies the consumer', () => {
    // arrange
    navbarWidth(400);
    const change = vi.fn();
    mount(<Navbar onOpenChange={change}>{items}</Navbar>);

    // act
    fireEvent.click(screen.getByRole('button'));

    // assert
    expect(change).toHaveBeenCalledExactlyOnceWith(true);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });
  it('a supplied open prop rejects an unaccepted expansion request', () => {
    // arrange
    navbarWidth(400);
    const change = vi.fn();
    mount(
      <Navbar open={false} onOpenChange={change}>
        {items}
      </Navbar>,
    );

    // act
    fireEvent.click(screen.getByRole('button'));

    // assert
    expect(change).toHaveBeenCalledExactlyOnceWith(true);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });
  it('a controlled parent accepts expansion through onOpenChange', () => {
    // arrange
    navbarWidth(400);
    mount(<ControlledNavbar />);

    // act
    fireEvent.click(screen.getByRole('button'));

    // assert
    expect(screen.getByRole('link', { name: 'Docs' })).toBeVisible();
  });
  it('defaultOpen reveals menu content initially', () => {
    // arrange
    navbarWidth(400);

    // act
    mount(<Navbar defaultOpen>{items}</Navbar>);

    // assert
    expect(screen.getByRole('link', { name: 'Docs' })).toBeVisible();
  });
  it('Escape closes the disclosure and restores trigger focus', async () => {
    // arrange
    navbarWidth(400);
    const user = userEvent.setup();
    mount(<Navbar defaultOpen>{items}</Navbar>);
    screen.getByRole('link', { name: 'Docs' }).focus();

    // act
    await user.keyboard('{Escape}');

    // assert
    expect(screen.getByRole('button')).toHaveFocus();
    expect(screen.queryByRole('link', { name: 'Docs' })).not.toBeInTheDocument();
  });
  it('an embedded control can consume Escape without closing its disclosure', () => {
    // arrange
    navbarWidth(400);
    mount(
      <Navbar defaultOpen onKeyDown={(event) => event.preventDefault()}>
        {items}
      </Navbar>,
    );

    // act
    fireEvent.keyDown(screen.getByRole('link', { name: 'Docs' }), { key: 'Escape' });

    // assert
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });
  it('nested link content retains consumer handlers and native destinations while dismissing', () => {
    // arrange
    navbarWidth(400);
    const selected = vi.fn();
    mount(
      <Navbar defaultOpen>
        <Navbar.Item>
          <a href="#docs" onClick={selected}>
            <span>Docs</span>
          </a>
        </Navbar.Item>
      </Navbar>,
    );

    // act
    fireEvent.click(screen.getByText('Docs'));

    // assert
    expect(selected).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { hidden: true })).toHaveAttribute('href', '#docs');
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });
  it('ordinary controls run once and leave the disclosure open', () => {
    // arrange
    navbarWidth(400);
    const action = vi.fn();
    mount(
      <Navbar defaultOpen>
        <Navbar.Item>
          <button onClick={action}>Theme</button>
        </Navbar.Item>
      </Navbar>,
    );

    // act
    fireEvent.click(screen.getByRole('button', { name: 'Theme' }));

    // assert
    expect(action).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true');
  });
  it('all-bar content omits the trigger and disclosure', () => {
    // arrange
    navbarWidth(400);

    // act
    mount(
      <Navbar>
        <Navbar.Item mobilePlacement="bar">
          <a href="#help">Help</a>
        </Navbar.Item>
      </Navbar>,
    );

    // assert
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Help' })).toBeVisible();
  });
  it('empty and conditional children are supported without a brand', () => {
    // arrange
    navbarWidth(400);

    // act
    mount(
      <Navbar>
        {false}
        {null}
        {undefined}
      </Navbar>,
    );

    // assert
    expect(screen.getByRole('navigation')).toBeEmptyDOMElement();
  });
  it('undefined placement defaults to the compact menu', () => {
    // arrange
    navbarWidth(400);

    // act
    mount(
      <Navbar>
        <Navbar.Item mobilePlacement={undefined}>
          <a href="#docs">Docs</a>
        </Navbar.Item>
      </Navbar>,
    );

    // assert
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
  it('custom trigger labels and distinct panel relationships are retained', () => {
    // arrange
    navbarWidth(400);

    // act
    mount(
      <>
        <Navbar menuLabel="Browse">{items}</Navbar>
        <Navbar menuLabel="Explore">{items}</Navbar>
      </>,
    );

    // assert
    expect(screen.getByRole('button', { name: 'Browse' }).getAttribute('aria-controls')).not.toBe(
      screen.getByRole('button', { name: 'Explore' }).getAttribute('aria-controls'),
    );
  });
  it('container changes restore wide links and focus out of a newly hidden disclosure', () => {
    // arrange
    const width = navbarWidth(1000);
    mount(<Navbar>{items}</Navbar>);
    screen.getByRole('link', { name: 'Docs' }).focus();

    // act
    width.resize(400);

    // assert
    expect(screen.getByRole('button')).toHaveFocus();
    expect(screen.queryByRole('link', { name: 'Docs' })).not.toBeInTheDocument();
  });
  it('widening moves focus from the hidden trigger to the first menu control', () => {
    // arrange
    const width = navbarWidth(400);
    mount(<Navbar>{items}</Navbar>);
    screen.getByRole('button').focus();

    // act
    width.resize(1000);

    // assert
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveFocus();
  });
  it('a per-instance width role selects the inclusive boundary', () => {
    // arrange
    navbarWidth(800);

    // act
    mount(<Navbar style={{ '--fs-navbar-collapse-width': '800px' }}>{items}</Navbar>);

    // assert
    expect(screen.getByRole('button')).toBeVisible();
  });
  it('server rendering retains links before container measurement', () => {
    // arrange
    // act
    const result = renderToString(<Navbar>{items}</Navbar>);

    // assert
    expect(result).toContain('href="#docs"');
    expect(result).toContain('href="#support"');
  });
  it.each([
    { name: 'unsupported element', given: <span>Invalid</span> },
    { name: 'text', given: 'Invalid' },
  ])('rejects $name outside the placement API', ({ given }) => {
    // arrange
    // act
    const act = () => mount(<Navbar>{given}</Navbar>);

    // assert
    expect(act).toThrow('Navbar children must be Navbar.Brand or Navbar.Item.');
  });
  it('keeps separate instances independently expandable', () => {
    // arrange
    navbarWidth(400);
    mount(
      <>
        <Navbar aria-label="One">{items}</Navbar>
        <Navbar aria-label="Two">{items}</Navbar>
      </>,
    );

    // act
    fireEvent.click(within(screen.getByRole('navigation', { name: 'One' })).getByRole('button'));

    // assert
    expect(
      within(screen.getByRole('navigation', { name: 'Two' })).getByRole('button'),
    ).toHaveAttribute('aria-expanded', 'false');
  });
  it.each(['Home', 'Support'])(
    'a persistent %s destination also dismisses an open disclosure',
    (label) => {
      // arrange
      navbarWidth(400);
      mount(<Navbar defaultOpen>{items}</Navbar>);

      // act
      fireEvent.click(screen.getByRole('link', { name: label }));

      // assert
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    },
  );
  it.each([
    { width: 1000, key: 'Escape', open: true },
    { width: 400, key: 'Escape', open: false },
    { width: 400, key: 'ArrowDown', open: true },
  ])(
    'ignores $key when width=$width and open=$open do not require dismissal',
    ({ width, key, open }) => {
      // arrange
      navbarWidth(width);
      const change = vi.fn();
      mount(
        <Navbar defaultOpen={open} onOpenChange={change}>
          {items}
        </Navbar>,
      );

      // act
      fireEvent.keyDown(screen.getByRole('navigation'), { key });

      // assert
      expect(change).not.toHaveBeenCalled();
    },
  );
  it('wide destination activation preserves native handlers without changing compact state', () => {
    // arrange
    const change = vi.fn(),
      clicked = vi.fn();
    mount(
      <Navbar defaultOpen onOpenChange={change} onClick={clicked}>
        {items}
      </Navbar>,
    );

    // act
    fireEvent.click(screen.getByRole('link', { name: 'Docs' }));

    // assert
    expect(change).not.toHaveBeenCalled();
    expect(clicked).toHaveBeenCalledTimes(1);
  });
  it('retains a child ref, local value and focus while its keyed group changes position', () => {
    // arrange
    const width = navbarWidth(1000),
      ref = createRef<HTMLInputElement>();
    mount(
      <Navbar defaultOpen>
        <Navbar.Item>
          <input ref={ref} aria-label="Local value" defaultValue="Original" />
        </Navbar.Item>
        <Navbar.Item mobilePlacement="bar">
          <a href="#support">Support</a>
        </Navbar.Item>
      </Navbar>,
    );
    const input = ref.current!;
    fireEvent.change(input, { target: { value: 'Edited' } });
    input.focus();

    // act
    width.resize(400);

    // assert
    expect(ref.current).toBe(input);
    expect(screen.getByRole('textbox')).toHaveValue('Edited');
    expect(input).toHaveFocus();
  });
  it('handles text-only items when widening a focused trigger', () => {
    // arrange
    const width = navbarWidth(400);
    mount(
      <Navbar>
        <Navbar.Item>Unlinked information</Navbar.Item>
      </Navbar>,
    );
    screen.getByRole('button').focus();

    // act
    width.resize(1000);

    // assert
    expect(screen.getByText('Unlinked information')).toBeVisible();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
}

/**
 * Supply a real controlled parent instead of mocking React state ownership.
 **/
function ControlledNavbar(): ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <Navbar open={open} onOpenChange={setOpen}>
      {items}
    </Navbar>
  );
}
