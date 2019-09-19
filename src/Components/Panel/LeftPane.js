import React, {Fragment} from 'react'
import {Paper, Button, TextField} from '@material-ui/core'
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

export default ({styles, onClick, minPlates}) => {
    const onButtonClickSelect = (e, index) => onClick(value, values)
    const classes = useStyles();
    const [value, setValue] = React.useState('96');
    const [values, setValues] = React.useState({
      maxPlates: 0
    });

    const handleChangeName = maxPlates => event => {
      setValues({[maxPlates]: event.target.value});
    }

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
        <TextField 
            multiline
            error
            rowsMax="2"
            value={minPlates}
            InputProps={{
              readOnly: true,
            }}
          />
        <br/>
       <TextField
        id="maxplates"
        label="Select max plates" 
        onChange={handleChangeName("maxPlates")}
        margin="normal"
      />
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
