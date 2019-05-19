const express = require('express')
const app = express()
const cors = require('cors')
const port = 4000
const tf = require('@tensorflow/tfjs')
const use = require('@tensorflow-models/universal-sentence-encoder')

let modelBuilt = false;

let t_inputs = [
    'Trump fires Comey',
    'Donald Trump fires Comey',
    'Trump fires James Comey',
    'Donald Trump fires James Comey',
    'Comey fires Trump',
    'James Comey fires Trump',
    'Comey fires Donald Trump',
    'James Comey fires Donald Trump',
]

let t_outputs = [
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0
]

async function tokenizeInputString() {
    for (let i = 0; i < t_inputs.length; i++) {
        const text = t_inputs[i]
        const tokenizer = await use.loadTokenizer()
        const tokenizedArray = (await tokenizer.encode(text)).map(num => [num])

        t_inputs[i] = tokenizedArray;
        let outputs = [];
        for (let j = 0; j < tokenizedArray.length; j++)
            outputs.push([t_outputs[i]])
        t_outputs[i] = outputs;
    }

}


const model = tf.sequential();

const hidden = tf.layers.dense({
    units: 4,
    inputShape: [1],
    activation: 'sigmoid'
})
model.add(hidden)

const output = tf.layers.dense({
    units: 1,
    activation: 'sigmoid'
})
model.add(output)

const sgdOpt = tf.train.sgd(0.25);
model.compile({
    optimizer: sgdOpt,
    loss: tf.losses.meanSquaredError
})

async function buildModel() {
    async function trainModel() {
        for (let i = 0; i < t_inputs.length; i++) {
            const inputsArray = t_inputs[i];
            const outputsArray = t_outputs[i];
            t_inputs[i] = tf.tensor2d(inputsArray);
            t_outputs[i] = tf.tensor2d(outputsArray);
            console.log('t_input: ', t_inputs[i]);
            console.log('t_output: ', t_outputs[i]);

            const response = await model.fit(t_inputs[i], t_outputs[i]);
        }
    }

    await trainModel();
}

const input = 'Trump fires Comey'

async function useModel() {
    const tokenizer = await use.loadTokenizer()
    const tokenizedArray = (await tokenizer.encode(input)).map(num => [num])
    console.log('Input: ', tokenizedArray);

    let output = await model.predict(tokenizedArray);
    return Array.from(output.dataSync());
}

app.get('/', async (req, res) => {
    // if (!modelBuilt) {
    //     await buildModel()
    //     modelBuilt = true;
    // }
    // const data = await useModel()

    await tokenizeInputString();

    await buildModel()
    // const data = await useModel()


    return res.send({ data: 'test' })
})
app.use(cors())
app.listen(port, () => console.log(`Example app listening on port ${port}!`))