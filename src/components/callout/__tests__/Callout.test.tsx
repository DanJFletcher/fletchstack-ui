// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Callout } from '../Callout';
import { calloutContracts } from '../../../../tests/support/callout-contracts';

describe('client rendering', () => calloutContracts((element) => render(element)));
it('preserves native hiding', () => {
  // arrange
  // act
  render(<Callout hidden>Hidden guidance</Callout>);

  // assert
  expect(screen.getByText('Hidden guidance')).not.toBeVisible();
});
