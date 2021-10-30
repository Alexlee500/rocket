
import { combineReducers } from '@reduxjs/toolkit'

import authReducer from './features/authSlice'
import tdaReducer from './features/tdaSlice'
import quoteReducer from './features/quoteSlice'
import chartReducer from './features/chartSlice'
import chartHistoryReducer from './features/chartHistory'
import store from './store'
const rootReducer = combineReducers({
    auth: authReducer,
    tda: tdaReducer,
    quote: quoteReducer,
    //chart: chartReducer,
    chartHistory: chartHistoryReducer
})

export default rootReducer
