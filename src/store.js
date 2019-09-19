export let samples_array = []
export let reagents_array = []
export let replicates = []

const MAX_NR_TEST = 5
const MAX_LENGTH_SAMPLES = 25
const MAX_LENGTH_REAGENTS = 17
const MAX_NR_REPLICANTS = 4

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
    // set max length of samples using random fn
    let length_exp = Math.floor(Math.random()*MAX_LENGTH_SAMPLES) + 1

    shuffle(samples)
    let sampleArray = []
    for (let i = 0; i < length_exp; i++) {
        sampleArray=[...sampleArray, samples[i]]
    }
    samples_array=[...samples_array, sampleArray]

    // set max length of reagents using random fn
    length_exp = Math.floor(Math.random()*MAX_LENGTH_REAGENTS) + 1

    shuffle(reagents)
    let reagArray = []
    for (let i = 0; i < length_exp; i++) {
        reagArray=[...reagArray, reagents[i]]
    }
    reagents_array=[...reagents_array, reagArray]

    // set max nr of replicates using random
    replicates.push(Math.floor(Math.random()*MAX_NR_REPLICANTS) + 1)
}/*

samples_array =
[
  [
    "Sam-44",
    "Sam-24"
  ],
  [
    "Sam-61",
    "Sam-29",
    "Sam-91",
    "Sam-32",
    "Sam-2"
  ],
  [
    "Sam-42",
    "Sam-93"
  ],
  [
    "Sam-40",
    "Sam-77",
    "Sam-93",
    "Sam-67",
    "Sam-8"
  ],
  [
    "Sam-58",
    "Sam-42",
    "Sam-52",
    "Sam-31",
    "Sam-41"
  ]
]
  
reagents_array= 
[
  [
    "Reag-63",
    "Reag-20",
    "Reag-92",
    "Reag-61"
  ],
  [
    "Reag-77",
    "Reag-6",
    "Reag-24"
  ],
  [
    "Reag-37",
    "Reag-74",
    "Reag-52",
    "Reag-96",
    "Reag-30",
    "Reag-17",
    "Reag-69"
  ],
  [
    "Reag-68",
    "Reag-80",
    "Reag-50",
    "Reag-71",
    "Reag-87",
    "Reag-74",
    "Reag-49"
  ],
  [
    "Reag-77",
    "Reag-50",
    "Reag-80",
    "Reag-62"
  ]
]
replicates =
[
  1,
  2,
  5,
  5,
  1
]
*/
