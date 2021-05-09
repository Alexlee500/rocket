import * as React from 'react';
import { StyleSheet, StyleProp, View, ViewStyle } from 'react-native';
import DataTableCell from './DataTableCell';
import DataTableHeader, {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DataTableHeader as _DataTableHeader,
} from './DataTableHeader';
import DataTableTitle, {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DataTableTitle as _DataTableTitle,
} from './DataTableTitle';
import DataTablePagination, {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DataTablePagination as _DataTablePagination,
} from './DataTablePagination';

import DataTableAccordion, {
    DataTableAccordion as _DataTableAccordion, 
} from './DataTableAccordion'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DataTableRow, { DataTableRow as _DataTableRow } from './DataTableRow';

type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Content of the `DataTable`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Data tables allow displaying sets of data.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/data-table.png" />
 *     <figcaption>Data table</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DataTable } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <DataTable>
 *     <DataTable.Header>
 *       <DataTable.Title>Dessert</DataTable.Title>
 *       <DataTable.Title numeric>Calories</DataTable.Title>
 *       <DataTable.Title numeric>Fat</DataTable.Title>
 *     </DataTable.Header>
 *
 *     <DataTable.Row>
 *       <DataTable.Cell>Frozen yogurt</DataTable.Cell>
 *       <DataTable.Cell numeric>159</DataTable.Cell>
 *       <DataTable.Cell numeric>6.0</DataTable.Cell>
 *     </DataTable.Row>
 *
 *     <DataTable.Row>
 *       <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
 *       <DataTable.Cell numeric>237</DataTable.Cell>
 *       <DataTable.Cell numeric>8.0</DataTable.Cell>
 *     </DataTable.Row>
 *
 *     <DataTable.Pagination
 *       page={1}
 *       numberOfPages={3}
 *       onPageChange={page => {
 *         console.log(page);
 *       }}
 *       label="1-2 of 6"
 *     />
 *   </DataTable>
 * );
 *
 * export default MyComponent;
 * ```
 */
const DataTable = ({ children, style, ...rest }: Props) => (
  <View {...rest} style={[styles.container, style]}>
    {children}
  </View>
);

// @component ./DataTableHeader.tsx
DataTable.Header = DataTableHeader;

// @component ./DataTableTitle.tsx
DataTable.Title = DataTableTitle;

// @component ./DataTableRow.tsx
DataTable.Row = DataTableRow;

// @component ./DataTableCell.tsx
DataTable.Cell = DataTableCell;

// @component ./DataTablePagination.tsx
DataTable.Pagination = DataTablePagination;

DataTable.Accordion = DataTableAccordion;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default DataTable;