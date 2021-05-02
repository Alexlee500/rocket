import { combineReducers } from '@reduxjs/toolkit'

import authReducer from './features/authSlice'
import tdaReducer from './features/tdaSlice'
import quoteReducer from './features/quoteSlice'

const rootReducer = combineReducers({
    auth: authReducer,
    tda: tdaReducer,
    quote: quoteReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer