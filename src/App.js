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
    return Array(rows).fill(0).map(()=>Array(cols).fill(null))
  }

  findPositionInUsedPlate(plate, exp, first_repl, replicants, positionLast) {
    // optimze for 1 plate
    let exRows = exp.length
    let exClm  = exp[0].length
    let x1 = positionLast[0] === -1 ? 0 : positionLast[0] 

    for (let x = x1; x < plate.length; x++) {
      for (let y = 0; y < plate[0].length; y++) {
       if(!plate[x][y]) {
        let xemptyspaces = plate.length - x;
        let yemptyspaces = plate[x].length - y;
 
        if (first_repl && (exClm * replicants) > yemptyspaces && y!== 0) {
          // first replicant start new line
          continue
        }

        let enoughSpace = xemptyspaces - exRows >= 0 && yemptyspaces - exClm >= 0;

        // check inner space
        if (enoughSpace) {
          for(let x1 = x; x1 < x + exRows; x1++) {
            for(let y1 = y; y1 < y + exClm; y1++) {
              if(plate[x1][y1]) {
                enoughSpace = false
                break
              }
            }
          }
        }

        if (enoughSpace) {
           return [x, y]
        }

       } 
      }
    }

    return [-1, -1]
  }

  getCombinations() {
    let results = []
    
    for (let i = 0; i < samples_array.length; i++) {
      let res = []
      for (let j = 0; j < samples_array[i].length; j++) {
        res = [...res, reagents_array[i].map(val => [samples_array[i][j], val])]
      }          
      results = [...results , res]
    }
   
    return  results
  }

  addExpToPlate(plate, startPos, exp, color) {
    for(let x = 0; x < exp.length; x++) {
      for(let y = 0; y < exp[0].length; y++) {

        plate[x+startPos[0]][y + startPos[1]] = [exp[x][y], color]
      }

    }
    return plate;
  }

  splitExperiment(splitRows, spitClm, experiment, plateSize) {   
    
    let plRows = plateSize === 96 ? 8 : 16
    let plClm  = plateSize === 96 ? 12 : 24 
  
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
    let plRows = value === 96 ? 8 : 16
    let plClm = value === 96 ? 12 : 24

    let plateSize = value
    let result = this.getCombinations()
    let arrPlates = [this.newPlate(plateSize)]
    let positionFree = [0, 0]

    result.map((experiment, index) => {
      for(let repp = 0; repp < replicates[index]; repp++) {
        // find first position in plate for experiment
        positionFree = this.findPositionInUsedPlate(
                            arrPlates[arrPlates.length-1], 
                            experiment, 
                            !repp,
                            replicates[index],
                            positionFree
                      )
        // experminet fits in used plate
        if (positionFree[0] !== -1 && positionFree[0] !== -1
          && experiment[0].length < plClm && experiment.length < plRows) {
          
          arrPlates[arrPlates.length-1] = this.addExpToPlate(
                                                arrPlates[arrPlates.length-1],
                                                positionFree,
                                                experiment, 
                                                [index, repp]
                                          )
        } else {
          let splitExperminet = this.splitExperiment(
                                      experiment.length > plRows, 
                                      experiment[0].length > plClm, 
                                      experiment,
                                      plateSize
                                )

          for (let expindex = 0; expindex < splitExperminet.length; expindex++) {
            let exp = splitExperminet[expindex]
  
            // splite experminet
            positionFree = this.findPositionInUsedPlate(
                                  arrPlates[arrPlates.length-1], 
                                  exp, 
                                  !repp,
                                  replicates[index],
                                  positionFree
                            )

            if (positionFree[0] === -1 || positionFree[0] === -1) {
              arrPlates = [...arrPlates, this.newPlate(plateSize)]
              positionFree = [0, 0] 
            }
            
            arrPlates[arrPlates.length-1] = this.addExpToPlate(
                                                  arrPlates[arrPlates.length-1],
                                                  positionFree,
                                                  exp, 
                                                  [index, repp]
                                            )
          }
        }
      }
      return arrPlates
    })

    return arrPlates
  }

  handlePlateChanged = value => {
      this.setState({
        value: parseInt(value),
        result:this.getResult(parseInt(value))
      })
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
