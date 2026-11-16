// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Navbar } from '../Navbar';
import { navbarWidth } from '../../../../tests/support/navbar-width';
import { navbarContracts } from '../../../../tests/support/navbar-contracts';

describe('client rendering', () => navbarContracts(element => render(element)));
afterEach(() => vi.unstubAllGlobals());
it('preserves native root hiding', () => {
  // arrange
  navbarWidth();

  // act
  render(<Navbar hidden aria-label="Primary">{null}</Navbar>);

  // assert
  expect(screen.getByRole('navigation', { hidden: true })).not.toBeVisible();
});
