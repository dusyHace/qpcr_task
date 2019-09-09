import React from 'react'
import {Grid} from '@material-ui/core'
import LeftPane from './LeftPane'
import RightPane from './RightPane'
import Well from './Well'

const styles = {
    Paper: {
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 5,
        marginLeft: 5
    }
}

export default ({
    samples, 
    reagents, 
    replicates,
    result,
    value,
    onClick
}) =>

    <Grid container> 
        <Grid item xs={2}>
            <LeftPane 
                styles={styles}
                samples={samples}
                reagents={reagents}
                replicates={replicates}
                onClick={onClick}
            />
        </Grid>
        <Grid item xs={1}>
            <RightPane 
                styles={styles}
                samples={samples}
                reagents={reagents}
                replicates={replicates}
            />
        </Grid>
        <Grid item xs={9}>
            <Well 
              styles={styles}
              result={result}
              value={value}
            />
        </Grid>
    </Grid>
