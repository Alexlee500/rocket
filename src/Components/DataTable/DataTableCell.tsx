import * as React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import type { $RemoveChildren } from 'react-native-paper/src/types'
import Colors from '../../configs/Colors'



type Props = $RemoveChildren<typeof TouchableRipple> & {
    /**
     * Content of the `DataTableCell`.
     */
    children: React.ReactNode;
    /**
     * Align the text to the right. Generally monetary or number fields are aligned to right.
     */
    numeric?: boolean;

    /*
    * red / green / neutral
    */
    direction?: number;
    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
  };
  
  /**
   * A component to show a single cell inside of a table.
   *
   * <div class="screenshots">
   *   <figure>
   *     <img class="medium" src="screenshots/data-table-row-cell.png" />
   *   </figure>
   * </div>
   *
   *
   * ## Usage
   * ```js
   * import * as React from 'react';
   * import { DataTable } from 'react-native-paper';
   *
   * const MyComponent = () => (
   *      <DataTable.Row>
   *        <DataTable.Cell numeric>1</DataTable.Cell>
   *        <DataTable.Cell numeric>2</DataTable.Cell>
   *        <DataTable.Cell numeric>3</DataTable.Cell>
   *        <DataTable.Cell numeric>4</DataTable.Cell>
   *      </DataTable.Row>
   * );
   *
   * export default MyComponent;
   * ```
   *
   * If you want to support multiline text, please use View instead, as multiline text doesn't comply with
   * MD Guidelines (https://github.com/callstack/react-native-paper/issues/2381).
   */
  
  const DataTableCell = ({ children, style, numeric, direction, ...rest }: Props) => (
    <TouchableRipple
      {...rest}
      style={[styles.container, numeric && styles.right, style]}
    >
      <Text numberOfLines={1}  style={ 
        direction? ( (direction == 1) ? {color:Colors.Green} : {color:Colors.Red} ) : {}}>{children}</Text>
    </TouchableRipple>
  );
  
  DataTableCell.displayName = 'DataTableCell';
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
  
    right: {
      justifyContent: 'flex-end',
    },
  });

  
  export default DataTableCell;