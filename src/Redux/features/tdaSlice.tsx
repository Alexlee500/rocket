import { createAction, createReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';
import { bindActionCreators, Dispatch } from 'redux';
import * as SecureStore from 'expo-secure-store';
import { WEBSOCKET_CONNECT, WEBSOCKET_MESSAGE, WEBSOCKET_OPEN } from '@giantmachines/redux-websocket'
import * as tda from '../../api/AmeritradeApi';
import SecureStoreVars from '../../vars/SecureStoreVars';
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
        .addCase('REDUX_WEBSOCKET::SEND', (state, action) => {
            console.log('sock send');
            console.log(JSON.stringify(action.payload))
        })
        .addCase('REDUX_WEBSOCKET::MESSAGE', (state, action) => {
            console.log('sock message');
            console.log(JSON.stringify(action.payload))

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
    return async(dispatch:Dispatch) => {
        console.log('getRefreshFromStorage')
        let refToken = await SecureStore.getItemAsync(SecureStoreVars.RefreshToken);

        dispatch(setRefreshToken(refToken));
    }
}

export let getAccessFromRefresh = () => {
    return async(dispatch:Dispatch, getState) => {
        console.log('getAccessFromRefresh')

        let refToken = await SecureStore.getItemAsync(SecureStoreVars.RefreshToken);
        var res = await tda.getAccessFromRefreshToken(refToken);
        //dispatch(setRefreshToken(refToken));

        let principalData = await tda.getuserprincipals(res.access_token)
        dispatch(setUserPrincipalJson(principalData))
        dispatch(setAccessToken(res.access_token));

    }
}

export const getUserPrincipalData = () => {
    return async(dispatch:Dispatch, getState) => {
        console.log('getUserPrincipalData')
        console.log(getState().tda.accessToken)
        let resJson = await tda.getuserprincipals(getState().tda.accessToken)
        dispatch(setUserPrincipalJson(await resJson))
    }   
}



export const selectUserPrincipals = state => state.tda.userPrincipals;
export const { setRefreshToken, setAccessToken, setUserPrincipalJson } = tdaSlice.actions
export const selectAuth = ( state: RootState ) => state.auth
export default tdaSlice.reducer;
