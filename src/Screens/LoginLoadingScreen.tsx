import React, { Component, useEffect } from 'react';
import  {Text, View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { useDispatch, useSelector} from 'react-redux';
import { connect, send  } from '@giantmachines/redux-websocket';
import { parseISO } from 'date-fns'
import SecureStoreVars from '../vars/SecureStoreVars';
import * as tda from '../api/AmeritradeApi';
import { AuthRequest,
         subscribeQuote,
         subscribeAccountActivity 
        } from '../api/AmeritradeSockRequests'

import { selectSocketConnected, 
        selectUserPrincipals, 
        setUserPrincipalJson, 
        selectSocketAuth, 
        selectLoginLoading,
        setLoginLoading 
        } from '../Redux/features/tdaSlice'


export default function LoginLoadingScreen() {
    const dispatch = useDispatch();
    const LoginLoading: boolean = useSelector( selectLoginLoading )
    const SockAuth:boolean = useSelector( selectSocketAuth )
    const PrincipalData:any = useSelector( selectUserPrincipals )
    const SockConnected:boolean = useSelector( selectSocketConnected )
    
    var refToken:string, AcsToken:AccessToken = null

    useEffect(() => {
        const loadData = async () => {
            refToken = await SecureStore.getItemAsync(SecureStoreVars.RefreshToken);
            AcsToken = await tda.getAccessFromRefreshToken(await refToken);
            let pd = await tda.getuserprincipals(await AcsToken.access_token);
            dispatch(setUserPrincipalJson(pd));
            dispatch(connect(`wss://${pd.streamerInfo.streamerSocketUrl}/ws`))
        }
        loadData()
    }, [])


    useEffect(() => {
        if (SockConnected){
            var authRequest = AuthRequest(PrincipalData);
            dispatch(send(authRequest));        
        }
    }, [SockConnected])


    useEffect(() => {
        if(SockAuth){
            var accActivity = subscribeAccountActivity(PrincipalData);
            dispatch(send(accActivity))
            dispatch(setLoginLoading(false))
        }
    }, [SockAuth])
    

    
    return (
        <View>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>LOADING</Text>
        </View>
    )
}