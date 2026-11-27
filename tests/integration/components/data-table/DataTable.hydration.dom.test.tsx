// @vitest-environment jsdom
import '../../../support/dom';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { dataTableContracts } from '../../../support/data-table-contracts';
import { DataTable } from '../../../../src/components/data-table/DataTable';
dataTableContracts((element) => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);
  return render(element, {
    container,
    hydrate: true,
    onRecoverableError: (error) => {
      throw error;
    },
  });
});
it('renders the requested page on the server', () => {
  // arrange
  // act
  const result = renderToString(
    <DataTable
      caption="Records"
      rows={[{ id: 'a' }, { id: 'b' }]}
      columns={[{ id: 'id', header: 'ID', accessor: 'id' }]}
      getRowKey={(row) => row.id}
      pagination
      defaultPagination={{ pageIndex: 1, pageSize: 1 }}
    />,
  );
  // assert
  expect(result).toContain('>b</td>');
  expect(result).not.toContain('>a</td>');
});
