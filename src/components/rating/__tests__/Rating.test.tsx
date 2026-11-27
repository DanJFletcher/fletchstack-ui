// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { describe } from 'vitest';
import { render } from '@testing-library/react';
import { ratingContracts } from '../../../../tests/support/rating-contracts';

describe('client rendering', () => ratingContracts((element) => render(element)));

import { act, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Rating } from '../Rating';

it('can unmount while a native reset is queued without retaining a stale group', async () => {
  // arrange
  const mounted = render(
    <form aria-label="Review form">
      <Rating mode="input" label="Review" defaultValue={2} />
    </form>,
  );
  const form = screen.getByRole('form') as HTMLFormElement;
  // act
  await act(async () => {
    form.reset();
    mounted.unmount();
  });
  // assert
  expect(screen.queryByRole('group')).not.toBeInTheDocument();
});
