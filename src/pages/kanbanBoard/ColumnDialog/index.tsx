import React, { useState } from 'react'
import {
    Dialog,
    Button,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@material-ui/core'
import { useDispatch } from 'react-redux'

import { updateColumn } from 'src/slices/kanbanBoard'
import { ColumnInterface } from '../../../types/kanbanEntities'


interface ColumnDialogProps {
    column: ColumnInterface,
    onClose: () => void,
    open: boolean
}

const ColumnDialog: React.FC<ColumnDialogProps> = (
    {
        column,
        onClose,
        open
    }) => {
    const dispatch = useDispatch();
    const [title,setTitle] = useState(column.title)

    const handleUpdate = async (title: ColumnInterface['title']) => {
        try {
            await dispatch(updateColumn(column.id, { title }))
            onClose()

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
            <DialogTitle>Edit Column</DialogTitle>
            <DialogContent>
                <TextField
                    variant="outlined"
                    fullWidth
                    defaultValue={ column.title }
                    value={ title }
                    onChange={(event) => {
                        setTitle(event.target.value )}
                    }
                    label="Title"
                />
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={ onClose }
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={ () => handleUpdate(title) }
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ColumnDialog
