// @vitest-environment jsdom
import '../../../../tests/support/dom';
import '../../../../tests/support/dialog-platform';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dialog } from '../Dialog';
import { dialogContracts } from '../../../../tests/support/dialog-contracts';

describe('Dialog', () => dialogContracts(render));
it('uses the medium size by default', () => {
  // arrange
  const onOpenChange = () => {};

  // act
  const view = render(<Dialog open={false} onOpenChange={onOpenChange} />);

  // assert
  expect(view.container.firstChild).toHaveClass('fs-dialog--md');
});
