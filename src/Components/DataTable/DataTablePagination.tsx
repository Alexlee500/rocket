import * as React from 'react';
import {
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
  I18nManager,
} from 'react-native';
import color from 'color';
import IconButton from 'react-native-paper/src/components/IconButton';
import { Text } from 'react-native-paper';
import { withTheme } from 'react-native-paper/src/core/theming';
import MaterialCommunityIcon from 'react-native-paper/src/components/MaterialCommunityIcon';

type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * The currently visible page (starting with 0).
   */
  page: number;
  /**
   * The total number of pages.
   */
  numberOfPages: number;
  /**
   * Label text to display
   */
  label?: React.ReactNode;
  /**
   * Function to execute on page change.
   */
  onPageChange: (page: number) => void;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

/**
 * A component to show pagination for data table.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/data-table-pagination.png" />
 *   </figure>
 * </div>
 *
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DataTable } from 'react-native-paper';
 *
 * const itemsPerPage = 2;
 *
 * const items = [
 *   {
 *     key: 1,
 *     name: 'Page 1',
 *   },
 *   {
 *     key: 2,
 *     name: 'Page 2',
 *   },
 *   {
 *     key: 3,
 *     name: 'Page 3',
 *   },
 * ];
 *
 * const MyComponent = () => {
 *   const [page, setPage] = React.useState(0);
 *   const from = page * itemsPerPage;
 *   const to = (page + 1) * itemsPerPage;
 *
 *   return (
 *     <DataTable>
 *       <DataTable.Pagination
 *         page={page}
 *         numberOfPages={Math.floor(items.length / itemsPerPage)}
 *         onPageChange={page => setPage(page)}
 *         label={`${from + 1}-${to} of ${items.length}`}
 *       />
 *     </DataTable>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */

const DataTablePagination = ({
  label,
  page,
  numberOfPages,
  onPageChange,
  style,
  theme,
  ...rest
}: Props) => {
  const labelColor = color(theme.colors.text).alpha(0.6).rgb().string();

  return (
    <View {...rest} style={[styles.container, style]}>
      <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
        {label}
      </Text>
      <IconButton
        icon={({ size, color }) => (
          <MaterialCommunityIcon
            name="chevron-left"
            color={color}
            size={size}
            direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
          />
        )}
        color={theme.colors.text}
        disabled={page === 0}
        onPress={() => onPageChange(page - 1)}
      />
      <IconButton
        icon={({ size, color }) => (
          <MaterialCommunityIcon
            name="chevron-right"
            color={color}
            size={size}
            direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
          />
        )}
        color={theme.colors.text}
        disabled={numberOfPages === 0 || page === numberOfPages - 1}
        onPress={() => onPageChange(page + 1)}
      />
    </View>
  );
};

DataTablePagination.displayName = 'DataTable.Pagination';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },

  label: {
    fontSize: 12,
    marginRight: 44,
  },
});

export default withTheme(DataTablePagination);

// @component-docs ignore-next-line
export { DataTablePagination };