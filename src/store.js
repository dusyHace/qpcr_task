export let samples_array = []
export let reagents_array = []
export let replicates = []

let samples = []
let reagents = []

for (let i = 0; i < 200; i++) {
    samples.push('Sam-' + (i+1))
    reagents.push('Reag-' + (i+1))
}

let nr_test = 11//Math.floor(Math.random()*10+1)

for (let i = 0; i < nr_test; i++) {   
    let arr = Array(100).fill(0).map((e,i)=>i+1)

    function shuffle (array)  {
        return array.sort(() => Math.random() - 0.5);
    }

    let length_exp = Math.floor(Math.random()*5) + 1

    shuffle(arr)
    let sampleArray = []
    for (let i = 0; i < length_exp; i++) {
        sampleArray=[...sampleArray, samples[arr[i]]]
    }
    samples_array=[...samples_array, sampleArray]

   
    length_exp = 1//Math.floor(Math.random()*10) + 1

    shuffle(arr)
    let reagArray = []
    for (let i = 0; i < length_exp; i++) {
        reagArray=[...reagArray, reagents[arr[i]]]
    }
    reagents_array=[...reagents_array, reagArray]

    replicates.push(Math.floor(Math.random()*6) + 1)
}