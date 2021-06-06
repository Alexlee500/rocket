import React, { useEffect } from 'react';
import  {Text, View, Button } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';

import { RootState } from '../Redux/rootReducer';
import { selectRefreshToken, selectSocketAuth, selectLoginLoading } from '../Redux/features/tdaSlice'

import DeAuthTestScreen from '../Screens/DeAuthTestScreen';
import LoginLoadingScreen from '../Screens/LoginLoadingScreen';
import OauthPromptScreen from '../Screens/OauthPromptScreen';
import AppTabNavigator from './AppTabNavigator';
const Stack = createStackNavigator();

export default function AppStackNavigator(){

    console.log('app stack nav')
    //const dispatch = useDispatch();
    //dispatch(clearTokens());

    const loginLoading = useSelector( selectLoginLoading )
    const sockAuth = useSelector( selectSocketAuth )
    const refresh = useSelector( selectRefreshToken )


    return (
        <Stack.Navigator headerMode="none">
            {
                (refresh != null) ? (
                    !loginLoading ? (
                        <Stack.Screen
                        name="App"
                        component={AppTabNavigator}
                        />
                    ) : (
                        <Stack.Screen
                        name="LoginLoading"
                        component={LoginLoadingScreen}
                        />
                    )

                ):(
                    <Stack.Screen
                    name="OauthPrompt"
                    component={OauthPromptScreen}
                    />
                    
                )
            }
        </Stack.Navigator>
    )
}