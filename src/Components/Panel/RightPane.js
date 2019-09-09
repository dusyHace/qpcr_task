import React from 'react'
import {Paper} from '@material-ui/core'

export default ({
    styles,
    samples, 
    reagents, 
    replicates
}) =>
    <Paper style={styles.Paper}>
       <pre>{JSON.stringify(samples, null, 2)}</pre>
       <br/>
       <pre>{JSON.stringify(reagents, null, 2)}</pre>
       <br/>
       <pre>{JSON.stringify(replicates, null, 2)}</pre>
    </Paper>    