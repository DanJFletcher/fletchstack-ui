// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { bottomNavigationContracts } from '../../../../tests/support/bottom-navigation-contracts';

describe('native component contract', () => bottomNavigationContracts(render));

import { BottomNavigation } from '../BottomNavigation';

it('preserves the native hidden attribute', () => {
  // arrange
  const given = (
    <BottomNavigation aria-label="Hidden" hidden>
      <span>Hidden content</span>
    </BottomNavigation>
  );

  // act
  render(given);

  // assert
  expect(screen.getByText('Hidden content')).not.toBeVisible();
});
