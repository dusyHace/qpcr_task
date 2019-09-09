export let samples_array = []
export let reagents_array = []
export let replicates = []

const MAX_NR_TEST = 7
const MAX_LENGTH_SAMPLES = 10
const MAX_LENGTH_REAGENTS = 20
const MAX_NR_REPLICANTS = 3

let samples = []
let reagents = []

for (let i = 0; i < 100; i++) {
    samples.push('Sam-' + (i+1))
    reagents.push('Reag-' + (i+1))
}

// set max nr of test using random
let nr_test = Math.floor(Math.random()*MAX_NR_TEST) + 1

function shuffle (array)  {
    return array.sort(() => Math.random() - 0.5);
}

for (let i = 0; i < nr_test; i++) {   
    let arr = Array(100).fill(0).map((e,i)=>i+1)

    // set max length of samples using random fn
    let length_exp = Math.floor(Math.random()*MAX_LENGTH_SAMPLES) + 1

    shuffle(arr)
    let sampleArray = []
    for (let i = 0; i < length_exp; i++) {
        sampleArray=[...sampleArray, samples[arr[i]-1]]
    }
    samples_array=[...samples_array, sampleArray]

    // set max length of reagents using random fn
    length_exp = Math.floor(Math.random()*MAX_LENGTH_REAGENTS) + 1

    shuffle(arr)
    let reagArray = []
    for (let i = 0; i < length_exp; i++) {
        reagArray=[...reagArray, reagents[arr[i]-1]]
    }
    reagents_array=[...reagents_array, reagArray]

    // set max nr of replicates using random
    replicates.push(Math.floor(Math.random()*MAX_NR_REPLICANTS) + 1)
}
