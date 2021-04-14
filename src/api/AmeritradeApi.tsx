import {authorize, prefetchConfiguration, AuthConfiguration} from 'react-native-app-auth';
import * as SecureStore from 'expo-secure-store';

import AmeritradeConf from '../configs/AmeritradeConf'
import SecureStoreVars from '../vars/SecureStoreVars';



export async function oauthApiLogin() {
    console.log('tda login');
    var encodedUri:string = encodeURIComponent(AmeritradeConf.redirectUrl);
    var encodedClientId:string = encodeURIComponent(AmeritradeConf.clientId+ '@AMER.OAUTHAP');
    const config:AuthConfiguration = {
        clientId: AmeritradeConf.clientId,
        redirectUrl: AmeritradeConf.redirectUrl,
        serviceConfiguration: {
            authorizationEndpoint: 'https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=' + encodedUri + '&client_id=' + encodedClientId,
            tokenEndpoint: AmeritradeConf.tokenEndpoint
        },
        usePKCE: false,
        skipCodeExchange: true,
        scopes:[]
    };

    try{
        const result = await authorize(config);
        
        await getTokensFromAuthCode(result.authorizationCode);
    }catch(error){
        console.error(error);
    }
}



// API call to get Access token and Refresh Token from Auth Code
async function getTokensFromAuthCode(authCode:string) {


    var postBody:string =  "grant_type=authorization_code";
    postBody += "&refresh_token=";
    postBody += "&access_type=offline";
    postBody += "&code=" + encodeURIComponent(authCode);
    postBody += "&client_id=" + encodeURIComponent(AmeritradeConf.clientId+ '@AMER.OAUTHAP');
    postBody += "&redirect_uri=" + encodeURIComponent(AmeritradeConf.redirectUrl);

    fetch(AmeritradeConf.tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },  
        body: postBody
    })
    .then(response => response.json())
    .then((responseJson)=>{
        console.log(`Access Token: ${responseJson.access_token}`);
        console.log(`Refresh Token: ${responseJson.refresh_token}`);

        SecureStore.setItemAsync(SecureStoreVars.AccessToken, responseJson.access_token);
        SecureStore.setItemAsync(SecureStoreVars.RefreshToken, responseJson.refresh_token);
    })
    
}

export async function getAccessFromRefreshToken(refreshToken:string){
    console.log('getAccessFromRefreshToken');

    var postBody:string =  "grant_type=refresh_token";
    postBody += "&refresh_token=" + encodeURIComponent(refreshToken);
    postBody += "&access_type=";
    postBody += "&code=";
    postBody += "&client_id=" + encodeURIComponent(AmeritradeConf.clientId+ '@AMER.OAUTHAP');
    postBody += "&redirect_uri=";

    fetch(AmeritradeConf.tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },  
        body: postBody
    })
    .then(response => response.json())
    .then((responseJson)=>{
        //console.log(`Access Token: ${responseJson.access_token}`);
        SecureStore.setItemAsync(SecureStoreVars.AccessToken, responseJson.access_token);
    })
}








