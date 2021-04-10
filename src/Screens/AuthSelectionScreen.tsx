import React, {useState} from 'react';
import {Text, View, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as LocalAuthentication from 'expo-local-authentication';

import { connect, useDispatch, useSelector } from 'react-redux';
import { authenticate, promptBio } from '../Redux/features/authSlice';
import { RootState } from '../Redux/rootReducer';




//const Stack = createStackNavigator();

export default function AuthSelectionScreen(){
    
    const dispatch = useDispatch();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text></Text>

            <Button
                title="Authenticate Using Biometrics"
                onPress={() => dispatch(promptBio())}
            />  
        </View>      
    )
}


