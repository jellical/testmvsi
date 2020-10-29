import React, { useState } from 'react'
import {
    Box,
    Button,
    Card,
    TextField,
    makeStyles
} from '@material-ui/core'
import { useDispatch } from 'react-redux'

import { createColumn } from 'src/slices/kanbanBoard'

const useStyles = makeStyles((theme) => ({
    root: {},
    inner: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 380,
        [theme.breakpoints.down('xs')]: {
            width: 300
        }
    }
}))

const ListAdd = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [isExpanded, setExpanded] = useState(false)
    const [name, setName] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    };

    const handleAddInit = () => {
        setExpanded(true);
    };

    const handleAddCancel = () => {
        setExpanded(false);
        setName('');
    };

    const handleAddConfirm = async () => {
        try {
            await dispatch(createColumn(name || 'Untitled list'));
            setExpanded(false);
            setName('');

        } catch (err) {
            console.error(err);

        }
    };

    return (
        <div className={classes.root}>
            <Card className={classes.inner}>
                <Box p={2}>
                    {isExpanded ? (
                        <>
                            <TextField
                                fullWidth
                                label="Column Title"
                                name="columnName"
                                onChange={handleChange}
                                value={name}
                                variant="outlined"
                            />
                            <Box
                                mt={2}
                                display="flex"
                                justifyContent="space-between"
                            >
                                <Button onClick={handleAddCancel} variant="text">
                                    Cancel
                                </Button>
                                <Button onClick={handleAddConfirm} variant="contained" color="secondary">
                                    Add
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Box
                            display="flex"
                            justifyContent="center"
                        >
                            <Button onClick={handleAddInit}>
                                Add Column
                            </Button>
                        </Box>
                    )}
                </Box>
            </Card>
        </div>
    )
}

export default ListAdd
