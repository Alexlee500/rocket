export const quoteFieldMap = {
    Symbol: "0",
    Bid:    "1",
    Close:  "15",
    Description: "25",
    NetChange: "29",
    Mark:   "49"
}

export const optionFieldMap = {
    Description: "1",
    Close: "7",
    Multiplier: "17",
    Mark: "41"
}

export const candleFieldMap = {
    key:"0",
    Open:"1",
    High:"2",
    Low:"3",
    Close:"4",
    Volume:"5",
    Sequence:"6",
    Time:"7"
}

export const renameChartCandles = (res) => {
    //console.log(res)
    let renamedCandleChart = res.candles.map((item)=> {
        return {
            1: item.open,
            2: item.high,
            3: item.low,
            4: item.close,
            5: item.volume,
            
            7: item.datetime
        }
    })
    return renamedCandleChart;
}
export const renameQuoteResponse = (initialResponse) => {
    let renamedQuoteData = Object.keys(initialResponse).map((item) => {
        return {
            key: item,
            1: initialResponse[item].bidPrice,
            2: initialResponse[item].askPrice,
            15: initialResponse[item].closePrice,
            25: initialResponse[item].description,
            29: initialResponse[item].netChange,
            49: initialResponse[item].mark
        }
    })
    return renamedQuoteData
}

export const renameOptionResponse = (initialResponse) => {
    let renamedOptionData = Object.keys(initialResponse).map((item) => {
        return {
            key: item,
            1: initialResponse[item].description,
            2: initialResponse[item].bidPrice,
            3: initialResponse[item].askPrice,
            7: initialResponse[item].closePrice,
            17: initialResponse[item].multiplier,
            23: initialResponse[item].netChange,
            41: initialResponse[item].mark
        }
    })
    return renamedOptionData
}

export const renameApiResponse = (res) => {
    let renamed = Object.keys(res).map((item) => {
        if (res[item].assetMainType == "OPTION"){
            return {
                key: item,
                1: res[item].description,
                2: res[item].bidPrice,
                3: res[item].askPrice,
                7: res[item].closePrice,
                23: res[item].netChange,
                41: res[item].mark
            }
        }
        if (res[item].assetMainType == "EQUITY"){
            return {
                key: item,
                1: res[item].bidPrice,
                2: res[item].askPrice,
                15: res[item].closePrice,
                25: res[item].description,
                29: res[item].netChange,
                49: res[item].mark
            }
        }
    })
    return renamed
}

