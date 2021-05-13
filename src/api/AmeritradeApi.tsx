import {authorize, prefetchConfiguration, AuthConfiguration} from 'react-native-app-auth';
import * as SecureStore from 'expo-secure-store';

import AmeritradeConf from '../configs/AmeritradeConf'
import SecureStoreVars from '../vars/SecureStoreVars';



export async function oauthApiLogin() : Promise<AccessToken> {
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
        
        const res = await getTokensFromAuthCode(result.authorizationCode)

        console.log(`oauth Login Done with`)
        return res;


    }catch(error){
        console.error(error);
        return null;
    }
}


// API call to get Access token and Refresh Token from Auth Code
async function getTokensFromAuthCode(authCode:string) : Promise<AccessToken> {
    console.log('getTokensFromAuthCode')

    var postBody:string =  "grant_type=authorization_code";
    postBody += "&refresh_token=";
    postBody += "&access_type=offline";
    postBody += "&code=" + encodeURIComponent(authCode);
    postBody += "&client_id=" + encodeURIComponent(AmeritradeConf.clientId+ '@AMER.OAUTHAP');
    postBody += "&redirect_uri=" + encodeURIComponent(AmeritradeConf.redirectUrl);

    const res = await fetch(AmeritradeConf.tokenEndpoint, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },  
                                body: postBody
                            })                        
    return await res.json();
}


export async function getAccessFromRefreshToken(refreshToken:string) : Promise<AccessToken>{

    var postBody:string =  "grant_type=refresh_token";
    postBody += "&refresh_token=" + encodeURIComponent(refreshToken);
    postBody += "&access_type=";
    postBody += "&code=";
    postBody += "&client_id=" + encodeURIComponent(AmeritradeConf.clientId+ '@AMER.OAUTHAP');
    postBody += "&redirect_uri=";

    var res = await fetch(AmeritradeConf.tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },  
        body: postBody
    });
    return await res.json();
}

export async function getuserprincipals(accessToken: string) : Promise<UserPrincipals>{
    console.log(`getuserprincipals ${accessToken}`);
    const resourceUrl = "https://api.tdameritrade.com/v1/userprincipals?fields=streamerSubscriptionKeys%2CstreamerConnectionInfo";
    var res = await fetch(resourceUrl, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    var resJson = await res.json();
    return resJson;
}

export async function getWatchlistsForAccount( accessToken: string, accountId: string ) : Promise<Watchlists>{
    const resourceUrl = `https://api.tdameritrade.com/v1/accounts/${accountId}/watchlists`;
    var res = await fetch(resourceUrl, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    var resJson:Watchlists = await res.json();
    return resJson
}

export async function getAccount(accessToken: string, accountId: string) : Promise<SecuritiesAccount>{
    const resourceUrl = `https://api.tdameritrade.com/v1/accounts/${accountId}?fields=positions%2Corders`;
    var res = await fetch(resourceUrl, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })

    var resJson:SecuritiesAccount = await res.json();
    return resJson
}
 

export async function getQuotes(accessToken: string, quotes: string[]) : Promise<any>{
    let qString = quotes.reduce((res, item) => {
        if (item){
            return `${res}%2C${item}`
        } return res
    })
    const resourceUrl = `https://api.tdameritrade.com/v1/marketdata/quotes?symbol=${qString}`;
    var res = await fetch(resourceUrl, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    var resJson:any = await res.json();
    return resJson

}