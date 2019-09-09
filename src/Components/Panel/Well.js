import React, {Fragment, Component} from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import { GridList } from '@material-ui/core'

const styles = {
    border:1,
    borderColor:"black",
    fontSize: '10px', 
    wordwrap:'true', 
    textAlign:'center',
    style:{
        height: '5vh', 
        width: '5vh'
    }
}

const styles2 = {
    fontSize: '14px', 
    textAlign:'center',
    style:{
        height: '3vh', 
        width: '5vh'
    }
}

export default class extends Component {

    getExColor(experiment) {
        // empty wells are lightgray
        if (typeof experiment === 'undefined') return 'lightgray'
        // change luminosity for each repeat
        let color = "#", c, i;
        let hexArray= ['0a2b7d','9c150b','08803a','b34607', '990825', '5fa108','69088a'] 
        let hex = hexArray[(experiment[0]) % (hexArray.length)]
    
        let lum= 0.2*(experiment[1]+1)
    
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
            color += ("00"+c).substr(c.length);
        }

        return color
    }

    render() {
        const {result, value} = this.props
        let columns = value === 96 ? 12 : 24
        // top row on plate
        let arr = Array(columns).fill(0).map((e,i)=>i+1)
    
    return (<Fragment>
       <CssBaseline />
       {result.map((val, col)=> 
            <Container key={col} spacing={3} style={{paddingTop:10}} >
                <GridList>   
                    <Box component="div" key = {new Date().getSeconds()+col} {...styles2}/>
                    {arr.map((a) =>  
                        <Box component="div" key = {new Date().getSeconds()+col+a} {...styles2}>{a}</Box>
                    )}
                </GridList>
                
                {val.map((v, col1)=> 
                    <GridList key={col1}>
                        <Box component="div" {...styles} key = {col1+2} style={{...styles.style, ...{border: 0, fontSize: '14px'}}}>
                            {col1+1} {String.fromCharCode(65 + col1)}
                        </Box>
                        {v.map((v1, col2)=> 
                            <Box component="div" {...styles} 
                                key = {col2} 
                                style={{...styles.style, ...{backgroundColor:  this.getExColor(v1[1])}}}
                            >
                                {v1 !== 0 ? v1[0][0] + ' ' + v1[0][1] : ''} 
                            </Box>
                        )}
                        <Box component="div" {...styles} key = {col1+1} style={{...styles.style, ...{border: 0, fontSize: '14px'}}}>
                            {String.fromCharCode(65 + col1)} {col1+1}
                        </Box>
                    </GridList>
                )}
            </Container>
        )}
        </Fragment>
    )}
}