import * as React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import Icon, { IconSource } from 'react-native-paper/src/components/Icon';
import { TouchableRipple } from 'react-native-paper';


type Props = {
  /**
   * Icon to show.
   */
  icon: IconSource;
  /**
   * Color for the icon.
   */
  onPress?: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const ICON_SIZE = 20;

const DataTableIcon = ({ onPress, icon, color: iconColor, style }: Props) => (
    <TouchableRipple
        onPress={onPress}
    >
  <View style={[styles.item, style]} pointerEvents="box-none" >
    <Icon source={icon} size={ICON_SIZE} color={iconColor}/>
  </View>
  </TouchableRipple>

);

const styles = StyleSheet.create({
  item: {
    marginRight: 16,
    marginLeft: 16,

    height: 48,
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

DataTableIcon.displayName = 'DataTable.Icon';

export default DataTableIcon;