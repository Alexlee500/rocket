import { createAction, Action, createAsyncThunk, createReducer, createSlice, PayloadAction, AnyAction, createEntityAdapter } from '@reduxjs/toolkit';

import {
    REDUX_WEBSOCKET_BROKEN,
    REDUX_WEBSOCKET_CLOSED,
    REDUX_WEBSOCKET_CONNECT,
    REDUX_WEBSOCKET_MESSAGE,
    REDUX_WEBSOCKET_OPEN,
    REDUX_WEBSOCKET_SEND,
    WebsocketMessage,
    WebsocketSend
  } from './actionTypes';
  
  import { bindActionCreators, Dispatch } from 'redux';

import { RootState } from '../store';
import * as SecureStore from 'expo-secure-store';
import * as tda from '../../api/AmeritradeApi';
import SecureStoreVars from '../../vars/SecureStoreVars';

interface tdaSlice{
    loginLoading: boolean
    socketConnected: boolean
    socketAuthenticated: boolean
    refreshToken: string
    accessToken: string
    userPrincipals: UserPrincipals | null
    watchlistData: Watchlists | null
    accountData: SecuritiesAccount | null
}


const initialState:tdaSlice = { 
    loginLoading: true,
    socketConnected: false,
    socketAuthenticated: false,
    refreshToken:'', 
    accessToken:'',
    userPrincipals: null,
    watchlistData: null, 
    accountData: null
}



export const tdaSlice = createSlice({
    name: 'tda',
    initialState: initialState,
    reducers: {
        resetConnections: ( state ) => {
            state.socketConnected = initialState.socketConnected;
            state.socketAuthenticated = initialState.socketAuthenticated;
            state.loginLoading = initialState.loginLoading;
            state.accessToken = initialState.accessToken;
            state.refreshToken = initialState.refreshToken;
            state.userPrincipals = initialState.userPrincipals;
        },
        setRefreshToken: ( state, action: PayloadAction<string>) => {
            if (action.payload){
                state.refreshToken = action.payload;
            }
        },
        setAccessToken: ( state, action: PayloadAction<string>) => {
            if (action.payload){
                state.accessToken = action.payload;
            }
        },
        setUserPrincipalJson:(state, action: PayloadAction<UserPrincipals>) => {
            if (action.payload){
                state.userPrincipals = action.payload;
            }
        },
        setLoginLoading:(state, action: PayloadAction<boolean>) => {
            state.loginLoading = action.payload;
        },
        setWatchlistData:(state, action: PayloadAction<Watchlists>) => {
            if (action.payload){
                state.watchlistData = action.payload
            }
        },
        setAccountData:(state, action: PayloadAction<SecuritiesAccount>) => {
            if (action.payload){
                state.accountData = action.payload
            }
        },    
    },
    extraReducers:(builder) => {
        builder
        .addCase(REDUX_WEBSOCKET_OPEN, (state, action) => {
            console.log('sock open');
            state.socketConnected = true;
        })
        .addCase(REDUX_WEBSOCKET_CLOSED, (state, action) => {
            console.log('sock closed');
            //state.loginLoading = initialState.loginLoading;
            state.socketAuthenticated = initialState.socketAuthenticated;
            state.socketConnected = initialState.socketConnected;

        })       
        .addCase(REDUX_WEBSOCKET_SEND, (state, action:WebsocketSend) => {
            console.log('sock send');
            //console.log(`Send ${JSON.stringify(action)}`)

            //console.log(`Send Payload ${JSON.stringify(action.payload)}`)


        })
        .addCase(REDUX_WEBSOCKET_MESSAGE, (state, action:any) => {
            //console.log('sock message');
            //console.log(JSON.stringify(action.payload))
            //console.log(`Message Payload ${JSON.stringify(action.payload.event.data)}`)
            let MessageData = JSON.parse(action.payload.event.data);

            try{
                let response = MessageData?.response[0];
                if (response?.service == "ADMIN" && response?.command == "LOGIN" && response?.content.code == 0){
                    state.socketAuthenticated = true;
                }
            }catch(error){}
            try{
                let response = MessageData?.response[0];
                if (response?.service == "ADMIN" && response?.command == "LOGOUT" && response?.content.code == 0){
                    console.log('LogOut request success')
                    console.log(JSON.stringify(response))
                    state.socketAuthenticated = false;
                    state.socketConnected = false;
                }
            }catch(error){}
            
            //console.log(action);
        })
    }

})


