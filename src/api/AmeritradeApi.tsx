import {authorize, prefetchConfiguration, AuthConfiguration} from 'react-native-app-auth';
import * as SecureStore from 'expo-secure-store';


import AmeritradeConf from '../configs/AmeritradeConf'
//import SecureStoreVars from '../configs/SecureStoreVars';


const clientId:string = 'DIRTIFGCTZEXDXSLIAUXDNZUPTTNBGGN';
const redirectUrl:string = 'https://reactTestApp/oauth';
const tokenEndpoint:string = 'https://api.tdameritrade.com/v1/oauth2/token';

export async function oauthApiLogin() {
    console.log('tda login');
    var encodedUri:string = encodeURIComponent(AmeritradeConf.redirectUrl);
    var encodedClientId:string = encodeURIComponent(AmeritradeConf.clientId+ '@AMER.OAUTHAP');
    const config:AuthConfiguration = {
        clientId: clientId,
        redirectUrl: redirectUrl,
        serviceConfiguration: {
            authorizationEndpoint: 'https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=' + encodedUri + '&client_id=' + encodedClientId,
            tokenEndpoint: tokenEndpoint
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
        console.log(responseJson.access_token);
        console.log(responseJson.refresh_token);

        SecureStore.setItemAsync('tdaAccessToken', responseJson.access_token);
        SecureStore.setItemAsync('tdaRefreshToken', responseJson.refresh_token);
    })
    
}

async function getAccessFromRefreshToken(refreshToken:string){
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
        console.log("refresh");
        SecureStore.setItemAsync('tdaRefreshToken', responseJson.access_token);
    })
}








