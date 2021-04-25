import React, { Component, useEffect } from 'react';
import  {Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { useDispatch, useSelector} from 'react-redux';
import { connect, send  } from '@giantmachines/redux-websocket';
import { parseISO, startOfYesterday } from 'date-fns'
import SecureStoreVars from '../vars/SecureStoreVars';
import * as tda from '../api/AmeritradeApi';

import { selectSocketConnected,selectUserPrincipals, setUserPrincipalJson, setAccessToken, setRefreshToken } from '../Redux/features/tdaSlice'
import { G } from 'react-native-svg';


export default function LoginLoadingScreen() {
    const dispatch = useDispatch();
    //const AccessToken = useSelector( selectAccessToken )
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

        function jsonToQueryString(json) {
            return Object.keys(json).map(function(key) {
                    return encodeURIComponent(key) + '=' +
                        encodeURIComponent(json[key]);
                }).join('&');
        }

        var tokenTimeStampAsDateObj = parseISO(UserPrincipalData.streamerInfo.tokenTimestamp)
        var tokenTimeStampAsMs = tokenTimeStampAsDateObj.getTime();
        var credentials = {
            "userid": UserPrincipalData.accounts[0].accountId,
            "token": UserPrincipalData.streamerInfo.token,
            "company": UserPrincipalData.accounts[0].company,
            "segment": UserPrincipalData.accounts[0].segment,
            "cddomain": UserPrincipalData.accounts[0].accountCdDomainId,
            "usergroup": UserPrincipalData.streamerInfo.userGroup,
            "accesslevel": UserPrincipalData.streamerInfo.accessLevel,
            "authorized": "Y",
            "timestamp": tokenTimeStampAsMs,
            "appid": UserPrincipalData.streamerInfo.appId,
            "acl": UserPrincipalData.streamerInfo.acl
        }

        var authRequest = {    
            "requests": [
            {
                "service": "ADMIN",
                "command": "LOGIN",
                "requestid": 0,
                "account": UserPrincipalData.accounts[0].accountId,
                "source": UserPrincipalData.streamerInfo.appId,
                "parameters": {
                    "credential": jsonToQueryString(credentials),
                    "token": UserPrincipalData.streamerInfo.token,
                    "version": "1.0"
                }
            }
        ]}
        dispatch(send(authRequest));
    }



    
  




    return (
        <View>
            <Text>LOADING</Text>
        </View>
    )
}