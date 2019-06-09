const express = require('express')
const app = express()
const cors = require('cors')
const port = 4000
const tf = require('@tensorflow/tfjs')
const use = require('@tensorflow-models/universal-sentence-encoder')

const t_inputs = [
    'Trump fires Comey',
    'Donald Trump fires Comey',
    'Trump fires James Comey',
    'Donald Trump fires James Comey',
    'Comey fires Trump',
    'James Comey fires Trump',
    'Comey fires Donald Trump',
    'James Comey fires Donald Trump',
]

const input = 'Trump fires Comey'

app.get('/', async (req, res) => {
    const model = await use.load()
    const embeddings = await model.embed(t_inputs)
    let score;
    for (let i = 0; i < t_inputs.length; i++) {
        const sentenceI = embeddings.slice([i, 0], [1]);
        const sentenceJ = embeddings.slice([j, 0], [1]);
        // const sentenceITranspose = false;
        // const sentenceJTranspose = true;
        // score =
        //     sentenceI.matMul(sentenceJ, sentenceITranspose, sentenceJTranspose)
        //         .dataSync();
    }
    // console.log(score);

    return res.send({ data: "TEST" })
})

app.use(cors())
app.listen(port, () => console.log(`Example app listening on port ${port}!`))