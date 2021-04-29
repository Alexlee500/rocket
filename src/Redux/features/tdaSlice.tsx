import { createAction, createAsyncThunk, createReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { connect, send  } from '@giantmachines/redux-websocket';
import { bindActionCreators, Dispatch } from 'redux';

import { RootState } from '../rootReducer';
import * as SecureStore from 'expo-secure-store';
import * as tda from '../../api/AmeritradeApi';
import SecureStoreVars from '../../vars/SecureStoreVars';

//import { connect } from '../middleware/WebsockMiddleware'
//import store from '../store';

interface tdaSlice{
    loginLoading: boolean
    socketConnected: boolean
    socketAuthenticated: boolean
    refreshToken: string
    accessToken: string
    userPrincipals: UserPrincipals
    watchlistData: Watchlist
}



const initialState = { 
    loginLoading: true,
    socketConnected: false,
    socketAuthenticated: false,
    refreshToken:'', 
    accessToken:'',
    userPrincipals: null,
    watchlistData: null
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
            state.refreshToken = action.payload;
        },
        setAccessToken: ( state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setUserPrincipalJson:(state, action: PayloadAction<UserPrincipals>) => {
            state.userPrincipals = action.payload;
        },
        setLoginLoading:(state, action: PayloadAction<boolean>) => {
            state.loginLoading = action.payload;
        },
        setWatchlistData:(state, action: PayloadAction<Watchlist>) => {
            state.watchlistData = action.payload
        }

    },
    extraReducers:(builder) => {
        builder
        .addCase('REDUX_WEBSOCKET::OPEN', (state, action) => {
            console.log('sock open');
            state.socketConnected = true;
            console.log(action);
        })
        .addCase('REDUX_WEBSOCKET::CLOSED', (state, action) => {
            console.log('sock closed');
            //state.loginLoading = initialState.loginLoading;
            state.socketAuthenticated = initialState.socketAuthenticated;
            state.socketConnected = initialState.socketConnected;

            console.log(action);
        })       
        .addCase('REDUX_WEBSOCKET::SEND', (state, action) => {
            console.log('sock send');
            console.log(`Send Payload ${JSON.stringify(action.payload)}`)


        })
        .addCase('REDUX_WEBSOCKET::MESSAGE', (state, action) => {
            console.log('sock message');
            console.log(`Message Payload ${JSON.stringify(action.payload.event.data)}`)
            let MessageData = JSON.parse(action.payload.event.data);

            try{
                let response = MessageData?.response[0];
                if (response?.service == "ADMIN" && response?.command == "LOGIN" && response?.content.code == 0){
                    state.socketAuthenticated = true;
                }
            }catch(error){}
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

        dispatch(setAccessToken(res.access_token));

    }
}

export const getUserPrincipalData = () => {
    return async(dispatch:Dispatch, getState) => {
        console.log('getUserPrincipalData')
        let resJson = await tda.getuserprincipals(getState().tda.accessToken)
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
        let resJson = await tda.getuserprincipals(accessToken)
        return resJson        
    }
)


// Selectors
export const selectLoginLoading = state => state.tda.loginLoading;
export const selectRefreshToken = state => state.tda.refreshToken;
export const selectAccessToken = state => state.tda.accessToken;
export const selectUserPrincipals = state => state.tda.userPrincipals;
export const selectSocketConnected = state => state.tda.socketConnected;
export const selectSocketAuth = state => state.tda.socketAuthenticated;
export const selectWatchlist = state => state.tda.watchlistData;
export const {  setRefreshToken, 
                setAccessToken, 
                setUserPrincipalJson, 
                setLoginLoading, 
                resetConnections, 
                setWatchlistData 
            } = tdaSlice.actions

export default tdaSlice.reducer;
