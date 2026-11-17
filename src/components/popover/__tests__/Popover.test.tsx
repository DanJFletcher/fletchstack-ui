// @vitest-environment jsdom
import '../../../../tests/support/dom';
import '../../../../tests/support/popover-platform';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Popover } from '../Popover';
import { popoverContracts } from '../../../../tests/support/popover-contracts';

describe('Popover', () => popoverContracts(render));

it('uses a secondary Button trigger by default', () => {
  // arrange
  const element = <Popover triggerLabel="Details" />;

  // act
  const view = render(element);

  // assert
  expect(view.getByRole('button', { name: 'Details' })).toHaveClass('fs-button--secondary');
});

import { popoverPositionContracts } from '../../../../tests/support/popover-position-contracts';
describe('popover position', popoverPositionContracts);
