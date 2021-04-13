import {createAsyncThunk, createSlice, Store} from '@reduxjs/toolkit';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import { RootState } from '../rootReducer';
import * as LocalAuthentication from 'expo-local-authentication';
import { Dispatch } from 'redux';

interface authSlice {
    authenticated: boolean
}

export let promptBio = () => {
    return async (dispatch:Dispatch) => {
        console.log('promptbio');
        try{
            const res = await LocalAuthentication.authenticateAsync({promptMessage: 'Unlock', cancelLabel: 'cancel', disableDeviceFallback: true});
            if (res.success){
                console.log('succ');
                dispatch(authenticate());
            }
        }catch(error){
            console.log(error);
        }
    }
}



export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authenticated: false
    },
    reducers: {
        
        authenticate: ( state ) => {
            state.authenticated = true;
        },
        deauthenticate: ( state ) => {
            state.authenticated = false;
        }
    }
})

export const { authenticate, deauthenticate } = authSlice.actions
export const selectAuth = ( state: RootState ) => state.auth
export default authSlice.reducer;
