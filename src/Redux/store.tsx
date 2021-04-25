import io from 'socket.io-client';
import reduxWebsocket from '@giantmachines/redux-websocket';

import { configureStore, getDefaultMiddleware, MiddlewareArray } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import rootReducer from './rootReducer'
 


const reduxWebsocketMiddleware  = reduxWebsocket();
let store =  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false}).concat(reduxWebsocketMiddleware)

})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>
export default store
