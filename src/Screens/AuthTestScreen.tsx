import React from 'react';
import {Text, View, Button} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';


import { useDispatch, useSelector } from 'react-redux';
import { authenticate } from '../Redux/features/authSlice';
import { RootState } from '../Redux/rootReducer';


export default function AuthTestScreen(){

    const authenticated = useSelector( (state: RootState) => state.auth.authenticated )
    const dispatch = useDispatch();
    //getBiometricHardwareAsync()
    //BiometricIsEnrolled();
    //attemptBiometricAuthorize();
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Auth: Auth is {authenticated.toString()} </Text>
            <Button
                onPress={() => dispatch(authenticate())}
                title="Auth"
            />
        </View>   
    )
}


async function getBiometricHardwareAsync(){
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    console.log('Has Biometric Hardware ' + hasHardware);
    return hasHardware;
}

async function BiometricIsEnrolled(){
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    console.log('Biometric enrolled ' + isEnrolled);
    return isEnrolled;
}

async function attemptBiometricAuthorize(){
    const res = await LocalAuthentication.authenticateAsync({promptMessage: 'prompt', cancelLabel: 'cancel', disableDeviceFallback: true})
    console.log('Authentication ' + res.success);
    return res;
}