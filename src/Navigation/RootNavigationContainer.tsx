import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { selectAccessToken } from '../Redux/features/tdaSlice'

import  AuthTestScreen  from '../Screens/AuthTestScreen'
import  DeAuthTestScreen from '../Screens/DeAuthTestScreen'

import OauthPromptScreen from '../Screens/OauthPromptScreen';
import AuthStackNavigator from './AuthStackNavigator';
import AppStackNavigator from './AppStackNavigator';
import LoginScreen from '../Screens/LoginScreen';

const Stack = createStackNavigator();

export default function RootNavigationContainer(){
    const authenticated = useSelector( (state: RootState) => state.auth.authenticated )
    const access = useSelector( selectAccessToken )


    return (
        <NavigationContainer>
            <Stack.Navigator headerMode="none">
                { access ? (
                    <Stack.Screen
                    name="App"
                    component={AppStackNavigator}
                    />
                ):(
                    <Stack.Screen
                        name="LoginScreen"
                        component={LoginScreen}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}