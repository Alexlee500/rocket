import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/rootReducer';

import  AuthTestScreen  from '../Screens/AuthTestScreen'
import  DeAuthTestScreen from '../Screens/DeAuthTestScreen'

import OauthPromptScreen from '../Screens/OauthPromptScreen';
import AuthStackNavigator from './AuthStackNavigator';
import AppStackNavigator from './AppStackNavigator';
import LoginLoadingScreen from '../Screens/LoginLoadingScreen';

const Stack = createStackNavigator();

export default function RootNavigationContainer(){
    const authenticated = useSelector( (state: RootState) => state.auth.authenticated )
    const access = useSelector( (state: RootState) => state.tda.accessToken )
    const refresh = useSelector( (state: RootState) => state.tda.refreshToken )
    

    return (
        <NavigationContainer>
            <Stack.Navigator headerMode="none">
                { authenticated ? (
                    <Stack.Screen
                    name="App"
                    component={AppStackNavigator}
                    />
                    /*
                    access ? (
                        <Stack.Screen
                        name="AppStack"
                        component={AppStackNavigator}
                        />
                    ) : (
                        refresh ? (
                            <Stack.Screen
                            name="Loading"
                            component={LoginLoadingScreen}
                            />
                        ) : (
                            <Stack.Screen
                            name="OauthPrompt"
                            component={OauthPromptScreen}
                            />
                        )
                    )*/
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