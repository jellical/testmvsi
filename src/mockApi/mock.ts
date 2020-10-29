import {v4 as uuid} from 'uuid'
import _ from 'lodash'

import { CardInterface, ColumnInterface, KanbanBoardInterface } from '../types/kanbanEntities'

const initBoardObject = {
    columns: [],
    cards: []
}

export const saveKanbanObjectToLocalStorage = (kanbanObjectToSave: KanbanBoardInterface) => {
    window.localStorage.setItem('kanban', JSON.stringify(kanbanObjectToSave))
}

export const getKanbanObjectFromLocalStorage = (): KanbanBoardInterface => {
    const storage = window.localStorage.getItem('kanban')

    return !!storage ? JSON.parse(storage) : initBoardObject
}


export const getBoardApi = (searchQuery?:string) => {
    return new Promise<KanbanBoardInterface>((resolve) => {
        const storage = getKanbanObjectFromLocalStorage()

        if(storage.cards && searchQuery) {
            storage.cards.forEach(card => {
                if (!card.title.includes(searchQuery)) {
                    if (storage.columns) {
                       const columnWithCard = storage.columns.findIndex(column => column.id === card.columnId)
                       _.pull(storage.columns[columnWithCard].cards,card.id)
                    }
                } else {
                    return
                }
            })

        }

        resolve (storage)
    })
}

export const createColumnApi = (title:ColumnInterface['title']) => {

    return new Promise<ColumnInterface>((resolve) => {

        const storageToSave = getKanbanObjectFromLocalStorage()

        const newColumn:ColumnInterface = {
            id: uuid(),
            title,
            cards: [],
            isHidden: false
        }

        if (storageToSave.columns) {
            storageToSave.columns.push(newColumn)
        } else {
            storageToSave.columns = [newColumn]
        }

        saveKanbanObjectToLocalStorage(storageToSave)

        resolve(newColumn)
    } )
}

export const updateColumnApi = (columnId:string, updatedata:any) => {
    return new Promise<ColumnInterface>( (resolve, reject) => {
        const storageToSave = getKanbanObjectFromLocalStorage()

        if(storageToSave.columns) {
            const foundcolumn = storageToSave.columns.find((column) => column.id === columnId)
            const foundcolumnIndex = storageToSave.columns.findIndex((column) => column.id === columnId)

            const updatedColumn = _.assign(foundcolumn, updatedata)
            storageToSave.columns[foundcolumnIndex] = updatedColumn
            saveKanbanObjectToLocalStorage(storageToSave)
            resolve(updatedColumn)
        }

        reject("Something went wrong. Possibly local storage was cleared by User")

    })

}

export const dragColumnApi = (columnId:string, position:number) => {
    return new Promise((resolve, reject) => {
        const storageToSave = getKanbanObjectFromLocalStorage()

        if (storageToSave.columns) {
            const foundColumn = storageToSave.columns.find(column => column.id === columnId)
            storageToSave.columns = storageToSave.columns.filter(column => column.id !== columnId)
            foundColumn && storageToSave.columns.splice(position,0, foundColumn)

            saveKanbanObjectToLocalStorage(storageToSave)
            resolve()
        }

        reject("Something went wrong. Possibly local storage was cleared by User")
    })
}

export const deleteColumnApi = (columnId:string) => {
    return new Promise(((resolve, reject) => {
        const storageToSave = getKanbanObjectFromLocalStorage()

        if(storageToSave.columns) {
            storageToSave.columns = storageToSave.columns.filter(column => column.id !== columnId)

            storageToSave.cards && (
                storageToSave.cards = storageToSave.cards.filter(card => card.columnId !== columnId)
            )

            saveKanbanObjectToLocalStorage(storageToSave)
            resolve()
        }

        reject("Something went wrong. Possibly local storage was cleared by User")
    }))
}

export const createCardApi = (columnId: ColumnInterface['id'], title:CardInterface['title']) => {
    return new Promise<CardInterface>((resolve) =>{
        let storageToSave = getKanbanObjectFromLocalStorage()

        const newCard:CardInterface = {
            id: uuid(),
            title,
            body: '',
            isWatching: false,
            dueDate: '',
            columnId
        }



        if (storageToSave.cards) {
            storageToSave.cards.push(newCard)
        }

        if (storageToSave.columns) {
            const foundcolumnIndex = storageToSave.columns.findIndex((column) => column.id === columnId)

            !!storageToSave.columns[foundcolumnIndex].cards ?
                storageToSave.columns[foundcolumnIndex].cards.push(newCard.id)
                :
                storageToSave.columns[foundcolumnIndex].cards = [newCard.id]

        }

        saveKanbanObjectToLocalStorage(storageToSave)

        resolve(newCard)
    })
}

export const dragCardApi = (cardId:CardInterface['id'], position:number, columnId:ColumnInterface['id']) => {
    return new Promise((resolve, reject) => {

        const storageToSave = getKanbanObjectFromLocalStorage()

        if (storageToSave.cards) {
            const draggableCard = storageToSave.cards.find((card) => card.id === cardId)

            if (storageToSave.columns && draggableCard) {
                const startingColumn = storageToSave.columns.find(column => column.id === draggableCard.columnId)
                const startingColumnPosition = storageToSave.columns.findIndex(column => column.id === draggableCard.columnId)

                _.pull(storageToSave.columns[startingColumnPosition].cards, cardId)

                const destColumn = storageToSave.columns.find(column => column.id === columnId)
                const destColumnPosition = storageToSave.columns.findIndex(column => column.id === columnId)

                if (destColumn && startingColumn && destColumn.id === startingColumn.id) {
                    storageToSave.columns[startingColumnPosition].cards.splice(position,0, cardId)
                } else if(destColumn) {
                    storageToSave.columns[destColumnPosition].cards.splice(position,0, cardId)
                    draggableCard.columnId = destColumn.id
                }

                saveKanbanObjectToLocalStorage(storageToSave)

                resolve()
            }

        }

        reject("Something went wrong. Possibly local storage was cleared by User")
    })
}


export const updateCardApi = (cardid:CardInterface['id'], update:Object) => {
    return new Promise<CardInterface>((resolve, reject) => {
        const storageToSave = getKanbanObjectFromLocalStorage()

        if (storageToSave.cards) {
            const cardToChange = storageToSave.cards.find(card => card.id === cardid)
            const cardToChangeIndex = storageToSave.cards.findIndex(card => card.id === cardid)

            const updatedCard = _.assign(cardToChange, update)


            storageToSave.cards[cardToChangeIndex] = updatedCard

            saveKanbanObjectToLocalStorage(storageToSave)

            resolve(updatedCard)
        } else {
            reject("Something went wrong.")
        }
    })
}

export const deleteCardApi = (cardId:CardInterface['id']) => {
    return new Promise((resolve, reject) => {
        const storageToSave = getKanbanObjectFromLocalStorage()

            if (storageToSave.cards) {
                const cardToDelete = storageToSave.cards.find(card => card.id === cardId)

                if (cardToDelete) {
                    storageToSave.cards.filter(card => card.id !== cardId)
                }

                if (cardToDelete && storageToSave.columns) {
                    const columnWithCardIndex = storageToSave.columns.findIndex(column => column.id === cardToDelete.columnId)
                    _.pull(storageToSave.columns[columnWithCardIndex].cards, cardId)
                }

                saveKanbanObjectToLocalStorage(storageToSave)
                resolve(storageToSave)
            } else {
                reject("Something went wrong.")
            }

        }
    )
}
