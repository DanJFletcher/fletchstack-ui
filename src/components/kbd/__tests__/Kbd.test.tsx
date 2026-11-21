// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { kbdContracts } from '../../../../tests/support/kbd-contracts';
import { Kbd } from '../Kbd';
kbdContracts(render);
it('preserves Unicode keyboard text without platform substitution', () => {
  // arrange
  // act
  const result = render(<Kbd>⌘</Kbd>);
  // assert
  expect(result.getByText('⌘')).toHaveTextContent('⌘');
});
