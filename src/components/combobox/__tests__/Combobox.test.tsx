// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { comboboxContracts } from '../../../../tests/support/combobox-contracts';
import { Combobox } from '../Combobox';

describe('client rendering', () => comboboxContracts(element => render(element)));

it('can unmount while a form reset is queued', async () => {
  // arrange
  const mounted = render(<form aria-label="Regions"><Combobox label="Region" options={[]} /></form>);
  const form = screen.getByRole('form') as HTMLFormElement;

  // act
  await act(async () => { form.reset(); mounted.unmount(); });

  // assert
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
});
