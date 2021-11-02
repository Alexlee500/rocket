import React, { useEffect } from 'react';
import  {Text, View, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as tda from '../api/AmeritradeApi';
//@ts-ignore
import { connect, send } from '@alexlee500/redux-websocket'
import { renameQuoteResponse, renameApiResponse } from '../api/AmeritradeHelper';
import { upsertQuotes } from '../Redux/features/quoteSlice';

import { AuthRequest,
    subscribeQuote,
    subscribeOptions,
    subscribeAccountActivity
   } from '../api/AmeritradeSockRequests'
import { 
    setUserPrincipalJson,
    setWatchlistData,
    setAccountData,
    selectAccessToken,
    selectSocketConnected,
    selectUserPrincipals,
    selectSocketAuth,
    selectAccountData,
    selectWatchlist
    } from '../Redux/features/tdaSlice'
export default function LoginLoadingScreen2({navigation}){
    const dispatch = useDispatch();

    const AccessToken:string = useSelector(selectAccessToken);
    const SockConnected:boolean = useSelector( selectSocketConnected )
    const PrincipalData:any = useSelector( selectUserPrincipals )
    const SockAuth:boolean = useSelector( selectSocketAuth )
    const AccountData:SecuritiesAccount | null = useSelector( selectAccountData )
    const WatchlistData:Watchlists | null = useSelector( selectWatchlist )

    useEffect(() => {
        const loadAccountData = async() => {
            const PrincipalData = await tda.getUserPrincipalData(AccessToken);
            const WatchlistData = await tda.getWatchlistsForAccount(AccessToken, PrincipalData.accounts[0].accountId);
            const AccountData = await tda.getAccount(AccessToken, PrincipalData.accounts[0].accountId);

            dispatch(setUserPrincipalJson(PrincipalData));
            dispatch(setWatchlistData(WatchlistData));
            dispatch(setAccountData(AccountData));
            dispatch(connect(`wss://${PrincipalData.streamerInfo.streamerSocketUrl}/ws`))
        }
        console.log('start login loading')
        loadAccountData();
    }, [])

    useEffect(() => {
        if (SockConnected){
            const authRequest = AuthRequest(PrincipalData);
            dispatch(send(authRequest));        

        }
    }, [SockConnected])

    useEffect(() => {
        const loadData = async() => {
            if(SockAuth && AccessToken){
                console.log(`sock auth`)

                const accActivity = subscribeAccountActivity(PrincipalData);
                dispatch(send(accActivity))
    
    
                var subscribeSymbolList:string[] = [];
                var subscribeOptionsList:string[] = [];
                if (WatchlistData != null){
                    for (let i in WatchlistData){
                        let wlist = WatchlistData[i];
                        for (let j in wlist.watchlistItems){
                            let inst = wlist.watchlistItems[j]
                            subscribeSymbolList.push(inst.instrument.symbol)
                        }
                    }
                }

                if (AccountData){
                    AccountData.securitiesAccount.positions.forEach((item) => {
                        subscribeSymbolList.push(item.instrument.underlyingSymbol)
                        if(item.instrument.assetType == 'EQUITY'){
                            subscribeSymbolList.push(item.instrument.symbol)
                        }
                        if(item.instrument.assetType == 'OPTION'){
                            subscribeOptionsList.push(item.instrument.symbol)
                        }
                        
                    })
                }

                console.log(subscribeSymbolList);

                var mergedSymList = subscribeSymbolList.concat(subscribeOptionsList);
                var initialQuoteData = await tda.getQuotes(AccessToken, mergedSymList);

                
                var renamedQuoteData = renameApiResponse(initialQuoteData)
                dispatch(upsertQuotes(renamedQuoteData));
                var subRequestQuotes = subscribeQuote(PrincipalData, subscribeSymbolList.toString())
                dispatch(send(subRequestQuotes))
                var subRequestOptions = subscribeOptions(PrincipalData, subscribeOptionsList.toString())
                dispatch(send(subRequestOptions))
                console.log('done time to nav' + subRequestOptions)
                navigation.navigate('App');
            }
        }

        loadData();  
    }, [SockAuth, AccessToken])

    return (
        <View>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>LOADING</Text>
        </View>
    )
}