import * as React from 'react';
import color from 'color';
import {
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
  ViewProps,
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { black, white } from 'react-native-paper/src/styles/colors';
import { withTheme } from 'react-native-paper/src/core/theming';
import type { $RemoveChildren } from 'react-native-paper/src/types'

type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Content of the `DataTableRow`.
   */
  children: React.ReactNode;
  left?:(props:{
    color: string;
    style:{
      marginLeft: number;
      marginRight: number;
      marginVertical?: number;
    };
  }) => React.ReactNode
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
  /**
   * `pointerEvents` passed to the `View` container, which is wrapping children within `TouchableRipple`.
   */
  pointerEvents?: ViewProps['pointerEvents'];
};

/**
 * A component to show a single row inside of a table.
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
 */

const DataTableRow = ({
  onPress,
  left,
  style,
  theme,
  children,
  pointerEvents,
  ...rest
}: Props) => {
  const borderBottomColor = color(theme.dark ? white : black)
    .alpha(0.12)
    .rgb()
    .string();
  const descriptionColor = color(theme.colors.text).alpha(0.54).rgb().string();
  return (
    <TouchableRipple
      {...rest}
      onPress={onPress}
      style={[styles.container, { borderBottomColor }, style]}
    >
      <View style={styles.content} pointerEvents={pointerEvents}>
        {left?
        left({
          color: descriptionColor,
          style: {
              ...styles.iconMarginLeft,
              ...styles.marginVerticalNone,
            },
        }):null}
        {children}
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  marginVerticalNone: { marginVertical: 0 }
});

export default withTheme(DataTableRow);

// @component-docs ignore-next-line
export { DataTableRow };