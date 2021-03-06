import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AuthSelectionScreen from '../Screens/AuthSelectionScreen';
import PinScreen from '../Screens/PinScreen'
import LoginScreen from '../Screens/LoginScreen';

const authStack = createStackNavigator();
export default function AuthStackNavigator(){
    return (
        <authStack.Navigator 
            initialRouteName="Selection"
            headerMode="none">
            <authStack.Screen name="Selection" component={LoginScreen}/>
            <authStack.Screen name="Pin" component={PinScreen}/>
        </authStack.Navigator>
    )
}