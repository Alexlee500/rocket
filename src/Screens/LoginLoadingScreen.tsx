import React, { Component, useEffect } from 'react';
import  {Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { useDispatch, useSelector} from 'react-redux';
import { connect, send  } from '@giantmachines/redux-websocket';
import { parseISO } from 'date-fns'
import SecureStoreVars from '../vars/SecureStoreVars';
import * as tda from '../api/AmeritradeApi';
import { AuthRequest } from '../api/AmeritradeSockRequests'
import { selectSocketConnected,selectUserPrincipals, setUserPrincipalJson, setAccessToken, setRefreshToken } from '../Redux/features/tdaSlice'


export default function LoginLoadingScreen() {
    const dispatch = useDispatch();
    var PrincipalData:any = useSelector( selectUserPrincipals )
    const SockConnected = useSelector( selectSocketConnected )
    var PrincipalData: any, refToken: string, AcsToken = null

    useEffect(() => {
        const loadData = async () => {
            
            refToken = await SecureStore.getItemAsync(SecureStoreVars.RefreshToken);
            AcsToken = await tda.getAccessFromRefreshToken(await refToken);
            PrincipalData = await tda.getuserprincipals(await AcsToken.access_token);
            dispatch(setUserPrincipalJson(PrincipalData));
            dispatch(connect(`wss://${PrincipalData.streamerInfo.streamerSocketUrl}/ws`))
        }
        loadData()
    }, [])


    useEffect(() => {
        console.log(SockConnected);
        if (SockConnected){
            authSocket(PrincipalData);
        }
    }, [SockConnected])
    
    let authSocket = async (UserPrincipalData) => {
        var authRequest = AuthRequest(UserPrincipalData);
        dispatch(send(authRequest));
    }

    return (
        <View>
            <Text>LOADING</Text>
        </View>
    )
}