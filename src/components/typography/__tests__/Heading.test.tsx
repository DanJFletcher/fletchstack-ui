// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, it } from 'vitest';
import { Heading, type HeadingStyle } from '../Heading';

it('defaults to a section-sized native level-two heading', () => {
  // arrange
  const given = <Heading>Notifications</Heading>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('heading', { level: 2, name: 'Notifications' })).toHaveClass('fs-heading--section');
});

it.each(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const)('keeps %s semantics independent of page sizing', as => {
  // arrange
  const given = <Heading as={as} size="page">Project settings</Heading>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('heading', { level: Number(as.slice(1)), name: 'Project settings' })).toHaveClass('fs-heading--page');
});

it.each(['page', 'section', 'subheading'] as const)('supports the %s visual role', size => {
  // arrange
  const given = <Heading size={size}>Project</Heading>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('heading', { name: 'Project' })).toHaveClass(`fs-heading--${size}`);
});

it('forwards native attributes, a heading ref and consumer styles', () => {
  // arrange
  const ref = createRef<HTMLHeadingElement>();
  const style: HeadingStyle = { '--fs-typography-heading-font-page': '3rem', color: 'red' };
  const given = <Heading as="h1" id="project" title="Details" className="consumer" style={style} ref={ref}>Project</Heading>;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByRole('heading', { name: 'Project' }));
  expect(ref.current).toHaveAttribute('id', 'project');
  expect(ref.current).toHaveAttribute('title', 'Details');
  expect(ref.current).toHaveClass('consumer');
  expect(ref.current?.style.getPropertyValue('--fs-typography-heading-font-page')).toBe('3rem');
});
