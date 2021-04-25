import React, {useState} from 'react';
import { Text, View, Button } from 'react-native';
import { authenticate, promptBio } from '../Redux/features/authSlice';
import { useDispatch } from 'react-redux';



export default function PinScreen(){

    const dispatch = useDispatch();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Pin Screen</Text>
            
            <Button
                title="Authenticate Using Biometrics"
                onPress={() => dispatch(promptBio())}
            />
        </View>   
    )
}
