// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Breadcrumbs } from '../Breadcrumbs';
import { breadcrumbViewport } from '../../../../tests/support/breadcrumbs-viewport';
import { breadcrumbsContracts } from '../../../../tests/support/breadcrumbs-contracts';

afterEach(() => vi.unstubAllGlobals());
describe('client rendering', () => breadcrumbsContracts((element) => render(element)));
it('preserves native hiding', () => {
  // arrange
  breadcrumbViewport(false);

  // act
  render(<Breadcrumbs hidden items={[{ label: 'Home', current: true }]} />);

  // assert
  expect(screen.getByRole('navigation', { hidden: true })).not.toBeVisible();
});
