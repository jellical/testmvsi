import React, { useCallback, useEffect } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { makeStyles } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'


import { getKanbanData, moveCard } from 'src/slices/kanbanBoard'
import Column from './Column'
import ColumnAdd from './ColumnAdd'
import { RootState } from '../../store'
import KanbanControlBar from './KanbanControlBar'
import { ColumnInterface } from '../../types/kanbanEntities'

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column'
    },
    content: {
        flexGrow: 1,
        flexShrink: 1,
        display: 'flex',
        overflowY: 'hidden',
        overflowX: 'auto'
    },
    inner: {
        display: 'flex',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
    }
}))



const KanbanView = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const columns = useSelector((state:RootState) => state.kanbanboard.columns)


    const handleSearch = (query?:string) => {
        dispatch(getKanbanData(query))
    }

    const handleDragEnd = async (result: DropResult) => {

        const { source, destination, draggableId } = result;

        try {
            if (!destination) {
                return;
            }

            if (
                source.droppableId === destination.droppableId
                && source.index === destination.index
            ) {
                return;
            }

            await dispatch(moveCard(draggableId, destination.index, destination.droppableId));

        } catch (err) {
            console.error(err);
        }
    }

    const getBoardData = useCallback(() => {
        dispatch(getKanbanData())
        },[dispatch])

    useEffect(() => {
        getBoardData();
    }, [getBoardData]);

    return (

        <div className={ classes.root }>
            <KanbanControlBar handleSearch={ handleSearch }/>
            <DragDropContext onDragEnd={ handleDragEnd }>
               <div className={ classes.content }>
                    <div className={ classes.inner }>
                        {columns.allIds.map((columnId:ColumnInterface['id']) => {
                            if(!columns.byId[columnId].isHidden){
                                return <Column
                                    key={columnId}
                                    columnId={columnId}
                                />
                            }
                            return false

                        })}
                        <ColumnAdd />
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
};

export default KanbanView;
