import React, {
    CSSProperties,
    forwardRef, useState
} from 'react'
import clsx from 'clsx'
import {
    CardContent,
    Typography,
    makeStyles, Switch
} from '@material-ui/core'
import {useDispatch, useSelector} from 'react-redux'

import { RootState } from 'src/store'
import { ColumnInterface } from '../../../types/kanbanEntities'
import {updateColumn} from '../../../slices/kanbanBoard'

const useStyles = makeStyles((theme) => ({
    collumnCard: {
        '&:hover': {
            backgroundColor: theme.palette.grey[100]
        },
        display:'flex',
        paddingBottom: '5px!important',
        justifyContent: 'space-between'
    },
    dragging: {
        backgroundColor: theme.palette.grey[100]
    }
}))

interface ColumnCardProps {
    dragging: boolean,
    index: number,
    columnid: ColumnInterface['id'],
    style: CSSProperties
}

const ColumnCard: React.FC<ColumnCardProps> = forwardRef((
    {
        dragging,
        index,
        columnid,
        style,
        ...rest
    }, ref:any) => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const column: ColumnInterface = useSelector((state:RootState) => state.kanbanboard.columns.byId[columnid])
    const [checked, setChecked] = useState(column.isHidden)

    const handleSwitchChange = () => {
        setChecked(!checked)
        dispatch(updateColumn(columnid,{isHidden: !checked}))

    }

    return (
        <div
            //@ts-ignore
            index={index}
            ref={ref}
            style={style}
            {...rest}
        >

                <CardContent
                    className={clsx(
                        classes.collumnCard,
                        { [classes.dragging]: dragging }
                    )}
                >

                    <Typography
                        variant="subtitle1"
                        color="textPrimary"
                    >
                        {column.title}
                    </Typography>
                    <Switch
                        checked={!checked}
                        onChange={handleSwitchChange}
                        name="checkedA"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />

                </CardContent>

        </div>
    )
})

export default ColumnCard
