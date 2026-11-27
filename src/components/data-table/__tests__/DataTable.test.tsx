// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { dataTableContracts } from '../../../../tests/support/data-table-contracts';
import { DataTable } from '../DataTable';
dataTableContracts(render);
it('keeps a named table without a visible caption', () => {
  // arrange
  // act
  const result = render(
    <DataTable
      aria-label="Transactions"
      rows={[]}
      columns={[{ id: 'id', header: 'ID' }]}
      getRowKey={() => 'id'}
    />,
  );
  // assert
  expect(result.getByRole('table', { name: 'Transactions' })).toBeVisible();
});
