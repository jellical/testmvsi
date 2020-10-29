import React from 'react'
import { makeStyles } from '@material-ui/core'
import TopBar from './TopBar'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64
  }
}))

interface CoreLayoutInterface {
  title: string
}

const CoreLayout:React.FC<CoreLayoutInterface> = ({title, children}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <TopBar title={title} />

      <div className={classes.wrapper}>
        {children}
      </div>
    </div>

  )
}

export default CoreLayout
