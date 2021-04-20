import io from 'socket.io-client';
import reduxWebsocket from '@giantmachines/redux-websocket';

import { configureStore, getDefaultMiddleware, MiddlewareArray } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import rootReducer from './rootReducer'
 

let serializeDate = (date) => {
    console.log(date)
    let res = '0'
    return res
}
const reduxWebsocketMiddleware  = reduxWebsocket({ dateSerializer: serializeDate});

let store =  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false}).concat(reduxWebsocketMiddleware)

})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>
export default store
