import React, {useEffect, useState} from 'react';
import  { View, Button, Alert, StyleSheet, Text } from 'react-native';
import { Switch } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as tda from '../api/AmeritradeApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useDispatch } from 'react-redux';
import Colors from '../configs/Colors'
import { getTokensFromOauth } from '../Redux/features/tdaSlice';
import SecureStoreVars from '../vars/SecureStoreVars';
import { setAccessToken } from '../Redux/features/tdaSlice'

import  {default as NewButton}  from '../Components/Button'

export default function LoginScreen(){
    const dispatch = useDispatch();
    const [rememberMe, setRememberMe] = useState(false);
    const [RefreshToken, setRefreshToken] = useState('');
    useEffect(() => {
        getRememberLogin()
    }, [])

    const getRememberLogin = async () => {
        var remember:boolean = (await SecureStore.getItemAsync(SecureStoreVars.Options.Login.RememberLogin)) ? true : false;
        setRememberMe(remember);

        const Refresh:string|null = (await SecureStore.getItemAsync(SecureStoreVars.Tokens.RefreshToken));
        if (Refresh == null || ''){
            setRememberMe(false);
        }
        
        else{
            setRefreshToken(Refresh);
            if (remember){
                //Bio(Refresh);
            }
        }

    }

    const Bio = async(refresh: string)=> {
        const auth = (await LocalAuthentication.authenticateAsync({
            promptMessage: 'Unlock', 
            cancelLabel: 'Cancel',
            disableDeviceFallback: true
        }));
        if (auth.success){
            const accessToken:AccessToken = (await tda.getAccessFromRefreshToken(refresh));
            if (accessToken != null){
                dispatch(setAccessToken(accessToken.access_token));
            }
        }
    }


    const onToggleRememberMe = async() => {
        if (rememberMe){
            const doLogout = await AsyncWarnLogout();
            if (doLogout) {
                await SecureStore.deleteItemAsync(SecureStoreVars.Options.Login.RememberLogin);
                await SecureStore.deleteItemAsync(SecureStoreVars.Tokens.RefreshToken);
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
        <View style={styles.background}>
            <View style={{ alignItems:'center', marginVertical: 100, backgroundColor: "red"}}>
                <Text style={{fontSize:40, fontWeight:'bold', color:Colors.Green}}>Rocketship</Text>
                <Icon
                    name="rocket-launch-outline" 
                    size={200}
                    color={Colors.Green}
                />
            </View>
            <View style={{flex:1, backgroundColor: "blue"}}>
                <Button
                    title="Log in With TD Ameritrade"
                    onPress={async() => dispatch(getTokensFromOauth())}
                />            
                <Button
                    title="Biometrics"
                    onPress={async() => Bio(RefreshToken)}
                />
                <NewButton
                    label= 'test'
                    onPress={() => console.log('ree')}
                />
            </View>

            <View style={{flex:1, flexDirection: 'row', alignSelf: 'flex-end'}}>
                <Text style={{color: Colors.TextLight, alignSelf:'flex-start', textAlignVertical:'center' }}>Remember Me</Text>
                <Switch style={{ alignSelf:'flex-start'}} value={rememberMe} onValueChange={onToggleRememberMe}/>
            </View>


            
        </View>
    )
}


const styles = StyleSheet.create({
    background:{
        flex:1, 
        backgroundColor: Colors.MainDark
    }

})