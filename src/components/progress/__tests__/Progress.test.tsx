// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { progressContracts } from '../../../../tests/support/progress-contracts';
import { Progress } from '../Progress';
progressContracts(render);
it('preserves a fractional task value before formatting', () => {
  // arrange
  // act
  const result = render(<Progress value={12.5} />);

  // assert
  expect(result.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '12.5');
});
