import React, { useEffect } from 'react';
import  {Text, View, Button } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';

import { RootState } from '../Redux/rootReducer';
import { getRefreshFromStorage, clearTokens } from '../Redux/features/tdaSlice'

import DeAuthTestScreen from '../Screens/DeAuthTestScreen';
import LoginLoadingScreen from '../Screens/LoginLoadingScreen';
import OauthPromptScreen from '../Screens/OauthPromptScreen';


const Stack = createStackNavigator();

export default function AppStackNavigator(){

    console.log('app stack nav')

    const dispatch = useDispatch();
    //dispatch(clearTokens());


    const access = useSelector( (state: RootState) => state.tda.accessToken )
    const refresh = useSelector( (state: RootState) => state.tda.refreshToken )
    return (
        <Stack.Navigator headerMode="none">
            {
                (refresh != null) ? (
                    access ? (
                        <Stack.Screen
                        name="App"
                        component={DeAuthTestScreen}
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