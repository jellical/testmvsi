import React, { useState } from 'react'
import {
    Button,
    IconButton,
    InputAdornment,
    makeStyles,
    Paper,
    SvgIcon,
    TextField
} from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import SearchIcon from '@material-ui/icons/Search'
import { useSelector } from 'react-redux'

import CollumnSettingsDialog from './ColumnsSettingsDialog'
import { RootState } from '../../store'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'

    },
    queryField: {
        marginRight:10,
        width: 500
    },
    settingscontainer: {
      display:'flex',
      justifyContent:'flex-end'
    },
    settings: {
    }
}))


const KanbanControlBar = ({ handleSearch }:{ handleSearch: (query?: string) => void }) => {
    const classes = useStyles()
    const [query, setQuery] = useState('')

    const columnids = useSelector((state: RootState) => state.kanbanboard.columns.allIds)

    const [isOpened, setOpened] = useState(false)

    const handleOpen = () => {
        setOpened(true)
    }

    const handleClose = () => {
        setOpened(false)
    }

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }

    const handleEnterButton = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(query)
        }

    }

    return (
        <Paper className={ classes.root }>
            <TextField
                className={ classes.queryField }
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SvgIcon
                                fontSize="small"
                                color="action"
                            >
                                <SearchIcon />
                            </SvgIcon>
                        </InputAdornment>
                    )
                }}
                onChange={ handleQueryChange }
                onKeyDown={ handleEnterButton }
                placeholder="Search issues"
                value={ query }
                variant="outlined"
            />
            <Button
                variant="text"
                onClick={ () => handleSearch(query) }
            >
                Search
            </Button>
            <div className={ classes.settingscontainer }>
                <IconButton
                    aria-label = "Settings"
                    onClick = { handleOpen }
                >
                    <SettingsIcon />
                </IconButton>
            </div>
            <CollumnSettingsDialog
                open={ isOpened }
                columnids={ columnids }
                onClose={ handleClose }
            />
        </Paper>
        )
}

export default KanbanControlBar
