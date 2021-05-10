import * as React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import Icon, { IconSource } from 'react-native-paper/src/components/Icon';

type Props = {
  /**
   * Icon to show.
   */
  icon: IconSource;
  /**
   * Color for the icon.
   */
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const ICON_SIZE = 16;

const DataTableIcon = ({ icon, color: iconColor, style }: Props) => (
  <View style={[styles.item, style]} pointerEvents="box-none">
    <Icon source={icon} size={ICON_SIZE} color={iconColor} />
  </View>
);

const styles = StyleSheet.create({
  item: {
    margin: 8,
    height: 40,
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

DataTableIcon.displayName = 'DataTable.Icon';

export default DataTableIcon;