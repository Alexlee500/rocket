declare interface AccessToken {
    access_token: string,
    refresh_token: string,
    token_type: string,
    expires_in: number,
    scope: string,
    refresh_token_expires_in: number
}

declare interface UserPrincipals {
    authToken: string,
    userId: string,
    userCdDomainId: string,
    primaryAccountId: string,
    lastLoginTime: string,
    tokenExpirationTime: string,
    loginTime: string,
    accessLevel: string,
    stalePassword: boolean,
    streamerInfo: {
        streamerBinaryUrl: string,
        streamerSocketUrl: string,
        token: string,
        tokenTimestamp: string,
        userGroup: string,
        accessLevel: string,
        acl: string,
        appId: string
    },
    professionalStatus: string,
    quotes: {
        isNyseDelayed: boolean,
        isNasdaqDelayed: boolean,
        isOpraDelayed: boolean,
        isAmexDelayed: boolean,
        isCmeDelayed: boolean,
        isIceDelayed: boolean,
        isForexDelayed: boolean
    },
    streamerSubscriptionKeys:{
        keys:{
            [index:number]:{
                key:string
            } 
        }
    },
    accounts:{
        [index:number]:{
            accountId: string,
            description: string,
            displayName: string,
            accountCdDomainId: string,
            company: string,
            segment: string,
            surrogateIds: object,
            preferences: {
                expressTrading: boolean,
                directOptionsRouting: boolean,
                directEquityRouting: boolean,
                defaultEquityOrderLegInstruction: string,
                defaultEquityOrderType: string,
                defaultEquityOrderPriceLinkType: string,
                defaultEquityOrderDuration: string,
                defaultEquityOrderMarketSession: string,
                defaultEquityQuantity: number,
                mutualFundTaxLotMethod: string,
                optionTaxLotMethod: string,
                equityTaxLotMethod: string,
                defaultAdvancedToolLaunch: string,
                authTokenTimeout: string,
            },
            acl: string,
            authorizations: {
                apex: false,
                levelTwoQuotes: boolean,
                stockTrading: boolean,
                marginTrading: boolean,
                streamingNews: boolean,
                optionTradingLevel: string,
                streamerAccess: boolean,
                advancedMargin: boolean,
                scottradeAccount: boolean
            }
        }
    }
}


declare interface Watchlists {
    name: string,
    watchlistId: string,
    accountId: string,
    status: string,
    watchlistItems: watchlistItem[]
}

declare interface watchlistItem {
    sequenceId: number,
    quantity: number,
    averagePrice: number,
    commission: number,
    purchasedDate: Date,
    instrument: Instrument,
    status: string
}

declare interface Instrument{
    symbol: string,
    description: string,
    assetType: string, 
    cusip: string,
    putCall: string,
    underlyingSymbol: string
}

declare interface SecuritiesAccount{
    securitiesAccount:{
        type: string, 
        accountId: string, 
        roundTrips: number, 
        isDayTrader: boolean, 
        isClosingOnlyRestricted: boolean,
        positions: Position[],
        initialBalances:{
            accountValue: number,
            cashBalance: number
        }
    }
}

declare interface Position{
    shortQuantity: number, 
    averagePrice: number,
    currentDayProfitLoss: number, 
    currentDayProfitLossPercentage: number,
    longQuantity: number,
    settledLongQuantity: number,
    settledShortQuantity: number, 
    instrument: Instrument,
    marketValue: number
}