import React, {useState} from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as LocalAuthentication from 'expo-local-authentication';

import { useDispatch, useSelector } from 'react-redux';
import { authenticate } from '../Redux/features/authSlice';
import { RootState } from '../Redux/rootReducer';


export interface IProps {
    biometricsEnabled?: boolean
}

export default function PinScreen(props:IProps){
    const dispatch = useDispatch();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Pin Screen</Text>



            <Button
                onPress={() => dispatch(authenticate())}
                title="Auth"
            />  

            
        </View>   
    )
}

async function promptBiometricAuthorize(){
    
    const res = await LocalAuthentication.authenticateAsync({promptMessage: 'Unlock', cancelLabel: 'cancel', disableDeviceFallback: true})
    return res;
}