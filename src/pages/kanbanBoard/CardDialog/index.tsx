import React from 'react'
import {
    Box,
    Dialog,
    Divider,
    Grid,
    Typography,
    makeStyles,
    Button
} from '@material-ui/core'
import { useDispatch } from 'react-redux'

import {
    deleteCard,
    updateCard
} from 'src/slices/kanbanBoard'
import Details from './Details'
import { CardInterface, ColumnInterface } from '../../../types/kanbanEntities'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3)
    },
    columnTitle: {
        marginTop: theme.spacing(2),
        fontWeight: theme.typography.fontWeightMedium
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
    },
    buttons: {
        marginTop: theme.spacing(2),
        width: 100
    }
}))

interface CardDialogProps {
    card: CardInterface,
    column: ColumnInterface,
    onClose: () => void,
    open: boolean
}

const CardDialog: React.FC<CardDialogProps> = (
    {
        card,
        column,
        onClose,
        open
    }) => {
    const classes = useStyles()
    const dispatch = useDispatch()

    const handleWatch = async () => {
        try {
            await dispatch(updateCard(card.id, { isWatching: true }))
        } catch (err) {
            console.error(err)
        }
    }

    const handleUnwatch = async () => {
        try {
            await dispatch(updateCard(card.id, { isWatching: false }))

        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async () => {
        try {
            await dispatch(deleteCard(card.id))
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
            <div className={ classes.root }>
                <Grid
                    container
                    spacing={5}
                >
                    <Grid
                        item
                        xs={12}
                        sm={8}
                    >
                        <Details
                            card={ card }
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={4}
                    >
                        <Typography
                            variant="h6"
                            color="textSecondary"
                        >
                            Column
                        </Typography>
                        <Divider />
                        <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            className={ classes.columnTitle }
                        >
                            { column.title }
                        </Typography>
                        <Box mt={3}>
                            <Typography
                                variant="h6"
                                color="textSecondary"
                            >
                                Actions
                            </Typography>
                            <Divider />
                        </Box>
                            { card.isWatching ? (
                                <Button
                                    className={ classes.buttons }
                                    variant="contained"
                                    onClick={handleUnwatch}
                                >
                                    Unwatch
                                </Button>
                            ) : (
                                <Button
                                    className={ classes.buttons }
                                    variant="contained"
                                    onClick={ handleWatch }
                                >
                                    Watch
                                </Button>
                            )}

                        <Box mt={3}>
                            <Typography
                                variant="h6"
                                color="textSecondary"
                            >
                                Danger
                            </Typography>
                            <Divider />

                            <Button
                                onClick={ handleDelete }
                                variant="contained"
                                color="secondary"
                                className={ classes.buttons }
                            >
                                Delete
                            </Button>
                        </Box>

                    </Grid>
                </Grid>
            </div>
        </Dialog>
    )
}

export default CardDialog
