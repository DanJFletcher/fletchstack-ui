// @vitest-environment jsdom
import '../../../support/dom';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { tableContracts } from '../../../support/table-contracts';
import { Table } from '../../../../src/components/table/Table';

describe('server hydration', () => tableContracts(element => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);
  return render(element, { container, hydrate: true, onRecoverableError: error => { throw error; } });
}));

it('renders semantic sorted data and native selected controls before hydration', () => {
  const result = renderToString(<Table rows={[{ id: 'a', count: 2 }, { id: 'b', count: 10 }]} getRowKey={row => row.id} columns={[{ id: 'count', header: 'Count', accessor: 'count', sortable: true }]} caption="Records" defaultSort={{ columnId: 'count', direction: 'desc' }} selectionMode="multiple" defaultSelectedRowKeys={['b']} />);
  expect(result).toContain('aria-sort="descending"'); expect(result).toContain('checked=""'); expect(result.indexOf('>10</td>')).toBeLessThan(result.indexOf('>2</td>'));
});
