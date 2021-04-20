import { createAction, createReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';
import { bindActionCreators, Dispatch } from 'redux';
import * as SecureStore from 'expo-secure-store';
import { WEBSOCKET_CONNECT, WEBSOCKET_MESSAGE, WEBSOCKET_OPEN } from '@giantmachines/redux-websocket'
import * as tda from '../../api/AmeritradeApi';
import SecureStoreVars from '../../vars/SecureStoreVars';
import store from '../store';

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
            console.log('setRefresh1')
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
        .addCase('REDUX_WEBSOCKET::MESSAGE', (state, action) => {
            console.log('sock message');

            console.log(action);
        })
    }

})


export let clearTokens = () => {
    return async (dispatch:Dispatch) => {
        console.log('logging out');
        try{
            dispatch(setRefreshToken(null));
            dispatch(setAccessToken(null));
            await SecureStore.deleteItemAsync(SecureStoreVars.AccessToken);
            await SecureStore.deleteItemAsync(SecureStoreVars.RefreshToken);
        }
        catch(error){
            console.log(error);
        }
    }
}

export let getTokensFromOauth = () => {
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

export let getRefreshFromStorage = () => {
    console.log('getRefreshFromStorage')
    return async(dispatch:Dispatch) => {
        let refToken = await SecureStore.getItemAsync(SecureStoreVars.RefreshToken);
        dispatch(setRefreshToken(refToken));
    }
}

export let getAccessFromStoredRefresh = () => {
    console.log('getAccessFromStoredRefresh')
    return async(dispatch:Dispatch) => {
        let refToken = await SecureStore.getItemAsync(SecureStoreVars.RefreshToken);
        var res = await tda.getAccessFromRefreshToken(refToken);
        dispatch(setAccessToken(res.access_token));
        dispatch(setRefreshToken(refToken));
    }
}

export let getUserPrincipalData = () => {
    console.log('getUserPrincipalData')
    return async(dispatch:Dispatch) => {
        console.log(store.getState().tda.accessToken)
        let resJson = await tda.getuserprincipals(store.getState().tda.accessToken)
        console.log(resJson)
        dispatch(setUserPrincipalJson(resJson))
    }   
}


export const selectUserPrincipals = state => state.tda.userPrincipals;
export const { setRefreshToken, setAccessToken, setUserPrincipalJson } = tdaSlice.actions
export const selectAuth = ( state: RootState ) => state.auth
export default tdaSlice.reducer;
