import React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'

export default () =>
    <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" color="inherit" style={{flex:1}}>
             QPCR_TASK
            </Typography>
        </Toolbar>
    </AppBar>