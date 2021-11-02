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

type Quote = {
    "key": string,
    "1": number, 
    "2": number,
    "3": number,
    "4": number,
    "5": number,
    "24": number
}

const quoteAdapter = createEntityAdapter<Quote>({
    selectId: (quote) => quote.key,
    sortComparer: (a, b) => a.key.localeCompare(b.key)
})



const quoteSlice = createSlice({
    name: 'quotes',
    initialState: quoteAdapter.getInitialState(),
    reducers: {
        upsertQuotes(state, action){
            quoteAdapter.upsertMany(state, action.payload)
        },

    },

    extraReducers:(builder) => {
        builder
        .addCase(REDUX_WEBSOCKET_MESSAGE, (state, action:any) => {
            let MessageData = JSON.parse(action.payload.event.data);
            try{
                let response = MessageData?.data[0]
                if (response?.service == "QUOTE" || response?.service == "OPTION"){
                    quoteAdapter.upsertMany(state, response.content);
                }
            }catch{

            }
        })
    }
})


export const quoteSelector = quoteAdapter.getSelectors<RootState>(
    (state) => state.quote
)

export const {
    upsertQuotes
} = quoteSlice.actions

export default quoteSlice.reducer
