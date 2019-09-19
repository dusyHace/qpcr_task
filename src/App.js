import React, { Component, Fragment } from 'react'
import Header from './Components/Layouts/Header'
import Panel from './Components/Panel'
import {samples_array, reagents_array, replicates} from './store.js'

export default class extends Component {
    state = {
        value:96,
        result:[],
        minPlates:"",
        maxPlates:0
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

    newNode(sr, sc, rl, cl) {
        return {
            sr:sr, // start row
            sc:sc, // start column
            rl:rl, // row length
            cl:cl  // column length
        }
    }

    setNode (sr, sc, rl, cl) {
        return this.newNode(sr, sc, rl, cl)
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

    createPlatesAndNodes(platesize, maxPlates) {
        let arrPlates = []
        let nodes = []
        for (let i = 0; i < maxPlates; i++) {
            arrPlates = [...arrPlates, this.newPlate(platesize)]
            nodes.push([this.newNode(0, 0, this.plRows, this.plClm)])
        }

        this.plates = arrPlates
        return nodes
    }

  joinNodes(plateNodes) {
    let reduced = false
    return plateNodes.reduce((a, b) => {
            reduced = false
            for (let i = 0; i < a.length; i++) {
                if (a[i].sc === b.sc 
                    && a[i].sr + a[i].rl === b.sr 
                    && a[i].cl === b.cl) {
                    a[i].rl = a[i].rl + b.rl
                    reduced = true
                }
            }
           
            if (!Array.isArray(a)) { 
                a = [b]
            } else if (!reduced) {
                a = [...a, b]
            }
    
         return a 
        }, {})
    }

    recursionFitRepl(exp, rep, nodes, opt) {
        // 1 best fit by rows and clm (both >= 0)
        // 2 best fit by rows and min clm (row >= 0 and clm min to 0)
        // 3 best fit by clm and min rows (clm >= 0 and row min to 0)
        // 4 node is smaller by rows and clm find min by rows and clm
        let expR = exp.length
        let expC = exp[0].length
        let minV = Number.MAX_SAFE_INTEGER
        let bestN = 0
        let indexP = -1
        let innerNode = []

         for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i]
            for (let j = 0; j < node.length; j++) {
                if (opt === 1 && (node[j].rl - expR) >= 0 && (node[j].cl - (expC*rep)) >= 0
                    && (node[j].rl - expR) * (node[j].cl - (expC*rep)) < minV) {
                        indexP = i
                        bestN = j
                        innerNode = node[j]
                        minV = (node[j].rl - expR) * (node[j].cl - (expC*rep)) 
                }
                if (opt === 2 && (node[j].rl - expR) >= 0 
                    && (node[j].rl - expR) + Math.abs((node[j].cl - (expC*rep))) < minV) {
                        indexP = i
                        bestN = j
                        innerNode = node[j]
                        minV = (node[j].rl - expR) + Math.abs((node[j].cl - (expC*rep))) 
                }
                if (opt === 3 && (node[j].cl - (expC*rep)) >= 0
                    && Math.abs((node[j].rl - expR)) + (node[j].cl - (expC*rep)) < minV) {
                        indexP = i
                        bestN = j
                        innerNode = node[j]
                        minV = Math.abs((node[j].rl - expR)) + (node[j].cl - (expC*rep)) 
                }
                if (opt === 4 && Math.abs((node[j].rl - expR)) + Math.abs((node[j].cl - (expC*rep))) < minV) {
                        indexP = i
                        bestN = j
                        innerNode = node[j]
                        minV = Math.abs((node[j].rl - expR)) + Math.abs((node[j].cl - (expC*rep)) )
                }
            }
         }


        if (indexP === -1 && rep > 1) {
            return this.recursionFitRepl(exp, rep-1, nodes, opt)
        }

        return {'rep':rep, 'indexp':indexP, 'node':innerNode, 'bestN': bestN}
    }

    createTwoNodes(res, expR, expC, nodes) {
        let vnode = nodes[res.indexp].slice(0)
        vnode.splice(res.bestN,1)

        // create two more nodes horizontal
        if (res.node.cl-(expC*res.rep) > 0 &&  res.node.sc+(expC*res.rep) <= this.plClm) {
            let nodeRight = this.setNode(res.node.sr, res.node.sc+(expC*res.rep), expR, res.node.cl-(expC*res.rep))
            vnode.push(nodeRight)
        }

        if (res.node.rl-expR > 0 && res.node.sr+expR <= this.plRows) {
            let nodeDown = this.setNode(res.node.sr+expR, res.node.sc, res.node.rl-expR, res.node.cl)
            vnode.push(nodeDown)
        }

        return vnode
    }

    splitByClms(exp, cLength) {
        let arrayColumn = (arr, start, end) => arr.map((row) => {
            let newRow = []
            for (let len = start; len < end; len++) {
                newRow = [...newRow, row[len]]
            }
            return  newRow
        })

        return {
            'cutExp': arrayColumn(exp, 0, cLength),
            'remainingExp': arrayColumn(exp, cLength, exp[0].length) 
        }
    }
   
    splitByRows(exp, rLength) {
        return {
            'cutExp': exp.slice(0, rLength), 
            'remainingExp': exp.slice(rLength, exp.length) 
        }
    }

