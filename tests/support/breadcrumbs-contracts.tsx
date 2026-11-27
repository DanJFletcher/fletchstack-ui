import { createRef, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Breadcrumbs } from '../../src/components/breadcrumbs/Breadcrumbs';
import type { BreadcrumbItem } from '../../src/components/breadcrumbs/types';
import { breadcrumbViewport } from './breadcrumbs-viewport';

const items: BreadcrumbItem[] = [
  { label: 'Home', href: '/home' },
  { label: 'Projects', href: '/projects' },
  { label: 'Atlas', href: '/projects/atlas' },
  { label: 'Settings', current: true },
];

/**
 * Verify semantic navigation, native disclosure and viewport changes under rendering or hydration.
 **/
export function breadcrumbsContracts(mount: (element: ReactElement) => unknown) {
  beforeEach(() => breadcrumbViewport(false));
  afterEach(() => vi.unstubAllGlobals());
  it('renders an ordered native trail in a named navigation landmark', () => {
    // arrange
    // act
    mount(<Breadcrumbs items={items} />);

    // assert
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' }).tagName).toBe('NAV');
    expect(screen.getByRole('list').tagName).toBe('OL');
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Home',
      '/Projects',
      '/Atlas',
      '/Settings',
    ]);
  });
  it('uses the caller’s accessible navigation name', () => {
    // arrange
    // act
    mount(<Breadcrumbs items={items} aria-label="Project hierarchy" />);

    // assert
    expect(screen.getByRole('navigation', { name: 'Project hierarchy' })).toBeVisible();
  });
  it('preserves caller destinations without inspecting the current URL', () => {
    // arrange
    // act
    mount(<Breadcrumbs items={items} />);

    // assert
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      '/home',
      '/projects',
      '/projects/atlas',
    ]);
  });
  it('marks the current page as text instead of a link', () => {
    // arrange
    // act
    mount(<Breadcrumbs items={items} />);

    // assert
    expect(screen.getByText('Settings')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument();
  });
  it('keeps slash separators decorative', () => {
    // arrange
    // act
    mount(<Breadcrumbs items={items} />);

    // assert
    expect(
      screen.getAllByText('/').map((separator) => separator.getAttribute('aria-hidden')),
    ).toEqual(['true', 'true', 'true']);
  });
  it('collapses only intermediate links at the narrow breakpoint', () => {
    // arrange
    breadcrumbViewport(true);

    // act
    mount(<Breadcrumbs items={items} />);

    // assert
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(['Home']);
    expect(screen.getByRole('button', { name: 'Show 2 hidden breadcrumb levels' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByText('Settings')).toBeVisible();
  });
  it('uses the singular disclosure label for one intermediate level', () => {
    // arrange
    breadcrumbViewport(true);

    // act
    mount(<Breadcrumbs items={[items[0]!, items[1]!, items[3]!]} />);

    // assert
    expect(screen.getByRole('button', { name: 'Show 1 hidden breadcrumb level' })).toBeVisible();
  });
  it.each(['{Enter}', ' '])(
    '%s expands the intermediate links without moving focus',
    async (key) => {
      // arrange
      const user = userEvent.setup();
      breadcrumbViewport(true);
      mount(<Breadcrumbs items={items} />);
      screen.getByRole('button').focus();

      // act
      await user.keyboard(key);

      // assert
      expect(screen.getByRole('button', { name: 'Hide intermediate levels' })).toHaveFocus();
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
        'Home',
        'Projects',
        'Atlas',
      ]);
    },
  );
  it('expanded links follow the disclosure in Tab order', async () => {
    // arrange
    const user = userEvent.setup();
    breadcrumbViewport(true);
    mount(<Breadcrumbs items={items} />);
    await user.click(screen.getByRole('button'));

    // act
    await user.tab();

    // assert
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveFocus();
  });
  it('collapsing removes intermediates from the accessibility tree', () => {
    // arrange
    breadcrumbViewport(true);
    mount(<Breadcrumbs items={items} />);
    fireEvent.click(screen.getByRole('button'));

    // act
    fireEvent.click(screen.getByRole('button', { name: 'Hide intermediate levels' }));

    // assert
    expect(screen.queryByRole('link', { name: 'Projects' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Atlas' })).not.toBeInTheDocument();
  });
  it('resizing above the breakpoint restores the complete trail', () => {
    // arrange
    const viewport = breadcrumbViewport(true);
    mount(<Breadcrumbs items={items} />);

    // act
    viewport.change(false);

    // assert
    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Home',
      'Projects',
      'Atlas',
    ]);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  it('resizing down collapses an untouched trail', () => {
    // arrange
    const viewport = breadcrumbViewport(false);
    mount(<Breadcrumbs items={items} />);

    // act
    viewport.change(true);

    // assert
    expect(screen.queryByRole('link', { name: 'Projects' })).not.toBeInTheDocument();
  });
  it('a custom collapseAt controls the subscribed viewport width', () => {
    // arrange
    breadcrumbViewport((query) => query === '(max-width: 56rem)');

    // act
    mount(<Breadcrumbs items={items} collapseAt="56rem" />);

    // assert
    expect(screen.getByRole('button', { name: 'Show 2 hidden breadcrumb levels' })).toBeVisible();
  });
  it('two-item trails never display the ellipsis', () => {
    // arrange
    breadcrumbViewport(true);

    // act
    mount(<Breadcrumbs items={[items[0]!, items[3]!]} />);

    // assert
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeVisible();
  });
  it('a current-only trail has no links, separators or disclosure', () => {
    // arrange
    breadcrumbViewport(true);

    // act
    mount(<Breadcrumbs items={[{ label: 'Home', current: true }]} />);

    // assert
    expect(screen.getByRole('list')).toHaveTextContent('Home');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByText('/')).not.toBeInTheDocument();
  });
  it('the disclosure is a non-submitting native button', () => {
    // arrange
    breadcrumbViewport(true);

    // act
    mount(
      <form>
        <Breadcrumbs items={items} />
      </form>,
    );

    // assert
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
  it('preserves each instance’s independent expansion', () => {
    // arrange
    breadcrumbViewport(true);
    mount(
      <>
        <Breadcrumbs items={items} aria-label="First hierarchy" />
        <Breadcrumbs items={items} aria-label="Second hierarchy" />
      </>,
    );

    // act
    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'First hierarchy' })).getByRole('button'),
    );

    // assert
    expect(
      within(screen.getByRole('navigation', { name: 'Second hierarchy' })).queryByRole('link', {
        name: 'Projects',
      }),
    ).not.toBeInTheDocument();
  });
  it('forwards the native ref and per-instance styles', () => {
    // arrange
    const ref = createRef<HTMLElement>();

    // act
    mount(
      <Breadcrumbs
        ref={ref}
        className="project-hierarchy"
        items={items}
        style={{ '--fs-breadcrumbs-gap': '12px' }}
      />,
    );

    // assert
    expect(ref.current).toHaveClass('project-hierarchy');
    expect(ref.current!.style.getPropertyValue('--fs-breadcrumbs-gap')).toBe('12px');
  });
  it('server rendering keeps all destinations available before viewport observation', () => {
    // arrange
    breadcrumbViewport(true);

    // act
    const result = renderToString(<Breadcrumbs items={items} />);

    // assert
    expect(result).toContain('href="/projects"');
    expect(result).not.toContain('<button');
  });
  it.each([
    { given: [], name: 'empty trail' },
    { given: [{ label: 'Home', href: '/home' }], name: 'missing current page' },
    {
      given: [
        { label: 'Home', current: true },
        { label: 'Settings', current: true },
      ],
      name: 'multiple current pages',
    },
    { given: [{ label: ' ', current: true }], name: 'blank current label' },
    {
      given: [
        { label: ' ', href: '/home' },
        { label: 'Settings', current: true },
      ],
      name: 'blank ancestor label',
    },
    {
      given: [
        { label: 'Home', href: '' },
        { label: 'Settings', current: true },
      ],
      name: 'empty ancestor destination',
    },
  ])('rejects a $name', ({ given }) => {
    // arrange
    const items = given as BreadcrumbItem[];

    // act
    const act = () => mount(<Breadcrumbs items={items} />);

    // assert
    expect(act).toThrow(/Breadcrumbs requires/);
  });
}
