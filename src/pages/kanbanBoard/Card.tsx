import React, {
    CSSProperties,
    forwardRef,
    useState
} from 'react'
import clsx from 'clsx'
import {
    Box,
    Card as MuiCard,
    CardContent,
    SvgIcon,
    Typography,
    makeStyles
} from '@material-ui/core'
import {
    Eye as EyeIcon,
} from 'react-feather';
import { useSelector } from 'react-redux'

import CardDialog from './CardDialog';
import { CardInterface, ColumnInterface } from '../../types/kanbanEntities'
import { RootState } from '../../store'

const useStyles = makeStyles((theme) => ({
    card: {
        '&:hover': {
            backgroundColor: theme.palette.grey[100]
        },
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    dragging: {
        backgroundColor: theme.palette.grey[100]
    },
    cover: {
        height: 200
    },
    badge: {
        '& + &': {
            marginLeft: theme.spacing(2)
        }
    }
}))

interface CardProps {
    cardId: string,
    dragging: boolean,
    index: number,
    column: ColumnInterface,
    style: CSSProperties
}

const Card: React.FC<CardProps> = forwardRef((
    {
        cardId,
        dragging,
        index,
        column,
        style,
        ...rest
    }, ref:any) => {
    const classes = useStyles()

    const card: CardInterface = useSelector((state: RootState) => state.kanbanboard.cards.byId[cardId])
    const [isOpened, setOpened] = useState(false)

    const handleOpen = () => {
        setOpened(true)
    };

    const handleClose = () => {
        setOpened(false)
    };

    return (
        <div
            //@ts-ignore
            index={ index }
            ref={ ref }
            style={ style }
            { ...rest }
        >
            <MuiCard
                className={clsx(
                    classes.card,
                    { [classes.dragging]: dragging }
                )}
                raised={ dragging }
                variant={ dragging ? 'elevation' : 'outlined' }
                onClick={ handleOpen }
            >
                <CardContent>
                    <Typography
                        variant="subtitle1"
                        color="textPrimary"
                    >
                        { card.title }
                    </Typography>
                    <Box
                        mt={2}
                        display="flex"
                        alignItems="center"
                    >
                        { card.isWatching && (
                            <SvgIcon
                                className={ classes.badge }
                                color="action"
                                fontSize="small"
                            >
                                <EyeIcon />
                            </SvgIcon>
                        )}

                        <Box flexGrow={1} />

                    </Box>
                </CardContent>
            </MuiCard>
            <CardDialog
                open={ isOpened }
                onClose={ handleClose }
                card={ card }
                column={ column }
            />
        </div>
    )
})

export default Card
