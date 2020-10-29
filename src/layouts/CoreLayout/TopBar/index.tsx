import React from 'react'
import {
  AppBar,
  makeStyles, Toolbar, Typography
} from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 100,
    boxShadow: 'none',
    backgroundColor: theme.palette.primary.main
  },
  toolbar: {
    minHeight: 64
  },
  title: {

  }
}))


const TopBar = ({title}:{title:string}) => {
  const classes = useStyles();
  return (
    <AppBar className={classes.root} >
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
