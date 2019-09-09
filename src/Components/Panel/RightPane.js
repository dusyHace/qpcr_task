import React from 'react'
import {Paper} from '@material-ui/core'

export default ({
    styles,
    samples, 
    reagents, 
    replicates
}) =>
    <Paper style={styles.Paper}>
       <pre>SAMPLES: <br/>{JSON.stringify(samples, null, 2)}</pre>
       <br/>
       <pre>REAGENTS: <br/>{JSON.stringify(reagents, null, 2)}</pre>
       <br/>
       <pre>NUMBER OF REPLICATES: <br/>{JSON.stringify(replicates, null, 2)}</pre>
    </Paper>
