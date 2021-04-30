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
        setLoginLoading,
        setWatchlistData,
        selectWatchlist
        } from '../Redux/features/tdaSlice'


export default function LoginLoadingScreen() {
    const dispatch = useDispatch();
    const LoginLoading: boolean = useSelector( selectLoginLoading )
    const SockAuth:boolean = useSelector( selectSocketAuth )
    const PrincipalData:any = useSelector( selectUserPrincipals )
    const SockConnected:boolean = useSelector( selectSocketConnected )
    const watchlistData:Watchlists = useSelector( selectWatchlist )

    var refToken:string, AcsToken:AccessToken = null
    useEffect(() => {
        const loadData = async () => {
            refToken = await SecureStore.getItemAsync(SecureStoreVars.RefreshToken);
            AcsToken = await tda.getAccessFromRefreshToken(await refToken);
            let pd = await tda.getuserprincipals(await AcsToken.access_token);
            dispatch(setUserPrincipalJson(pd));

            var wl = await tda.getWatchlistsForAccount(AcsToken.access_token, pd.accounts[0].accountId)
            dispatch(setWatchlistData(wl))
            
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


            let subscribeSymbolList = [];
            for (let i in watchlistData){
                let wlist = watchlistData[i];
                for (let j in wlist.watchlistItems){
                    let inst = wlist.watchlistItems[j]
                    console.log(inst.instrument.symbol)
                    subscribeSymbolList.push(inst.instrument.symbol)
                }
            }


            var subRequestQuotes = subscribeQuote(PrincipalData, subscribeSymbolList.toString())
            dispatch(send(subRequestQuotes))
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