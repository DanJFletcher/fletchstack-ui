// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render } from '@testing-library/react';
import { itemContracts } from '../../../../tests/support/item-contracts';
itemContracts(render);
import { expect, it } from 'vitest';
import { Item } from '../Item';
it('preserves a native root id for consumer relationships', () => {
  // arrange
  // act
  const result = render(<Item id="invitation">Invitation</Item>);

  // assert
  expect(result.getByText('Invitation')).toHaveAttribute('id', 'invitation');
});
