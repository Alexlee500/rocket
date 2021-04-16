import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';
import { Dispatch } from 'redux';
import * as SecureStore from 'expo-secure-store';

import { oauthApiLogin, getAccessFromRefreshToken } from '../../api/AmeritradeApi';
import SecureStoreVars from '../../vars/SecureStoreVars';

interface tdaSlice{

    refreshToken: string
    accessToken: string
}
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
            let oauthResponse = await oauthApiLogin();
            SecureStore.setItemAsync(SecureStoreVars.RefreshToken, oauthResponse.refresh_token);
            dispatch(setRefreshToken(oauthResponse.refresh_token));
            dispatch(setAccessToken(oauthResponse.access_token));
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
        var res = await getAccessFromRefreshToken(refToken);
        dispatch(setAccessToken(res.access_token));
        dispatch(setRefreshToken(refToken));
    }
}

export const tdaSlice = createSlice({
    name: 'tda',
    initialState:{
        accessToken: '',
        refreshToken: ''
    },
    reducers: {
        setRefreshToken: ( state, action: PayloadAction<string>) => {
            state.refreshToken = action.payload;
        },
        setAccessToken: ( state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        }
    }
})

export const { setRefreshToken, setAccessToken } = tdaSlice.actions
export const selectAuth = ( state: RootState ) => state.auth
export default tdaSlice.reducer;
