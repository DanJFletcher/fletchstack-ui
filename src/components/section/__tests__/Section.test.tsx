// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, it } from 'vitest';
import { Section, type SectionStyle } from '../Section';

it('preserves native description relationships on the section', () => {
  // arrange
  const given = <Section id="projects" aria-describedby="summary" data-testid="section"><p>Project overview</p></Section>;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('section')).toHaveAttribute('id', 'projects');
  expect(screen.getByTestId('section')).toHaveAttribute('aria-describedby', 'summary');
});

it('renders a native section with default spacing', () => {
  // arrange
  const given = <Section data-testid="section" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('section').tagName).toBe('SECTION');
  expect(screen.getByTestId('section')).toHaveClass('fs-section--spacing-default');
});

it.each(['compact', 'default', 'spacious'] as const)('supports the %s padding preset', spacing => {
  // arrange
  const given = <Section spacing={spacing} data-testid="section" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('section')).toHaveClass(`fs-section--spacing-${spacing}`);
  expect(screen.getByTestId('section')).not.toHaveAttribute('spacing');
});

it('allows a purely visual native div wrapper', () => {
  // arrange
  const given = <Section as="div" data-testid="section"><h2>Visual grouping</h2></Section>;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('section').tagName).toBe('DIV');
  expect(screen.getByTestId('section')).not.toHaveAttribute('as');
  expect(screen.queryByRole('region')).not.toBeInTheDocument();
});

it('associates a meaningful topic with its consumer heading', () => {
  // arrange
  const given = <Section aria-labelledby="topic"><h2 id="topic">Next project</h2></Section>;

  // act
  render(given);

  // assert
  expect(screen.getByRole('region', { name: 'Next project' })).toContainElement(screen.getByRole('heading', { name: 'Next project', level: 2 }));
});

it('forwards a native HTMLElement ref', () => {
  // arrange
  const ref = createRef<HTMLElement>();
  const given = <Section ref={ref} data-testid="section" />;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByTestId('section'));
});

it('forwards the same outer ref with a visual div', () => {
  // arrange
  const ref = createRef<HTMLElement>();
  const given = <Section as="div" ref={ref} data-testid="section" />;

  // act
  render(given);

  // assert
  expect(ref.current).toBe(screen.getByTestId('section'));
  expect(ref.current?.tagName).toBe('DIV');
});

it('preserves consumer classes and typed token overrides', () => {
  // arrange
  const style: SectionStyle = { '--fs-section-padding-default': '80px', color: 'red' };
  const given = <Section className="consumer" style={style} data-testid="section" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('section')).toHaveClass('consumer');
  expect(screen.getByTestId('section').style.getPropertyValue('--fs-section-padding-default')).toBe('80px');
  expect(screen.getByTestId('section')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
});

it('preserves native padding overrides', () => {
  // arrange
  const given = <Section style={{ paddingBlock: '12px' }} data-testid="section" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('section')).toHaveStyle({ paddingBlock: '12px' });
});

it('preserves native child order', () => {
  // arrange
  const given = <Section><button>First</button><button>Second</button></Section>;

  // act
  render(given);

  // assert
  expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['First', 'Second']);
});

it('preserves the native hidden attribute', () => {
  // arrange
  const given = <Section hidden><p>Hidden topic</p></Section>;

  // act
  render(given);

  // assert
  expect(screen.getByText('Hidden topic')).not.toBeVisible();
});

it('adds no explicit role or keyboard stop', () => {
  // arrange
  const given = <Section data-testid="section" />;

  // act
  render(given);

  // assert
  expect(screen.getByTestId('section')).not.toHaveAttribute('role');
  expect(screen.getByTestId('section')).not.toHaveAttribute('tabindex');
});
