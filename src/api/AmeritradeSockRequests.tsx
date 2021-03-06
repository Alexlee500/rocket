import { parseISO } from 'date-fns'
import { getTime, endOfToday } from 'date-fns'

import AmeritradeConf from '../configs/AmeritradeConf'


export const AuthRequest = (PrincipalData:UserPrincipals) => {
    function jsonToQueryString(json:any) {
        return Object.keys(json).map(function(key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    }
    var tokenTimeStampAsDateObj = parseISO(PrincipalData.streamerInfo.tokenTimestamp)
    var tokenTimeStampAsMs = tokenTimeStampAsDateObj.getTime();
    var credentials = {
        "userid": PrincipalData.accounts[0].accountId,
        "token": PrincipalData.streamerInfo.token,
        "company": PrincipalData.accounts[0].company,
        "segment": PrincipalData.accounts[0].segment,
        "cddomain": PrincipalData.accounts[0].accountCdDomainId,
        "usergroup": PrincipalData.streamerInfo.userGroup,
        "accesslevel": PrincipalData.streamerInfo.accessLevel,
        "authorized": "Y",
        "timestamp": tokenTimeStampAsMs,
        "appid": PrincipalData.streamerInfo.appId,
        "acl": PrincipalData.streamerInfo.acl
    }

    var authRequest = {    
        "requests": [
        {
            "service": "ADMIN",
            "command": "LOGIN",
            "requestid": 0,
            "account": PrincipalData.accounts[0].accountId,
            "source": PrincipalData.streamerInfo.appId,
            "parameters": {
                "credential": jsonToQueryString(credentials),
                "token": PrincipalData.streamerInfo.token,
                "version": "1.0"
            }
        }
    ]}

    return authRequest;
}

export const subscribeAccountActivity = (PrincipalData:UserPrincipals) => {
    var subRequest = {
        "requests":[{
            "service": "ACCT_ACTIVITY", 
            "requestid": "2", 
            "command": "SUBS", 
            "account": PrincipalData.accounts[0].accountId, 
            "source": AmeritradeConf.clientId, 
            "parameters": {
                "keys": PrincipalData.streamerSubscriptionKeys.keys[0].key, 
                "fields": "0,1,2,3"
            }
        }]
    }

    return subRequest
}

export const subscribeQuote = ( PrincipalData:UserPrincipals, symbols:string ) => {
    var subRequest = {
        "requests": [{
            "service": "QUOTE",
            "requestid": "2",
            "command": "SUBS",
            "account": PrincipalData.accounts[0].accountId,
            "source": AmeritradeConf.clientId,
            "parameters": {
                "keys": symbols,
                "fields": "0,1,2,3,4,5,6,7,8,15,25,28,29,49"
            }
        }]
    }
    return subRequest
}

export const subscribeOptions = ( PrincipalData:UserPrincipals, symbols:string ) => {
    var subRequest = {
        "requests": [{
            "service": "OPTION",
            "requestid": "2",
            "command": "SUBS",
            "account": PrincipalData.accounts[0].accountId,
            "source": AmeritradeConf.clientId,
            "parameters": {
                "keys": symbols,
                "fields": "0,1,2,3,4,5,6,7,8,17,19,23,41"
            }
        }]
    }
    return subRequest
}

export const LogoutRequest = ( PrincipalData:UserPrincipals ) => {
    var subRequest = {
        "requests": [{
            "service": "ADMIN", 
            "requestid": "1", 
            "command": "LOGOUT", 
            "account": PrincipalData.accounts[0].accountId, 
            "source": AmeritradeConf.clientId, 
            "parameters": { }
        }]
    }
    return subRequest
}

export const ChartEquityRequest = (PrincipalData:UserPrincipals, symbols:string) => {
    var subRequest = {
        "requests": [{
            "service": "CHART_EQUITY",
            "requestid": "2",
            "command": "SUBS",
            "account": PrincipalData.accounts[0].accountId,
            "source": AmeritradeConf.clientId,
            "parameters": {
                "keys": symbols,
                "fields": "0,1,2,3,4,5,6,7,8"
            }
        }]
    }
    return subRequest
}

export const ChartHistoryRequest = (PrincipalData:UserPrincipals, symbol:string, frequency:string, period:string) => {
    console.log('chart history request')

    var subRequest = {
        "requests": [{
            "service": "CHART_HISTORY_FUTURES",
            "requestid": "3",
            "command": "GET",
            "account": PrincipalData.accounts[0].accountId,
            "source": AmeritradeConf.clientId,
            "parameters": {
                "symbol": symbol,
                "frequency": "m1",
                "period": "d5",
                "END_TIME": getTime(endOfToday())
            }
        }]
    }
    return subRequest
}