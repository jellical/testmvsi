import React from 'react'
import {
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    makeStyles, CardContent, Typography
} from '@material-ui/core'
import { useDispatch } from 'react-redux'
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult
} from 'react-beautiful-dnd'

import ColumnCard from './ColumnCard'
import { moveColumn } from '../../../slices/kanbanBoard'
import clsx from 'clsx'


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'

    },
    collumnCardTitle:{
        display:'flex',
        marginLeft: 15,
        marginRight: 20,
        justifyContent: 'space-between'
    },
    droppableArea: {
        minHeight: 80,
        flexGrow: 1,
        overflowY: 'auto',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
}))



interface CollumnSettingsDialogProps {
    columnids: string[],
    onClose: () => void,
    open: boolean
}



const CollumnSettingsDialog: React.FC<CollumnSettingsDialogProps> = (
    {
        columnids,
        onClose,
        open
    }) => {
    const classes = useStyles()
    const dispatch = useDispatch()


    const handleDragEnd = async (result: DropResult) => {

        const { source, destination, draggableId } = result

        try {
            if (!destination) {
                return;
            }

            if (
                 source.index === destination.index
            ) {
                return
            }

            await dispatch(moveColumn(draggableId, destination.index));

        } catch (err) {
            console.error(err)
        }
    }


    return (
        <Dialog
            onClose={ onClose }
            open={ open }
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>Columns settings</DialogTitle>
            <DialogContent>

                <CardContent
                    className={clsx(
                        classes.collumnCardTitle
                    )}
                >

                    <Typography
                        variant="h6"
                        color="textSecondary"
                    >
                        Title
                    </Typography>
                    <Typography
                        variant="h6"
                        color="textSecondary"
                    >
                        Show
                    </Typography>
                </CardContent>

                <DragDropContext onDragEnd={ handleDragEnd }>

                    <Droppable
                        droppableId="droppableArea"
                        type="card"
                    >
                        {(provided) => (
                            <div
                                ref={ provided.innerRef }
                                className={ classes.droppableArea }
                            >

                    {columnids.map((columnid, index)=>(

                        <Draggable
                            draggableId={ columnid }
                            index={ index }
                            key={ columnid }
                        >
                            {(provided, snapshot) => (
                                <ColumnCard
                                    columnid={ columnid }
                                    dragging={ snapshot.isDragging }
                                    index={ index }
                                    key={ columnid }
                                    //@ts-ignore
                                    ref={ provided.innerRef }
                                    style={{ ...provided.draggableProps.style }}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                />
                            )}
                        </Draggable>
                    ))}
                                { provided.placeholder }
                            </div>)}
                            </Droppable>
                </DragDropContext>


            </DialogContent>
            <DialogActions>
                <Button
                    variant="text"
                    onClick={ onClose }
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CollumnSettingsDialog
