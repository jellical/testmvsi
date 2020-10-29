import React, {
    useState
} from 'react'
import {
    Box,
    Button,
    TextField
} from '@material-ui/core'
import Add from '@material-ui/icons/Add'

import { createCard } from 'src/slices/kanbanBoard'
import { useDispatch } from 'react-redux'
import { ColumnInterface } from '../../types/kanbanEntities'

interface CardAddProps {
    columnId: ColumnInterface['id']
}

const CardAdd: React.FC<CardAddProps> = ({ columnId}) => {

    const dispatch = useDispatch()
    const [isExpanded, setExpanded] = useState(false)
    const [title, setTitle] = useState('')

    const handleChange = (event:any) => {
        event.persist()
        setTitle(event.target.value)
    }

    const handleAddInit = () => {
        setExpanded(true)
    }

    const handleAddCancel = () => {
        setExpanded(false)
        setTitle('')
    }

    const handleAddConfirm = async () => {
        try {
            await dispatch(createCard(columnId, title || 'Untitled issue'));
            setExpanded(false)
            setTitle('');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            {isExpanded ? (
                <>
                    <TextField
                        fullWidth
                        label="Title"
                        name="cardTitle"
                        onChange={ handleChange }
                        value={ title }
                        variant="outlined"
                    />
                    <Box
                        mt={2}
                        display="flex"
                        justifyContent="space-between"
                    >
                        <Button
                            onClick={ handleAddCancel }
                            variant="text"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={ handleAddConfirm }
                            variant="contained"
                            color="secondary"
                        >
                            Add
                        </Button>
                    </Box>
                </>
            ) : (
                <Box
                    display="flex"
                    justifyContent="left"
                >
                    <Button
                        startIcon={ <Add /> }
                        onClick={ handleAddInit }>
                        Create issue
                    </Button>
                </Box>
            )}
        </div>
    )
}

export default CardAdd
