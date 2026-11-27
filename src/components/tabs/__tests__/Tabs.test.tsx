// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tabs } from '../Tabs';
import { tabsFocusContracts } from '../../../../tests/support/tabs-focus-contracts';
import { tabItems, tabsContracts } from '../../../../tests/support/tabs-contracts';

describe('client rendering', () => {
  tabsContracts(render);
  tabsFocusContracts(render);
});
it('preserves native root hiding', () => {
  // arrange
  const given = <Tabs label="Workspace" items={tabItems} hidden />;

  // act
  render(given);

  // assert
  expect(screen.getByRole('tablist', { hidden: true })).not.toBeVisible();
});
