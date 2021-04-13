import { combineReducers } from '@reduxjs/toolkit'

import authReducer from './features/authSlice'
import tdaReducer from './features/tdaSlice'

const rootReducer = combineReducers({
    auth: authReducer,
    tda: tdaReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer