import { Action, configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import {ThunkAction} from 'redux-thunk'

const ENABLE_REDUX_DEV_TOOLS = true

const store = configureStore({
    reducer: rootReducer,
    devTools: ENABLE_REDUX_DEV_TOOLS
})

export type TAction<T> = ThunkAction<void, T, void, Action>

export type RootState = ReturnType<typeof rootReducer>

export default store
