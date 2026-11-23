// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render } from '@testing-library/react';
import { toastContracts } from '../../../../tests/support/toast-contracts';
toastContracts(render);

import { expect, it } from 'vitest';
import { Toast } from '../Toast';
it('keeps the dismiss button from submitting its enclosing form', () => {
  // arrange
  // act
  const result = render(<form><Toast>Saved</Toast></form>);

  // assert
  expect(result.getByRole('button')).toHaveAttribute('type', 'button');
});
