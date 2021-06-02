
import { combineReducers } from '@reduxjs/toolkit'

import authReducer from './features/authSlice'
import tdaReducer from './features/tdaSlice'
import quoteReducer from './features/quoteSlice'
import chartReducer from './features/chartSlice'
import chartHistoryReducer from './features/chartHistory'
const rootReducer = combineReducers({
    auth: authReducer,
    tda: tdaReducer,
    quote: quoteReducer,
    chart: chartReducer,
    chartHistory: chartHistoryReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
