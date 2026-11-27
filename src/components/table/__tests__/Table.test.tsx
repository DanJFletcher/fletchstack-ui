// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { tableContracts } from '../../../../tests/support/table-contracts';
import { Table } from '../Table';

describe('client rendering', () => tableContracts((element) => render(element)));

it('distinguishes numeric and string row keys without duplicating native row identities', () => {
  // arrange
  const rows = [
    { key: 1, label: 'Numeric' },
    { key: '1', label: 'String' },
  ];

  // act
  render(
    <Table
      rows={rows}
      getRowKey={(row) => row.key}
      columns={[{ id: 'label', header: 'Name', accessor: 'label' }]}
      caption="Keys"
    />,
  );

  // assert
  expect(screen.getAllByRole('row')).toHaveLength(3);
});
