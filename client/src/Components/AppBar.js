import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    marginLeft:'50px',
    flexGrow: 1,
  },
})); 

function TopBar() {
  const classes = useStyles();

    return (
<AppBar position="static" className='header'>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Dark Scrape
          </Typography>
        </Toolbar>
      </AppBar> 
    )
}

export default TopBar
