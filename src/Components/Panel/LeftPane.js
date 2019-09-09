import React, {Fragment} from 'react'
import {Paper, Button} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
  group: {
    margin: theme.spacing(1, 0),
  },
}));

export default ({styles, onClick}) => {
    const onButtonClickSelect = (e, index) => onClick(value)
    const classes = useStyles();
    const [value, setValue] = React.useState('96');

    function handleChange(event) {
        setValue(event.target.value)
    }
  
  return ( 
     <Paper style={styles.Paper}>
         <Fragment>
        <FormControl component="fieldset" className={classes.formControl}>
            <RadioGroup
            name="96"
            className={classes.group}
            value={value}
            onChange={handleChange}
            >
            <FormControlLabel 
                value="96" 
                control={<Radio />} 
                label="96" 
            />
            </RadioGroup>
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>    
            <RadioGroup
            name="384"
            className={classes.group}
            value={value}
            onChange={handleChange}
            >
            <FormControlLabel
                value="384"
                control={<Radio color="primary" />}
                label="384"
            />
            </RadioGroup>
        </FormControl>    
        </Fragment> 
        <br/>
        <Fragment>
            <Button 
            variant='contained'
            onClick={onButtonClickSelect}
            >Load</Button>
        </Fragment> 
    </Paper>
  )
}
