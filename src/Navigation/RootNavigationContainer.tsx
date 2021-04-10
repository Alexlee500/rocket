import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/rootReducer';

import  AuthTestScreen  from '../Screens/AuthTestScreen'
import  DeAuthTestScreen from '../Screens/DeAuthTestScreen'

import AuthStackNavigator from './AuthStackNavigator';
import AppStackNavigator from './AppStackNavigator';

const Stack = createStackNavigator();

export default function RootNavigationContainer(){
    const authenticated = useSelector( (state: RootState) => state.auth.authenticated )

    return (
        <NavigationContainer>
            <Stack.Navigator headerMode="none">
                { authenticated ? (
                    <Stack.Screen
                        name="AppStack"
                        component={AppStackNavigator}
                    />
                ):(
                    <Stack.Screen
                        name="AuthStack"
                        component={AuthStackNavigator}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}