const express = require('express')
const app = express()
const cors = require('cors')
const port = 4000
const tf = require('@tensorflow/tfjs')

function runTF() {
    // Create a new model
    const model = tf.sequential();

    // Create a new (middle) layer with 4 nodes,
    // accepting inputs from 2 input nodes
    const hidden = tf.layers.dense({
        units: 4,
        inputShape: [2],
        activation: 'sigmoid'
    })
    // Add layer to model
    model.add(hidden)

    // Create a new (output) layer with 3 nodes,
    // accepting inputs from 4 inout nodes (implied)
    const output = tf.layers.dense({
        units: 1,
        activation: 'sigmoid'
    })
    // Add layer to model
    model.add(output)

    // Define how strongly model reacts to input data?
    const sgdOpt = tf.train.sgd(0.1);
    // Compile model
    model.compile({
        optimizer: sgdOpt,
        loss: tf.losses.meanSquaredError
    })

    const t_inputs = tf.tensor2d([
        [0, 0],
        [0.5, 0.5],
        [1, 1]
    ])

    const t_outputs = tf.tensor2d([
        [1],
        [0.5],
        [0]
    ])

    async function trainModel() {
        for (let i = 0; i < 100; i++) {
            const response = await model.fit(t_inputs, t_outputs);
            console.log(response.history.loss);
        }
    }

    trainModel().then(() => {

    })

}

app.get('/', (req, res) => {
    runTF()
    return res.send({ text: 'Hello World!' })
})
app.use(cors())
app.listen(port, () => console.log(`Example app listening on port ${port}!`))




function university() {
    const expectations = 99;
    return Math.floor(
        expectations / 100
    );
}