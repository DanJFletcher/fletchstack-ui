// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Menu } from '../Menu';
import { menuEdgeContracts, menuTriggerContracts } from '../../../../tests/support/menu-edge-contracts';
import { menuContracts } from '../../../../tests/support/menu-contracts';

describe('client rendering', () => menuContracts(element => render(element)));
describe('client edge cases', () => { menuEdgeContracts(element => render(element)); menuTriggerContracts(element => render(element)); });
it('preserves native hiding', () => {
  // arrange
  // act
  render(<Menu hidden triggerLabel="Actions" menuLabel="Project menu" items={[]} />);

  // assert
  expect(screen.getByRole('button', { hidden: true })).not.toBeVisible();
});
