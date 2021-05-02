import reduxWebsocket from '@giantmachines/redux-websocket';

import { configureStore, getDefaultMiddleware, MiddlewareArray, combineReducers } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import rootReducer from './rootReducer'
import authReducer from './features/authSlice'
import tdaReducer from './features/tdaSlice'
import quoteReducer from './features/quoteSlice'
 
/*
const rootReducer = combineReducers({
    auth: authReducer,
    tda: tdaReducer,
    quote: quoteReducer
})*/

const reduxWebsocketMiddleware  = reduxWebsocket({reconnectOnClose:false});
let store =  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false}).concat(reduxWebsocketMiddleware)
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>
export default store
