import React, { useEffect } from 'react';
import  {Text, View, Button } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts'
import { connect, send  } from '@giantmachines/redux-websocket';

import { useDispatch, useSelector } from 'react-redux';
import { clearTokens, getUserPrincipalData, selectUserPrincipals } from '../Redux/features/tdaSlice';
import { deauthenticate } from '../Redux/features/authSlice';
import { RootState } from '../Redux/rootReducer';


import * as tda from '../api/AmeritradeApi';


export default function DeAuthTestScreen(){

    useEffect(() => {

    }, [])

    console.log('DeAuthTestScreen')
    const accessToken = useSelector( (state: RootState) => state.tda.accessToken )
    
    const dispatch = useDispatch();
    const fill = 'rgb(134, 65, 244)'
    const data = [50, 10, 40, 95, -4, -24, null, 85, undefined, 0, 35, 53, -53, 24, 50, -20, -80]


    function jsonToQueryString(json) {
        return Object.keys(json).map(function(key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    }

    const openSock = async () => {
        //const userPrincipalsResponse = await tda.getuserprincipals(accessToken);
        //console.log(userPrincipalsResponse.streamerInfo.streamerSocketUrl)
        dispatch(getUserPrincipalData());

        //let userPrincipals = useSelector( selectUserPrincipals )
        //console.log(userPrincipals);
        /*
        dispatch(connect(`wss://${userPrincipalsResponse.streamerInfo.streamerSocketUrl}/ws`))

        var tokenTimeStampAsDateObj = new Date(userPrincipalsResponse.streamerInfo.tokenTimestamp);
        var tokenTimeStampAsMs = tokenTimeStampAsDateObj.getTime();
        var credentials = {
            "userid": userPrincipalsResponse.accounts[0].accountId,
            "token": userPrincipalsResponse.streamerInfo.token,
            "company": userPrincipalsResponse.accounts[0].company,
            "segment": userPrincipalsResponse.accounts[0].segment,
            "cddomain": userPrincipalsResponse.accounts[0].accountCdDomainId,
            "usergroup": userPrincipalsResponse.streamerInfo.userGroup,
            "accesslevel": userPrincipalsResponse.streamerInfo.accessLevel,
            "authorized": "Y",
            "timestamp": tokenTimeStampAsMs,
            "appid": userPrincipalsResponse.streamerInfo.appId,
            "acl": userPrincipalsResponse.streamerInfo.acl
        }

        var authSocket = {    
            "requests": [
            {
                "service": "ADMIN",
                "command": "LOGIN",
                "requestid": 0,
                "account": userPrincipalsResponse.accounts[0].accountId,
                "source": userPrincipalsResponse.streamerInfo.appId,
                "parameters": {
                    "credential": jsonToQueryString(credentials),
                    "token": userPrincipalsResponse.streamerInfo.token,
                    "version": "1.0"
                }
            }
        ]}

        dispatch(send(authSocket))

        var requestSock = {
            "requests": [
                {
                    "service": "NEWS_HEADLINE", 
                    "requestid": "2", 
                    "command": "SUBS", 
                    "account": " your_account ", 
                    "source": "your_souce_id", 
                    "parameters": {
                        "keys": "GOOG", 
                        "fields": "0,1,2,3,4"
                    }
                }
            ]
        }
       // dispatch(send(requestSock));
        */
    }



    let logoutTest = async() => {
        console.log('out test');
        dispatch(clearTokens());
        dispatch(deauthenticate());
    }

    return(
        <>
        <BarChart style={{ height: 200 }} data={data} svg={{ fill }} contentInset={{ top: 30, bottom: 30 }}>
            <Grid />
        </BarChart>
        <Button   
            title="Log Out"
            onPress={() => logoutTest()}
        />
        </>
    )

}