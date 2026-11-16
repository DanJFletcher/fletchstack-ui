// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { appLayoutContracts } from '../../../../tests/support/app-layout-contracts';

describe('native component contract', () => appLayoutContracts(render));

import { AppContent } from '../AppContent';

it('preserves the native hidden attribute', () => {
  // arrange
  const given = <AppContent hidden><span>Hidden content</span></AppContent>;

  // act
  render(given);

  // assert
  expect(screen.getByText('Hidden content')).not.toBeVisible();
});
