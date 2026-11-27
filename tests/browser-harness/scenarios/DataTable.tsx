import { DataTable } from '../../../src/components/data-table/DataTable';
import {
  paymentProps,
  type Payment,
  DataTableExample,
  ControlledDataTable,
  StockDataTable,
  RetryDataTable,
} from '../../../src/components/data-table/stories/data-table-examples';
import type { DataTableProps } from '../../../src/components/data-table/types';
import type { Scenario } from '../gallery/types';
import '../../../src/components/data-table/data-table.css';
import '../../../src/components/data-table/stories/data-table.stories.css';
import '../../../src/components/table/table.css';
import '../../../src/components/field/field.css';
import '../../../src/components/checkbox/checkbox.css';
import '../../../src/components/icon/icon.css';
import '../../../src/components/select/select.css';
import '../../../src/components/text-input/text-input.css';
import '../../../src/components/button/button.css';
import '../../../src/components/spinner/spinner.css';
import '../../../src/components/popover/popover.css';
import '../../../src/components/menu/menu.css';
const Playground: Scenario<DataTableProps<Payment>> = {};
const Composition: Scenario<DataTableProps<Payment>> = { render: () => <DataTableExample /> };
const Controlled: Scenario<DataTableProps<Payment>> = { render: () => <ControlledDataTable /> };
const Stock: Scenario<DataTableProps<Payment>> = { render: () => <StockDataTable /> };
const Retry: Scenario<DataTableProps<Payment>> = { render: () => <RetryDataTable /> };
export const component = DataTable<Payment>;
export const defaults: DataTableProps<Payment> = paymentProps;
export const scenarios = { Playground, Composition, Controlled, Stock, Retry };
