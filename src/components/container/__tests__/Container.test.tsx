// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, it } from 'vitest';
import { Container, type ContainerStyle } from '../Container';

it('preserves native description relationships on the layout wrapper', () => {
  // arrange
  const given = <Container id="project" aria-describedby="summary" data-testid="layout"><p>Project overview</p></Container>;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveAttribute('id', 'project');
  expect(screen.getByTestId('layout')).toHaveAttribute('aria-describedby', 'summary');
  expect(screen.getByText('Project overview')).toBeVisible();
});

it('defaults to the content width with gutters', () => {
  // arrange
  const given = <Container data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass('fs-container--content', 'fs-container--gutters');
});

it.each(['reading', 'content', 'wide'] as const)('supports the %s preset', size => {
  // arrange
  const given = <Container size={size} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass(`fs-container--${size}`);
});

it('removes the gutter opt-in without changing the selected preset', () => {
  // arrange
  const given = <Container size="reading" gutters={false} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass('fs-container--reading');
  expect(screen.getByTestId('layout')).not.toHaveClass('fs-container--gutters');
});

it('forwards a native div ref', () => {
  // arrange
  const ref = createRef<HTMLDivElement>();
  const given = <Container ref={ref} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByTestId('layout'));
  expect(ref.current?.tagName).toBe('DIV');
});

it('preserves consumer classes and typed styles', () => {
  // arrange
  const style: ContainerStyle = { '--fs-container-max-width-content': '900px', color: 'red' };
  const given = <Container className="consumer" style={style} data-testid="layout" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).toHaveClass('consumer');
  expect(screen.getByTestId('layout').style.getPropertyValue('--fs-container-max-width-content')).toBe('900px');
  expect(screen.getByTestId('layout')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
});

it('preserves native hidden behavior', () => {
  // arrange
  const given = <Container hidden><p>Hidden content</p></Container>;

  // act
  render(given);

  // assert
  expect(screen.getByText('Hidden content')).not.toBeVisible();
});

it('adds no semantic role or keyboard focus', () => {
  // arrange
  const given = <Container data-testid="layout"><p>Content</p></Container>;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('layout')).not.toHaveAttribute('role');
  expect(screen.getByTestId('layout')).not.toHaveAttribute('tabindex');
});
