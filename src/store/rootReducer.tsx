import { combineReducers } from '@reduxjs/toolkit'
import { kanbanBoardReducer } from 'src/slices/kanbanBoard'

const rootReducer = combineReducers({
    kanbanboard: kanbanBoardReducer,
})

export default rootReducer
