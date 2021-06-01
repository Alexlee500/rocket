import { createAction, Action, createAsyncThunk, createReducer, createSlice, PayloadAction, AnyAction, createEntityAdapter } from '@reduxjs/toolkit';
import { RootState } from '../store'
import {
    REDUX_WEBSOCKET_BROKEN,
    REDUX_WEBSOCKET_CLOSED,
    REDUX_WEBSOCKET_CONNECT,
    REDUX_WEBSOCKET_MESSAGE,
    REDUX_WEBSOCKET_OPEN,
    REDUX_WEBSOCKET_SEND,
    WebsocketMessage,
    WebsocketSend
} from './actionTypes';


type Candles = {
    "key": string,
    "seq": number,
    "1": number, 
    "2": number,
    "3": number,
    "4": number,
    "5": number,
    "6": number,
    "7": number,
    "8": number
}

const candlesAdapter = createEntityAdapter<Candles>({
    selectId:(chart) => chart["7"],
    sortComparer: (a, b) => a[7] - b[7]
})

const initialState = candlesAdapter.getInitialState({
        symbol: '',
        periodType:'day',
        period:'10',
        frequencyType:'minute',
        frequency:'1'
    })

const chartSlice = createSlice({
    name:'charts',
    initialState,
    reducers:{
        setChart(state, action){
            state.symbol = action.payload.symbol
            state.periodType = action.payload.periodType
            state.period = action.payload.period
            state.frequencyType = action.payload.frequencyType
            state.frequency = action.payload.frequency
            candlesAdapter.setAll(state, action.payload.candles)
        },
        upsertChart(state, action){
            candlesAdapter.upsertMany(state, action.payload)
        },
        resetChart: state => initialState

    },
    extraReducers:(builder) => {
        builder
        .addCase(REDUX_WEBSOCKET_MESSAGE, (state, action:WebsocketMessage) => {

            try{
                let MessageData = JSON.parse(action.payload.event.data);
                let response = MessageData?.data[0]
                if (response?.service == "CHART_EQUITY"){
                    let candle = response.content
                    console.log(`new candle ${JSON.stringify(candle)}`)

                    if (candle.key == state.symbol){
                        switch(state.frequencyType){
                            case "minute":{
                                
       
                                break
                            }
                            case "daily":
                            break
                            case "weekly":
                            break
                            case "monthly":
                            break
                        }
                    }
                }



            }catch{ }
            try{
                let MessageData = JSON.parse(action.payload.event.data);
                let snapshot = MessageData?.snapshot[0]
                console.log(`snapshot ${snapshot}`)
                if (snapshot?.service == "CHART_HISTORY_FUTURES"){
                    console.log(snapshot)
                    let content = snapshot.content[0];
                    let chartCandles = content["3"];
                    console.log(`chart candles ${JSON.stringify(chartCandles)}`)
                }
            }
            catch{}
        })
    }
})

export const chartSelector = candlesAdapter.getSelectors<RootState>(
    (state) => state.chart
)

export const {
    upsertChart,
    setChart,
    resetChart
} = chartSlice.actions

export default chartSlice.reducer