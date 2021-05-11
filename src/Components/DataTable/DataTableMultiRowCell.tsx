import * as React from 'react';
import { StyleSheet, StyleProp, ViewStyle, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import type { $RemoveChildren } from 'react-native-paper/src/types'
import Colors from '../../configs/Colors'

type Props = $RemoveChildren<typeof TouchableRipple> & {
    /**
     * Content of the `DataTableCell`.
     */
    mainText: string;
    subText: string;
    /**
     * Align the text to the right. Generally monetary or number fields are aligned to right.
     */
    numeric?: boolean;

    /*
    * red / green / neutral
    */
    mainDirection?: number;
    subDirection?: number;

    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
  };

  const DataTableMultiRowCell = ({ mainText, subText, style, numeric, mainDirection, subDirection, ...rest }: Props) => (
    <TouchableRipple
      {...rest}
      style={[styles.container, numeric && styles.right, style]}
    >
    <View>
    <Text numberOfLines={2}  style={ 
        [ numeric && styles.rightText,  (mainDirection? ( (mainDirection == 1) ? {color:Colors.Green} : {color:Colors.Red} ) : {}), styles.mainText ]}>{mainText}
    </Text>

    <Text numberOfLines={1}  style={ 
        [ numeric && styles.rightText, (subDirection? ( (subDirection == 1) ? {color:Colors.Green} : {color:Colors.Red} ) : {}), styles.subText]}>{subText}
    </Text>
    </View>

    </TouchableRipple>
  );

  DataTableMultiRowCell.displayName = 'DataTableMultiRowCell';
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
  
    right: {
      justifyContent: 'flex-end',
    },
    rightText: {
        textAlign: 'right',
        paddingLeft:0
    },
    mainText:{
        fontSize:16
    },
    subText:{
        fontSize:14  
    }

  });

  
  export default DataTableMultiRowCell;