export const clearTokens = () => {
    return async (dispatch:Dispatch) => {
        console.log('logging out');
        try{
            dispatch(setRefreshToken(''));
            dispatch(setAccessToken(''));
            await SecureStore.deleteItemAsync(SecureStoreVars.Tokens.RefreshToken);
        }
        catch(error){
            console.log(error);
        }
    }
}

export const getTokensFromOauth = () => {
    return async (dispatch:Dispatch) => {
        try{
            const oauthResponse = await tda.oauthApiLogin();
            if (oauthResponse){
                SecureStore.setItemAsync(SecureStoreVars.Tokens.RefreshToken, oauthResponse.refresh_token);
                SecureStore.setItemAsync(SecureStoreVars.Tokens.RefreshTokenExpiry, oauthResponse.refresh_token_expires_in.toString());

                dispatch(setRefreshToken(oauthResponse.refresh_token));
                console.log('getTokens Done');
            }
        }
        catch(error){
            console.log(error);
        }
    }
}

export const getRefreshFromStorage = () => {
    return async(dispatch:Dispatch) => {
        console.log('getRefreshFromStorage')
        const refToken = await SecureStore.getItemAsync(SecureStoreVars.Tokens.RefreshToken);
        if (refToken){
            dispatch(setRefreshToken(refToken));
        }
    }
}

export const getAccessFromRefresh = () => {
    return async(dispatch:Dispatch) => {
        console.log('getAccessFromRefresh')

        const refToken= await SecureStore.getItemAsync(SecureStoreVars.Tokens.RefreshToken);
        if (refToken){
            var res = await tda.getAccessFromRefreshToken(refToken);

            dispatch(setAccessToken(res.access_token));
        }

    }
}

export const getUserPrincipalData = () => {
    return async(dispatch:Dispatch, getState:any) => {
        console.log('getUserPrincipalData')
        let resJson = await tda.getUserPrincipalData(getState().tda.accessToken)
        //console.log(JSON.stringify(resJson))
        dispatch(setUserPrincipalJson(await resJson))
    }   
}

export const getAccessToken = createAsyncThunk(
    'tda/getAccessToken',
    async(refreshToken:string) => {
        console.log('getAccessTokenThunk')
        var res = await tda.getAccessFromRefreshToken(refreshToken);
        return res.access_token
    }
)
export const getPrincipalData = createAsyncThunk(
    'tda/getPrincipalData',
    async(accessToken: string) => {
        let resJson = await tda.getUserPrincipalData(accessToken)
        return resJson        
    }
)


// Selectors
export const selectLoginLoading = (state:RootState) => state.tda.loginLoading;
export const selectRefreshToken = (state:RootState) => state.tda.refreshToken;
export const selectAccessToken = (state:RootState) => state.tda.accessToken;
export const selectUserPrincipals = (state:RootState) => state.tda.userPrincipals;
export const selectSocketConnected = (state:RootState) => state.tda.socketConnected;
export const selectSocketAuth = (state:RootState) => state.tda.socketAuthenticated;
export const selectWatchlist = (state:RootState) => state.tda.watchlistData;
export const selectAccountData = (state:RootState) => state.tda.accountData;

export const {  setRefreshToken, 
                setAccessToken, 
                setUserPrincipalJson, 
                setLoginLoading, 
                resetConnections, 
                setWatchlistData,
                setAccountData
            } = tdaSlice.actions

export default tdaSlice.reducer;
