import { createAction, Action, createAsyncThunk, createReducer, createSlice, PayloadAction, AnyAction, createEntityAdapter } from '@reduxjs/toolkit';

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
    "Key": string,
    "1": number, 
    "2": number,
    "3": number,
    "4": number,
    "5": number
}

const quoteAdapter = createEntityAdapter<Quote>({
    selectId: (quote) => quote.key,
    sortComparer: (a, b) => a.key.localeCompare(b.key)
})



const quoteSlice = createSlice({
    name: 'quotes',
    initialState: quoteAdapter.getInitialState(),
    reducers: {
        quoteAdded: quoteAdapter.addOne,
        quoteReceived(state, action){
            quoteAdapter.setAll(state, action.payload.quotes)
        }
    },
    extraReducers:(builder) => {
        builder
        .addCase(REDUX_WEBSOCKET_MESSAGE, (state, action:WebsocketMessage) => {
            let MessageData = JSON.parse(action.payload.event.data);
            try{
                let response = MessageData?.data[0]
                console.log(`msg response for quote ${JSON.stringify(response)}`)
                if (response?.service == "QUOTE" ){
                    console.log(`Upsert Many ${response.content}`)
                    quoteAdapter.upsertMany(state, response.content);
                }
            }catch{

            }
        })
    }
})

export const {
    quoteAdded, 
    quoteReceived
} = quoteSlice.actions

export default quoteSlice.reducer