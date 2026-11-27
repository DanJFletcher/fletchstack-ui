// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, it } from 'vitest';
import * as library from '../../../index';

it.each([
  'MoonIcon',
  'SunIcon',
  'CheckIcon',
  'CloseIcon',
  'ChevronDownIcon',
  'ArrowRightIcon',
  'PlusIcon',
  'ExternalLinkIcon',
  'HomeIcon',
  'InboxIcon',
  'HelpIcon',
])('exports %s as optional named artwork', (name) => {
  // arrange
  const expected = name;

  // act
  const result = Object.keys(library);

  // assert
  expect(result).toContain(expected);
});

const catalog = [
  { name: 'Home', Component: library.HomeIcon, path: 'M3 10l9-7 9 7M5 9v12h5v-7h4v7h5V9' },
  {
    name: 'Inbox',
    Component: library.InboxIcon,
    path: 'M4 4h16l3 14v3H1v-3L4 4Zm-2 13h6l2 3h4l2-3h6',
  },
  {
    name: 'Help',
    Component: library.HelpIcon,
    path: 'M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4m.1 3h.01',
  },
  {
    name: 'Moon',
    Component: library.MoonIcon,
    path: 'M20.9 13.4A9 9 0 0 1 10.6 3.1 9 9 0 1 0 20.9 13.4Z',
  },
  {
    name: 'Sun',
    Component: library.SunIcon,
    path: 'M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42',
  },
  { name: 'Check', Component: library.CheckIcon, path: 'm5 12 4 4L19 6' },
  { name: 'Close', Component: library.CloseIcon, path: 'm6 6 12 12M6 18 18 6' },
  { name: 'Chevron down', Component: library.ChevronDownIcon, path: 'm6 9 6 6 6-6' },
  { name: 'Arrow right', Component: library.ArrowRightIcon, path: 'M4 12h16m-6-6 6 6-6 6' },
  { name: 'Plus', Component: library.PlusIcon, path: 'M12 4v16M4 12h16' },
  {
    name: 'External link',
    Component: library.ExternalLinkIcon,
    path: 'M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5',
  },
];

it.each(catalog)(
  '$name preserves its artwork and forwards SVG customization',
  ({ name, Component, path }) => {
    // arrange
    const ref = createRef<SVGSVGElement>();
    const given = (
      <Component
        label={name}
        ref={ref}
        className="brand-art"
        data-source="catalog"
        style={{ '--fs-icon-size-medium': '28px' }}
      />
    );

    // act
    render(given);

    // assert
    const result = screen.getByRole('img', { name });
    expect(result.querySelector('path')).toHaveAttribute('d', path);
    expect(result).toHaveAttribute('viewBox', '0 0 24 24');
    expect(result).toHaveAttribute('data-source', 'catalog');
    expect(result).toHaveAttribute('stroke-linecap', 'round');
    expect(result).toHaveAttribute('stroke-linejoin', 'round');
    expect(result).toHaveClass('brand-art');
    expect(ref.current).toBe(result);
    expect(result.style.getPropertyValue('--fs-icon-size-medium')).toBe('28px');
  },
);

const sizedCatalog = catalog.flatMap((icon) => [
  { ...icon, size: 'small' as const, expected: 'fs-icon--small' },
  { ...icon, size: 'medium' as const, expected: 'fs-icon--medium' },
  { ...icon, size: 'large' as const, expected: 'fs-icon--large' },
]);

it.each(sizedCatalog)('$name supports the $size size', ({ name, Component, size, expected }) => {
  // arrange
  const given = <Component label={name} size={size} />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('img', { name })).toHaveClass(expected);
});

it('keeps named artwork fixed against untyped children and viewBox overrides', () => {
  // arrange
  const conflicting: Record<string, unknown> = {
    viewBox: '0 0 999 999',
    children: <circle data-testid="replacement" />,
  };
  const given = <library.CheckIcon {...conflicting} label="Confirm" />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('img', { name: 'Confirm' })).toHaveAttribute('viewBox', '0 0 24 24');
  expect(screen.queryByTestId('replacement')).not.toBeInTheDocument();
});
