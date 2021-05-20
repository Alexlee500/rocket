
import { combineReducers } from '@reduxjs/toolkit'

import authReducer from './features/authSlice'
import tdaReducer from './features/tdaSlice'
import quoteReducer from './features/quoteSlice'
import chartReducer from './features/chartSlice'
const rootReducer = combineReducers({
    auth: authReducer,
    tda: tdaReducer,
    quote: quoteReducer,
    chart: chartReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
