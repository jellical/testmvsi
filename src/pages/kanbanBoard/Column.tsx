import React, {
    useState,
    useRef
} from 'react'
import {
    Droppable,
    Draggable
} from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import {
    Box,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    SvgIcon,
    Typography,
    makeStyles
} from '@material-ui/core'
import { MoreVertical as MoreIcon } from 'react-feather'

import { deleteColumn } from 'src/slices/kanbanBoard'
import Card from './Card'
import CardAdd from './CardAdd'
import {RootState} from '../../store'
import ColumnDialog from './ColumnDialog'

const useStyles = makeStyles((theme) => ({
    root: {},
    inner: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        overflowY: 'hidden',
        overflowX: 'hidden',
        width: 350,
        height: '100%',
        [theme.breakpoints.down('xs')]: {
            width: 300
        }
    },
    titletext: {
        maxWidth: 250,
        maxHeight: 50,
        overflowX: 'hidden',
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
    menu: {
        width: 240
    }
}))

interface ColumnProps {
    columnId: string
}

const Column: React.FC<ColumnProps> = ({ columnId }) => {
    const classes = useStyles()
    const [isMenuOpen, setMenuOpen] = useState(false)
    const column = useSelector((state: RootState) => state.kanbanboard.columns.byId[columnId])
    const dispatch = useDispatch()
    const moreRef = useRef(null)
    const [isOpened, setOpened] = useState(false);

    const handleMenuOpen = () => {
        setMenuOpen(true)
    }

    const handleMenuClose = () => {
        setMenuOpen(false)
    }

    const handleOpen = () => {
        setOpened(true);
        setMenuOpen(false)
    };

    const handleClose = () => {
        setOpened(false);
    };

    const handleDelete = async () => {
        try {
            setMenuOpen(false);
            await dispatch(deleteColumn(column.id))

        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div
            className={ classes.root }
        >
            <Paper
                className={ classes.inner }>
                <Box
                    py={1}
                    px={2}
                    display="flex"
                    alignItems="center"
                >
                    <Typography
                        className={ classes.titletext }
                        color="inherit"
                        variant="h6"
                        onClick={ handleOpen }
                    >
                        { column.title }
                    </Typography>

                    <Box flexGrow={1} />
                    <IconButton
                        color="inherit"
                        edge="end"
                        onClick={ handleMenuOpen }
                        ref={ moreRef }
                    >
                        <SvgIcon fontSize="small">
                            <MoreIcon />
                        </SvgIcon>
                    </IconButton>
                </Box>
                <Divider />
                <Droppable
                    droppableId={ column.id }
                    type="card"
                >
                    {(provided) => (
                        <div
                            ref={ provided.innerRef }
                            className={ classes.droppableArea }
                        >
                            {column.cards.map((cardId: string, index: number) => (
                                <Draggable
                                    draggableId={ cardId }
                                    index={ index }
                                    key={ cardId }
                                >
                                    {(provided, snapshot) => (
                                        <Card
                                            cardId={ cardId }
                                            dragging={ snapshot.isDragging }
                                            index={ index }
                                            key={ cardId }
                                            column={column}
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
                        </div>
                    )}
                </Droppable>
                <Divider />
                <Box p={2}>
                    <CardAdd columnId={ column.id } />
                </Box>
                <Menu
                    keepMounted
                    anchorEl={ moreRef.current }
                    open={ isMenuOpen }
                    onClose={ handleMenuClose }
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    PaperProps={{ className: classes.menu }}
                    getContentAnchorEl={ null }
                >
                    <MenuItem onClick={ handleOpen }>
                        Rename
                    </MenuItem>
                    <MenuItem onClick={ handleDelete }>
                        Delete
                    </MenuItem>
                </Menu>
            </Paper>
            <ColumnDialog
                open={ isOpened }
                onClose={ handleClose }
                column={ column }
            />
        </div>
    )
}

export default Column
