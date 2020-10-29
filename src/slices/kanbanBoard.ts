import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import _ from 'lodash'

import { TAction } from 'src/store'
import {
    getBoardApi,
    createColumnApi,
    updateColumnApi,
    dragColumnApi,
    createCardApi,
    dragCardApi,
    updateCardApi,
    deleteCardApi,
    deleteColumnApi
} from '../mockApi/mock'
import {CardInterface, ColumnInterface, KanbanBoardInterface} from '../types/kanbanEntities'

interface State {
    isLoaded: boolean,
    columns: {
        byId: {
            [key:string]:ColumnInterface,
        },
        allIds: string[]
    },
    cards: {
        byId: {
            [key:string]:CardInterface,
        },
        allIds: string[]
    }
}

const initialState: State = {
    isLoaded: false,
    columns: {
        byId: {},
        allIds: []
    },
    cards: {
        byId: {},
        allIds: []
    }
};

const slice = createSlice({
    name: 'kanbanBoard',
    initialState,
    reducers: {
        getKanbanData(state, action: PayloadAction<KanbanBoardInterface>) {
            const kanbanData = action.payload
            state.columns.byId = _.keyBy(kanbanData.columns,'id')
            state.columns.allIds = Object.keys(state.columns.byId)
            state.cards.byId = _.keyBy(kanbanData.cards,'id')
            state.cards.allIds = Object.keys(state.cards.byId)
            state.isLoaded = true
        },

        createColumn(state, action: PayloadAction<ColumnInterface>) {
            const column = action.payload

            state.columns.byId[column.id] = column
            state.columns.allIds.push(column.id)
        },
        updateColumn(state, action: PayloadAction<ColumnInterface>) {
            const column = action.payload

            state.columns.byId[column.id] = column
        },
        deleteColumn(state, action: PayloadAction<ColumnInterface['id']>) {
            const columnId = action.payload

            state.columns.byId = _.omit(state.columns.byId, columnId)
            _.pull(state.columns.allIds, columnId)
        },
        moveColumn(state, action: PayloadAction<{columnId:string, position:number}>) {
            const {columnId, position} = action.payload

            _.pull(state.columns.allIds,columnId)
            state.columns.allIds.splice(position,0,columnId)
        },
        createCard(state, action: PayloadAction<CardInterface>) {
            const card = action.payload
            state.cards.byId[card.id] = card
            state.cards.allIds.push(card.id)
            state.columns.byId[card.columnId].cards.push(card.id)
        },
        updateCard(state, action: PayloadAction<CardInterface>) {
            const  card = action.payload

            _.merge(state.cards.byId[card.id], card)
        },
        moveCard(state, action: PayloadAction<{cardId: CardInterface['id'], position:number, columnId:ColumnInterface['id']}>) {
            const { cardId, position, columnId } = action.payload
            const sourceColumnId = state.cards.byId[cardId].columnId
            _.pull(state.columns.byId[sourceColumnId].cards, cardId)

            if (columnId!==sourceColumnId) {
                state.cards.byId[cardId].columnId = columnId;
                state.columns.byId[columnId].cards.splice(position, 0, cardId)
            } else {
                state.columns.byId[sourceColumnId].cards.splice(position, 0, cardId)
            }
        },
        deleteCard(state, action:PayloadAction<CardInterface['id']>) {
            const cardId = action.payload;
            const { columnId } = state.cards.byId[cardId]

            state.cards.byId = _.omit(state.cards.byId, cardId)
            _.pull(state.cards.allIds, cardId)
            _.pull(state.columns.byId[columnId].cards, cardId)
        }
    }
})

export const kanbanBoardReducer = slice.reducer

export const getKanbanData = (query?:string):TAction<any> => async (dispatch) => {
  const kanbanData = await getBoardApi(query)
  dispatch(slice.actions.getKanbanData(kanbanData))
}

export const createColumn = (name:string):TAction<any> => async (dispatch) => {
    const newColumn = await createColumnApi(name)
    dispatch(slice.actions.createColumn(newColumn))
}

export const updateColumn = (columnId:string, update:Object):TAction<any> => async (dispatch) => {
    const updatedColumn = await updateColumnApi(columnId, update)
    dispatch(slice.actions.updateColumn(updatedColumn))
}

export const moveColumn = (columnId:ColumnInterface['id'], position:number):TAction<any> => async (dispatch) => {
    await dragColumnApi(columnId,position)
    dispatch(slice.actions.moveColumn({columnId,position}))
}

export const deleteColumn = (columnId:string):TAction<any> => async (dispatch) => {
    await deleteColumnApi(columnId)
    dispatch(slice.actions.deleteColumn(columnId))
}

export const createCard = (columnId:string, title:string):TAction<any> => async (dispatch) => {
    const newCard = await createCardApi(columnId, title)
    dispatch(slice.actions.createCard(newCard))
}

export const updateCard = (cardId:string, update:Object):TAction<any> => async (dispatch) => {
    const updatedCard = await updateCardApi(cardId, update)
    dispatch(slice.actions.updateCard(updatedCard))
}

export const moveCard = (cardId:CardInterface['id'], position:number, columnId:ColumnInterface['id']):TAction<any> => async (dispatch) => {
    await dragCardApi(cardId,position,columnId)
    dispatch(slice.actions.moveCard({cardId,position,columnId}))
}

export const deleteCard = (cardId:string):TAction<any> => async (dispatch) => {
    await deleteCardApi(cardId)
    dispatch(slice.actions.deleteCard( cardId ))
}

export default slice
