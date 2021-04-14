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

export let getTokens = (promptOauth: boolean) => {
    return async (dispatch:Dispatch) => {
        console.log('get Refresh Token from storage');
        try{
            let refToken = await SecureStore.getItemAsync(SecureStoreVars.RefreshToken);
            
            if (promptOauth && refToken == null){
                console.log('refreshToken is null');
                await oauthApiLogin();
                refToken = await SecureStore.getItemAsync(SecureStoreVars.RefreshToken);
            }
            
            console.log(`Refresh Token: ${refToken}`);
            await getAccessFromRefreshToken(refToken);

            let acsToken = await SecureStore.getItemAsync(SecureStoreVars.RefreshToken);
            console.log(`Access Token: ${acsToken}`);

            dispatch(setRefreshToken(refToken));
            dispatch(setAccessToken(acsToken));
            console.log('done');
        }
        catch(error){
            console.log(error);
        }
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