    cutExperiment(experiment, countRep, nodes, index, opt) {
        let   remaining = true

        let newtwoarr = {
            'cutExp': [], 
            'remainingExp': [] 
        }

        let res =  this.recursionFitRepl(experiment.exp, 1, nodes, opt) 

        if  (res.indexp === -1 && opt <= 3) {
            return this.cutExperiment(experiment, countRep, nodes, index, opt+1) 
        } else if  (res.indexP === -1 && opt > 3) {
            console.log('ERROR')
        }
        let expR = opt === 1 || opt === 2 ? experiment.exp.length : res.node.rl
        let expC = opt === 1 || opt === 3 ? experiment.exp[0].length : res.node.cl

        if (res.indexp !== -1 && opt === 1) {
            remaining = false
            let nen = this.joinNodes(this.createTwoNodes(res, expR, expC, nodes))

            nodes[res.indexp] = nen
            let row = res.node.sr
            let clm = res.node.sc
        
            this.addExperimentToPlate(res.indexp, row, clm, experiment.exp, [index, countRep])
          
        } else if (res.indexp !== -1 && (opt === 2 || opt === 3)) {         
            let nen = this.joinNodes(this.createTwoNodes(res, expR, expC, nodes))

            nodes[res.indexp] = nen
            let row = res.node.sr
            let clm = res.node.sc

            newtwoarr = opt === 2 
                ? this.splitByClms(experiment.exp, res.node.cl) 
                : this.splitByRows(experiment.exp, res.node.rl)

            this.addExperimentToPlate(res.indexp, row, clm, newtwoarr.cutExp, [index, countRep])            
        } else if (opt === 4) { 
            let onesplit = this.splitByRows(experiment.exp, res.node.rl)

            let exper1stCut = {
                'exp': onesplit.cutExp,
                'rep': experiment.rep
            }
            
            this.cutExperiment(exper1stCut, countRep, nodes, index, 1) 

            if (onesplit.remainingExp.length) {
                let exper2ndCut = {
                    'exp': onesplit.remainingExp,
                    'rep': experiment.rep
                }

            return this.cutExperiment(exper2ndCut, countRep, nodes, index, 1) 
            }
        }
          
        if (remaining) {
            experiment = {
                'exp': newtwoarr.remainingExp,
                'rep': experiment.rep
            }
            return this.cutExperiment(experiment, countRep, nodes, index, 1) 
        }

        return res
    }

    findBestFit(expe, nodes, index) {
        let expR = expe.exp.length
        let expC = expe.exp[0].length
        let replica = expe.rep
        let countrep = 0
        let option = 1

        while (countrep < replica) {
            let res = option === 1 ? this.recursionFitRepl(expe.exp, expe.rep - countrep, nodes, option) : []

            if (option === 1 && res && res.indexp !== -1) {
                let nen = this.joinNodes(this.createTwoNodes(res, expR, expC, nodes))

                nodes[res.indexp] = nen
                let row = res.node.sr
                let clm = res.node.sc

                for (let k = 0; k < res.rep; k++) {
                    this.addExperimentToPlate(res.indexp, row, clm+(k*expC), expe.exp, [index, k + countrep])
                }
                countrep += res.rep
            } else {
                option = 2
                res = this.cutExperiment(expe, countrep, nodes, index, option)
                countrep++
            }
        }
  }

    addExperimentToPlate(indexP,row, clm, exp, color) {
        for(let x = 0; x < exp.length; x++) {
            for(let y = 0; y < exp[0].length; y++) {
            this.plates[indexP][x+row][y +clm] = [exp[x][y], color]
            }
        }
    }

  getResult(platesize, maxPlates) {
    this.plRows = platesize === 96 ? 8 : 16
    this.plClm = platesize === 96 ? 12 : 24

    // create plates and nodes
    let nodes = this.createPlatesAndNodes(platesize, maxPlates)
    let result = this.getCombinations()

    let combResult = []
    // add replicates to result
    for (let i = 0; i < result.length; i++) {
        combResult.push({'exp': result[i], 'rep': replicates[i]})
    }

    // sort result desc
    combResult.sort(function (a, b) {
        return (b.exp.length * b.exp[0].length * b.rep) - (a.exp.length * a.exp[0].length * a.rep)
    })

    combResult.map((experiment, index) => {
       return this.findBestFit(experiment, nodes, index)
    })

    return this.plates
  }

  getMinPlates(plSize, sam, reg, rep, maxP) {
    let res = 0
    for (let i = 0; i < sam.length; i++) {
      res += sam[i].length * reg[i].length * rep[i]
    }

    let minP = Math.ceil(res/plSize)
    if (maxP < minP) {
        this.setState({result:[]})
        return "ERROR: Min plates " + minP
    }

    this.setState({result:this.getResult(plSize, maxP)})

    return "Min required plates: " + Math.ceil(res/plSize) + "\nWells: " + res
  }

  handlePlateChanged = (value, values) => {
      this.setState({
        value: parseInt(value),
        minPlates:this.getMinPlates(parseInt(value), samples_array, reagents_array, replicates,parseInt(values.maxPlates))
      })
    }

    render () {
        const {value, result, minPlates} = this.state

        return <Fragment>
        <Header/>
        <Panel
            samples={samples_array}
            reagents={reagents_array}
            replicates={replicates}
            result={result}
            value={value}
            onClick={this.handlePlateChanged}
            minPlates={minPlates}
        />
        </Fragment>
  }
}
