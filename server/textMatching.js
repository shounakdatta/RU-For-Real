const express = require('express')
const app = express()
const cors = require('cors')
const port = 4000
const tf = require('@tensorflow/tfjs-node')
const use = require('@tensorflow-models/universal-sentence-encoder')

let t_inputs = [
    'Trump fires Comey',
    'Donald Trump fires Comey',
    'I like milk'
]

const input = 'Trump is innocent'

const init = async () => {
    const model = await use.load()
    t_inputs.push(input)
    const size = t_inputs.length
    const embeddings = await model.embed(t_inputs)
    let scores = [...Array(size)].map(e => Array(size))

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const sentenceI = embeddings.slice([i, 0], [1]);
            const sentenceJ = embeddings.slice([j, 0], [1]);
            const sentenceITranspose = false;
            const sentenceJTranspose = true;
            score =
                sentenceI.matMul(sentenceJ, sentenceITranspose, sentenceJTranspose)
                    .dataSync();
            scores[i, j] = score['0']
        }
    }
    console.dir(scores);

}

init()
