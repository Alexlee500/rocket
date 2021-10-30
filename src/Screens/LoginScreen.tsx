import React, {useEffect, useState} from 'react';
import  {Text, View, Button, Alert } from 'react-native';
import { Switch, Modal } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

import { useDispatch } from 'react-redux';
import Colors from '../configs/Colors'
import { getTokensFromOauth } from '../Redux/features/tdaSlice';
import SecureStoreVars from '../vars/SecureStoreVars';
import { promptBio } from '../Redux/features/authSlice';

export default function LoginScreen(){
    const dispatch = useDispatch();
    const [rememberMe, setRememberMe] = React.useState(false);
    const [visible, setVisibie] = React.useState(true);

    useEffect(() => {
        const getRememberLogin = async () => {
            const remember:boolean = (await SecureStore.getItemAsync(SecureStoreVars.Options.Login.RememberLogin)) ? true : false;
            setRememberMe(remember);

            if (remember){
                dispatch(promptBio());
            }
        }
        getRememberLogin()
    }, [])


    const onToggleRememberMe = async() => {
        if (rememberMe){
            const doLogout = await AsyncWarnLogout();
            if (doLogout) {
                await SecureStore.deleteItemAsync(SecureStoreVars.Options.Login.RememberLogin);
                setRememberMe(false);
            }  

        }
        else{
            const canBio = await LocalAuthentication.authenticateAsync({promptMessage: 'Confirm Biometric Login', cancelLabel: 'cancel', disableDeviceFallback: true});
            if (canBio){
                await SecureStore.setItemAsync(SecureStoreVars.Options.Login.RememberLogin, '1');
                setRememberMe(true)
            }
        }
    }

    const AsyncWarnLogout = async() => new Promise<boolean>((resolve) => {
        Alert.alert(
            "Please Confirm",
            "You are about to remove the User saved on this device",
            [
                {
                    text: "Cancel",
                    onPress: () => resolve(false)
                },{
                    text: "Continue",
                    onPress: () => resolve(true)
                }

            ]
        )
    })


    return (
        <View style={{flex:1,  backgroundColor: Colors.MainDark}}>
            <Button
                title="Log in With TD Ameritrade"
                onPress={async() => dispatch(getTokensFromOauth())}
            />            
            <Button
                title="Biometrics"
                onPress={async() => dispatch(promptBio())}
            />
            <Switch value={rememberMe} onValueChange={onToggleRememberMe}/>

            
        </View>
    )
}