import React, { Component, Fragment } from 'react'
import Header from './Components/Layouts/Header'
import Panel from './Components/Panel'
import {samples_array, reagents_array, replicates} from './store.js'

export default class extends Component {
  state = {
    value:96,
    result:[]
  }
  newPlate(plateSize) {
    let rows = 8
    let cols = 12

    if (plateSize === 384) {
      rows = 16
      cols = 24
    }
    return Array(rows).fill(0).map(()=>Array(cols).fill(0))
  }

  findPositionInUsedPlate(well96, exp, repp) {
    // optimze for 1 plate
    // repp = 0 new experiment starts

    let expl  = exp.length
    let expyl = exp[0].length
    let firstPositeion = repp ? 1 : well96[0].length

    for (let x = 0; x < well96.length; x++) {
      for (let y = 0; y < firstPositeion; y++) {
       if(!well96[x][y]) {
     
        let xemptyspaces=well96.length-x;
        let yemptylspaces=well96[x].length-y;
  
        let enoughspace=xemptyspaces-expl >= 0 && yemptylspaces-expyl>=0;

        //check inner space
        if (enoughspace) {
          for(let x1 = x; x1 < x+expl; x1++) {
            for(let y1 = y; y1 < y+expyl; y1++) {
              if(well96[x1][y1]) {
                enoughspace = false
                break
              }
            }
          }
        }
        if (enoughspace) {
           return [x, y]
        }
       } 
       
      }
    }
    return [-1, -1]
  }

  getCombinations() {
    let results=[]
    
    for (let i = 0; i < samples_array.length; i++) {
      let res = []
      for (let j = 0; j < samples_array[i].length; j++) {
        res = [...res, reagents_array[i].map(val => [samples_array[i][j], val])]
      }          
      results = [...results , res]
    }
 
   
    return  results
  }

  addExpToPlare(plate, startPos, exp, color){
    for(let x = 0; x < exp.length; x++) {
      for(let y = 0; y < exp[0].length; y++) {

        plate[x+startPos[0]][y + startPos[1]] = [exp[x][y], color]
      }

    }
    return plate;
  }

  splitExperiment(splitRows, spitClm, experiment) {   
    
    let plRows = 8
    let plClm = 12 
  
    let arrExperminetSplit = []
    if (!splitRows &&  !spitClm) 
      return [experiment]

    // split experiment if rows and or columns exceed plate
    if (splitRows || spitClm) {
      let exR = Math.ceil(experiment.length / plRows)
    
      let indexr = 0
      let startPR = 0
      
      while(indexr < exR ) {
        let slice = experiment.slice(startPR, startPR+plRows)
        let exC = Math.ceil(slice[0].length / plClm)

        // no split necessary
        if (exC === 1) {
          arrExperminetSplit = [...arrExperminetSplit, slice]
          break
        }
          // iterate each row and check for nr columns
          let startPC = 0
          let inNewExp = 0
          while(inNewExp < exC) {
              let singleExperminetSplit = []
              for (let j = 0; j < slice.length; j++) {    
                  singleExperminetSplit[j] = slice[j].slice(startPC, startPC+plClm)             
              } 
          
              arrExperminetSplit = [...arrExperminetSplit, singleExperminetSplit]

            startPC += plClm
            inNewExp++
        }
    
        startPR += plRows
        indexr++
      }
    }

    return arrExperminetSplit
  }

  getResult(value) {
    console.log(value)
    let plRows = value === 96 ? 8 : 16
    let plClm = value === 96 ? 12 : 24

    this.plateSize = value
    let result = this.getCombinations()
    let arrPlates = [this.newPlate(this.plateSize)]
    let positionFree=[-1, -1]

    result.map((experiment, index) => {
      for(let repp = 0; repp < replicates[index]; repp++) {

       positionFree= this.findPositionInUsedPlate(arrPlates[arrPlates.length-1], experiment, false)//, replicates[col1])
     
      if (positionFree[0] !== -1 && positionFree[0] !== -1
        && experiment[0].length < plClm && experiment.length < plRows) {  
        
        // experminet fits ok in used plate
        arrPlates[arrPlates.length-1] = this.addExpToPlare(arrPlates[arrPlates.length-1],positionFree,experiment, [index, repp])

        } else {
        
              // check if it fits [x, y] else split y
              
             
          
              let splitExperminet = this.splitExperiment(experiment.length > plRows, experiment[0].length > plClm,  experiment)
           

              for (let expindex = 0; expindex < splitExperminet.length; expindex++) {
              let exp = splitExperminet[expindex]
       
                // splite experminet
                positionFree = this.findPositionInUsedPlate(arrPlates[arrPlates.length-1], exp, false)

                if (positionFree[0] === -1 || positionFree[0] === -1) {
                  arrPlates = [...arrPlates, this.newPlate(this.plateSize)]
                  positionFree=[0, 0] 
                }
                
                arrPlates[arrPlates.length-1] = this.addExpToPlare(arrPlates[arrPlates.length-1],positionFree,exp, [index, repp])
              }

        }
    }
    return arrPlates
  })


    return arrPlates
  }

  handlePlateChanged = value => {
      this.setState({value: parseInt(value)})
      this.setState({result:this.getResult(parseInt(value))})
    }

  render () {
    const {value, result} = this.state
    return <Fragment>
      <Header/>
      <Panel
        samples={samples_array}
        reagents={reagents_array}
        replicates={replicates}
        result={result}
        value={value}
        onClick={this.handlePlateChanged}
      />
    </Fragment>
  }
}
