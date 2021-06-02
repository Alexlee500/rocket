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

const dayCandles = createEntityAdapter<Candles>({
    selectId:(chart) => chart["7"],
    sortComparer: (a, b) => a[7] - b[7]
})
const weekCandles = createEntityAdapter<Candles>({
    selectId:(chart) => chart["7"],
    sortComparer: (a, b) => a[7] - b[7]
})
const monthCandles = createEntityAdapter<Candles>({
    selectId:(chart) => chart["7"],
    sortComparer: (a, b) => a[7] - b[7]
})
const yearCandles = createEntityAdapter<Candles>({
    selectId:(chart) => chart["7"],
    sortComparer: (a, b) => a[7] - b[7]
})
const ytdCandles = createEntityAdapter<Candles>({
    selectId:(chart) => chart["7"],
    sortComparer: (a, b) => a[7] - b[7]
})

const dayInitialState = dayCandles.getInitialState()
const weekInitialState = weekCandles.getInitialState()
const monthInitialState = monthCandles.getInitialState()
const yearInitialState = yearCandles.getInitialState()
const ytdInitialState = ytdCandles.getInitialState()

const initialState = {
        symbol: '',
        dayCandles: dayInitialState,
        weekCandles: weekInitialState,
        monthCandles: monthInitialState,
        yearCandles: yearInitialState, 
        ytdCandles: ytdInitialState
}

const chartHistory = createSlice({
    name:'chartHistory',
    initialState,
    reducers:{
        setDayChart(state, action){
            dayCandles.setAll(state.dayCandles, action.payload)
        },
        setWeekChart(state, action){
            weekCandles.setAll(state.weekCandles, action.payload)
        },
        setMonthChart(state, action){
            monthCandles.setAll(state.monthCandles, action.payload)
        },
        setYearChart(state, action){
            yearCandles.setAll(state.yearCandles, action.payload)
        },
        setYtdChart(state, action){
            ytdCandles.setAll(state.ytdCandles, action.payload)
        },
        upsertChart(state, action){
            dayCandles.upsertMany(state.dayCandles, action.payload)
        },
        resetChart: state => initialState

    },
    extraReducers:(builder) => {

    }
})

export const daySelector = dayCandles.getSelectors<RootState>(
    (state) => state.chartHistory.dayCandles
)
export const weekSelector = weekCandles.getSelectors<RootState>(
    (state) => state.chartHistory.weekCandles
)
export const monthSelector = monthCandles.getSelectors<RootState>(
    (state) => state.chartHistory.monthCandles
)
export const yearSelector = yearCandles.getSelectors<RootState>(
    (state) => state.chartHistory.yearCandles
)
export const ytdSelector = ytdCandles.getSelectors<RootState>(
    (state) => state.chartHistory.ytdCandles
)

export const {
    upsertChart,
    setDayChart,
    setMonthChart,
    setWeekChart,
    setYearChart,
    setYtdChart,
    resetChart
} = chartHistory.actions

export default chartHistory.reducer