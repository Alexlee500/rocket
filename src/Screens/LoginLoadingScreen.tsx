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
         subscribeOptions,
         subscribeAccountActivity
        } from '../api/AmeritradeSockRequests'

import { selectSocketConnected, 
        selectUserPrincipals, 
        setUserPrincipalJson, 
        selectSocketAuth, 
        selectLoginLoading,
        setLoginLoading,
        setWatchlistData,
        selectWatchlist,
        setAccountData,
        selectAccountData
        } from '../Redux/features/tdaSlice'


export default function LoginLoadingScreen() {
    const dispatch = useDispatch();
    const LoginLoading: boolean = useSelector( selectLoginLoading )
    const SockAuth:boolean = useSelector( selectSocketAuth )
    const PrincipalData:any = useSelector( selectUserPrincipals )
    const SockConnected:boolean = useSelector( selectSocketConnected )
    const watchlistData:Watchlists = useSelector( selectWatchlist )
    const accountData:SecuritiesAccount = useSelector( selectAccountData )

    const [accessToken, setAccessToken] = React.useState(null);
    const [refreshToken, setRefreshToken] = React.useState(null);
    //var refToken:string = null;
    //var AcsToken:AccessToken = null


    useEffect(() => {
        const loadData = async () => {
            let refToken = await SecureStore.getItemAsync(SecureStoreVars.RefreshToken);
            setRefreshToken(refToken);
            //AcsToken = await tda.getAccessFromRefreshToken(await refToken);
            /*
            await setAccessToken(await tda.getAccessFromRefreshToken(await refToken))
            console.log(accessToken)
            let pd = await tda.getuserprincipals(accessToken.access_token);
            dispatch(setUserPrincipalJson(pd));

            var wl = await tda.getWatchlistsForAccount(accessToken.access_token, pd.accounts[0].accountId)
            dispatch(setWatchlistData(wl))
            var accData = await tda.getAccount(accessToken.access_token, pd.accounts[0].accountId)
            dispatch(setAccountData(accData))
            dispatch(connect(`wss://${pd.streamerInfo.streamerSocketUrl}/ws`))
            */
        }
        loadData()
    }, [])

    useEffect(() => {
        const hasRefreshToken = async() => {
            if (refreshToken) { 
                let aT = await tda.getAccessFromRefreshToken(refreshToken)
                setAccessToken(aT)
            }
        }
        hasRefreshToken()
    }, [refreshToken])


    useEffect(() => {
        const hasAccessToken = async() => {
            if (accessToken){
                let pd = await tda.getuserprincipals(accessToken.access_token);
                dispatch(setUserPrincipalJson(pd));
                var wl = await tda.getWatchlistsForAccount(accessToken.access_token, pd.accounts[0].accountId)
                dispatch(setWatchlistData(wl))
                var accData = await tda.getAccount(accessToken.access_token, pd.accounts[0].accountId)
                dispatch(setAccountData(accData))
                dispatch(connect(`wss://${pd.streamerInfo.streamerSocketUrl}/ws`))
            }
        }
        hasAccessToken()
    },[accessToken])


    useEffect(() => {
        if (SockConnected){
            var authRequest = AuthRequest(PrincipalData);
            dispatch(send(authRequest));        
        }
    }, [SockConnected])


    useEffect(() => {
        const loadData = async() => {
            if(SockAuth && accessToken){
                var accActivity = subscribeAccountActivity(PrincipalData);
                dispatch(send(accActivity))
    
    
                let subscribeSymbolList = [];
                let subscribeOptionsList = [];
                for (let i in watchlistData){
                    let wlist = watchlistData[i];
                    for (let j in wlist.watchlistItems){
                        let inst = wlist.watchlistItems[j]
                        subscribeSymbolList.push(inst.instrument.symbol)
                    }
                }
    
                accountData.securitiesAccount.positions.forEach((item) => {
                    subscribeSymbolList.push(item.instrument.underlyingSymbol)
                    if(item.instrument.assetType == 'OPTION'){
                        subscribeOptionsList.push(item.instrument.symbol)
                    }
                })
                let initialQuoteData = await tda.getQuotes(accessToken.access_token, subscribeSymbolList);
                
                var subRequestQuotes = subscribeQuote(PrincipalData, subscribeSymbolList.toString())
                dispatch(send(subRequestQuotes))
                var subRequestOptions = subscribeOptions(PrincipalData, subscribeOptionsList.toString())
                dispatch(send(subRequestOptions))
                dispatch(setLoginLoading(false))
            }
        }

        loadData();  
    }, [SockAuth, accessToken])
    

    
    return (
        <View>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>LOADING</Text>
        </View>
    )
}