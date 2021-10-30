import React, {useEffect, useState} from 'react';
import  {Text, View, Button } from 'react-native';
import { Switch, Modal } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';

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

            await SecureStore.deleteItemAsync(SecureStoreVars.Options.Login.RememberLogin);
            setRememberMe(false);
        }
        else{
            await SecureStore.setItemAsync(SecureStoreVars.Options.Login.RememberLogin, '1');
            setRememberMe(true)
        }
    }




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

            <Modal visible={visible} dismissable={false}>
                <Text>Please Confirm</Text>
                <Text>You are about to remove the User Saved on this device</Text>
                <Button title="Cancel"/><Button title="Continue"/>
            </Modal>
        </View>
    )
}