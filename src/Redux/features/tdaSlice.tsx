import { createAction, createReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { connect, send  } from '@giantmachines/redux-websocket';
import { bindActionCreators, Dispatch } from 'redux';

import { RootState } from '../rootReducer';
import * as SecureStore from 'expo-secure-store';
import * as tda from '../../api/AmeritradeApi';
import SecureStoreVars from '../../vars/SecureStoreVars';

//import { connect } from '../middleware/WebsockMiddleware'
//import store from '../store';

interface tdaSlice{
    //socketConnected: boolean
    refreshToken: string
    accessToken: string
    userPrincipals: string
}



const initialState = { 
    refreshToken:'', 
    accessToken:'',
    userPrincipals:''
}

export const tdaSlice = createSlice({
    name: 'tda',
    initialState: initialState,
    reducers: {
        
        setRefreshToken: ( state, action: PayloadAction<string>) => {
            state.refreshToken = action.payload;
        },
        setAccessToken: ( state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setUserPrincipalJson:(state, action: PayloadAction<string>) => {
            state.userPrincipals = action.payload;
        }
    },
    extraReducers:(builder) => {
        builder
        .addCase('REDUX_WEBSOCKET::OPEN', (state, action) => {
            console.log('sock open');
            
            console.log(action);
        })
        .addCase('REDUX_WEBSOCKET::CLOSED', (state, action) => {
            console.log('sock closed');
            
            console.log(action);
        })       
        .addCase('REDUX_WEBSOCKET::SEND', (state, action) => {
            console.log('sock send');
            console.log(`Send Payload ${JSON.stringify(action.payload)}`)
        })
        .addCase('REDUX_WEBSOCKET::MESSAGE', (state, action) => {
            console.log('sock message');
            console.log(`Message Payload ${JSON.stringify(action.payload)}`)

            console.log(action);
        })
    }

})


export const clearTokens = () => {
    return async (dispatch:Dispatch) => {
        console.log('logging out');
        try{
            dispatch(setRefreshToken(null));
            dispatch(setAccessToken(null));
            await SecureStore.deleteItemAsync(SecureStoreVars.RefreshToken);
        }
        catch(error){
            console.log(error);
        }
    }
}

export const getTokensFromOauth = () => {
    return async (dispatch:Dispatch) => {
        console.log('get Refresh Token from storage');
        try{
            let oauthResponse = await tda.oauthApiLogin();
            SecureStore.setItemAsync(SecureStoreVars.RefreshToken, oauthResponse.refresh_token);
            dispatch(setRefreshToken(oauthResponse.refresh_token));
            //dispatch(setAccessToken(oauthResponse.access_token));
            console.log('getTokens Done');
        }
        catch(error){
            console.log(error);
        }
    }
}

export const getRefreshFromStorage = () => {
    return async(dispatch:Dispatch) => {
        console.log('getRefreshFromStorage')
        let refToken = await SecureStore.getItemAsync(SecureStoreVars.RefreshToken);

        dispatch(setRefreshToken(refToken));
    }
}

export const getAccessFromRefresh = () => {
    return async(dispatch:Dispatch) => {
        console.log('getAccessFromRefresh')

        let refToken = await SecureStore.getItemAsync(SecureStoreVars.RefreshToken);
        var res = await tda.getAccessFromRefreshToken(refToken);
        console.log(`Access Token${res.access_token}`)

        //dispatch(setRefreshToken(refToken));

        let principalData = await tda.getuserprincipals(res.access_token)
        dispatch(setUserPrincipalJson(principalData))
        dispatch(setAccessToken(res.access_token));

    }
}

export const getUserPrincipalData = () => {
    return async(dispatch:Dispatch, getState) => {
        console.log('getUserPrincipalData')
        let resJson = await tda.getuserprincipals(getState().tda.accessToken)
        console.log(JSON.stringify(resJson))

        dispatch(setUserPrincipalJson(await resJson))
    }   
}


function jsonToQueryString(json) {
    return Object.keys(json).map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

export const buildWebSockConnection = () => {
    return async(dispatch:Dispatch, getState) => {
        console.log('buildWebSockConnection')
        let refToken = await SecureStore.getItemAsync(SecureStoreVars.RefreshToken);
        let res = await tda.getAccessFromRefreshToken(refToken);
        let accToken = res.access_token;
        let principalData = await tda.getuserprincipals(accToken)

        dispatch(setUserPrincipalJson(principalData))
        //await getUserPrincipalData()
        //console.log(JSON.stringify(principalData))
        //dispatch(connect(`wss://${principalData.streamerInfo.streamerSocketUrl}.com/ws`))

        /*
        var tokenTimeStampAsDateObj = new Date(principalData.streamerInfo.tokenTimestamp);
        var tokenTimeStampAsMs = tokenTimeStampAsDateObj.getTime();
        var credentials = {
            "userid": principalData.accounts[0].accountId,
            "token": principalData.streamerInfo.token,
            "company": principalData.accounts[0].company,
            "segment": principalData.accounts[0].segment,
            "cddomain": principalData.accounts[0].accountCdDomainId,
            "usergroup": principalData.streamerInfo.userGroup,
            "accesslevel": principalData.streamerInfo.accessLevel,
            "authorized": "Y",
            "timestamp": tokenTimeStampAsMs,
            "appid": principalData.streamerInfo.appId,
            "acl": principalData.streamerInfo.acl
        }

        var authSocket = {    
            "requests": [
            {
                "service": "ADMIN",
                "command": "LOGIN",
                "requestid": 0,
                "account": principalData.accounts[0].accountId,
                "source": principalData.streamerInfo.appId,
                "parameters": {
                    "credential": jsonToQueryString(credentials),
                    "token": principalData.streamerInfo.token,
                    "version": "1.0"
                }
            }
        ]}

        dispatch(send(JSON.stringify(authSocket)))

        dispatch(setAccessToken(res.access_token));
        */
    }
}

export const selectUserPrincipals = state => state.tda.userPrincipals;
export const { setRefreshToken, setAccessToken, setUserPrincipalJson } = tdaSlice.actions
export const selectAuth = ( state: RootState ) => state.auth
export default tdaSlice.reducer;
