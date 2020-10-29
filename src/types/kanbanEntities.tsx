export interface KanbanBoardInterface {
    columns?: ColumnInterface[],
    cards?: CardInterface[]
}

export interface ColumnInterface {
    id: string,
    title: string,
    isHidden: boolean,
    cards: CardInterface['id'][]
}

export interface CardInterface {
    id: string,
    title: string,
    body: string,
    isWatching: boolean
    dueDate: string,
    labels?: Label[]
    columnId: string
}

export interface Label {
    id: string,
    title: string
}

