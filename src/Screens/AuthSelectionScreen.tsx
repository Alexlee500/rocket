import React, {useEffect, useState} from 'react';
import {Text, View, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as LocalAuthentication from 'expo-local-authentication';

import { connect, useDispatch, useSelector } from 'react-redux';
import { authenticate, promptBio } from '../Redux/features/authSlice';
import { clearTokens, resetConnections } from '../Redux/features/tdaSlice';
import { LogoutRequest } from '../api/AmeritradeSockRequests';

import { RootState } from '../Redux/rootReducer';




//const Stack = createStackNavigator();

export default function AuthSelectionScreen({navigation: {navigate}}){
    useEffect(()=> {
    }, []) 


    const dispatch = useDispatch();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text></Text>

            <Button
                title="DEBUG:CLEAR TOKENS"
                onPress={() => dispatch(clearTokens())}
            />

            <Button
                title="Authenticate Using Biometrics"
                onPress={() => dispatch(promptBio())}
            />

            <Button
                title="Authenticate Using Pin"
                onPress={() =>navigate('Pin')}
            />  
            
        </View>      
    )
}


