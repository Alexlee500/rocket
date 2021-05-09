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

  mainRow: JSX.Element
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

const DataTableAccordion = ({
  onPress,
  style,
  theme,
  children,
  mainRow,
  pointerEvents,
  ...rest
}: Props) => {
  const borderBottomColor = color(theme.dark ? white : black)
    .alpha(0.12)
    .rgb()
    .string();

  const [expanded, setExpanded] = React.useState<boolean>(false);

  const handlePress = () => {
    onPress?.();
    console.log(`pressed ${expanded}`)
    setExpanded((expanded) => !expanded);
  }
  return (
    <View> 
      <TouchableRipple
        onPress={handlePress}
      >
        {mainRow}
      </TouchableRipple>
      <View>
        {expanded? children : null}
      </View>
    </View>
  )
};

DataTableAccordion.displayName = 'DataTable.Accordion'

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
  child:{
    paddingLeft: 64,
  }
});

export default withTheme(DataTableAccordion);

// @component-docs ignore-next-line
export { DataTableAccordion };