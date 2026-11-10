// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Section, type SectionProps } from '../../../../src/index';

it.each<SectionProps>([{}, { spacing: 'compact' }, { spacing: 'spacious' }, { as: 'div', spacing: 'default' }])('hydrates %j while retaining native attributes and child order', props => {
  // arrange
  const ref = createRef<HTMLElement>();
  const given = <Section {...props} ref={ref} id="project-region" className="custom" style={{ '--fs-section-padding-default': '80px' }} data-testid="section"><h2>Projects</h2><button>First</button><button>Second</button></Section>;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);
  const onRecoverableError = vi.fn();

  // act
  render(given, { container, hydrate: true, onRecoverableError });

  // assert
  expect(ref.current).toBe(screen.getByTestId('section'));
  expect(ref.current).toHaveAttribute('id', 'project-region');
  expect(ref.current).toHaveClass('custom');
  expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['First', 'Second']);
  expect(onRecoverableError).not.toHaveBeenCalled();
});

it('hydrates a native heading-associated region without adding a keyboard stop', () => {
  // arrange
  const given = <Section aria-labelledby="topic-title"><h2 id="topic-title">Project topic</h2></Section>;
  const container = document.createElement('div');
  container.innerHTML = renderToString(given);
  document.body.appendChild(container);

  // act
  render(given, { container, hydrate: true });

  // assert
  expect(screen.getByRole('region', { name: 'Project topic' })).not.toHaveAttribute('tabindex');
});
