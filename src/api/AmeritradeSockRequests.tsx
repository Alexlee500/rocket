import { parseISO } from 'date-fns'

import AmeritradeConf from '../configs/AmeritradeConf'


export const AuthRequest = (PrincipalData) => {
    function jsonToQueryString(json) {
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

export const subscribeAccountActivity = (PrincipalData) => {
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

export const subscribeQuote = ( PrincipalData, quotes ) => {
    var subRequest = {
        "requests": [{
            "service": "QUOTE",
            "requestid": "2",
            "command": "SUBS",
            "account": PrincipalData.accounts[0].accountId,
            "source": AmeritradeConf.clientId,
            "parameters": {
                "keys": quotes,
                "fields": "0,1,2,3,4,5,6,7,8,29,49"
            }
        }]
    }
    return subRequest
}

export const LogoutRequest = ( PrincipalData ) => {
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