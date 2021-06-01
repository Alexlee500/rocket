import React, { useEffect } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { Button, Text } from 'react-native-paper';


type Props = {
    onValueChange: (value: string) => void;
    value: string; 
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}


type ToggleButtonContextType = {
    value: string | null;
    onValueChange: (item: string) => void | null
}

export const ToggleButtonRowContext = React.createContext<ToggleButtonContextType>(null as any)


const ToggleButtonRow = ({ value, onValueChange, children, style} : Props) => {
    const count = React.Children.count(children);
    return (
        <ToggleButtonRowContext.Provider value={{value, onValueChange}}>
            {children}
        </ToggleButtonRowContext.Provider>
    )
}

export default ToggleButtonRow;

const styles = StyleSheet.create({

})