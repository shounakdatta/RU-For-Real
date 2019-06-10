const express = require('express')
const app = express()
const cors = require('cors')
const port = 4000
const tf = require('@tensorflow/tfjs-node')
const use = require('@tensorflow-models/universal-sentence-encoder')
const afinn = require('./AFINN/AFINN-111.json')

let t_inputs = [
    'Trump fires Comey - is he insane?',
    'Donald Trump fires Comey - justice department in jeopardy!',
    'Trump saves the world again!'
]

const input = 'Trump is a great president!'

const init = async () => {
    const model = await use.load()
    t_inputs.push(input)
    const size = t_inputs.length
    const embeddings = await model.embed(t_inputs)
    let scores = [...Array(size)].map(e => Array(size))
    const sentiments = () => {
        return t_inputs.map(text => {
            const words = text.split(/\W/)
            let score = 0;
            words.forEach(word => {
                if (afinn[word]) {
                    score += Number(afinn[word])
                }
            });
            return score / words.length;
        })
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const sentenceI = embeddings.slice([i, 0], [1])
            const sentenceJ = embeddings.slice([j, 0], [1])
            const sentenceITranspose = false
            const sentenceJTranspose = true
            score =
                sentenceI.matMul(sentenceJ, sentenceITranspose, sentenceJTranspose)
                    .dataSync()
            scores[i, j] = score['0']
        }
    }

    const sentimentResults = sentiments()
    const inputScore = scores[scores.length - 1]
    const inputSent = sentimentResults[sentimentResults.length - 1]
    const matchingArticles = scores.splice(0, scores.length - 1)
        .map((score, index) => ({ score, sentiment: sentimentResults[index], text: t_inputs[index] }))
        .sort((a, b) => {
            const { score: scoreA, sentiment: sentA } = a
            const { score: scoreB, sentiment: sentB } = b
            const scoreDiffA = scoreA - inputScore
            const scoreDiffB = scoreB - inputScore
            const sentDiffA = sentA - inputSent
            const sentDiffB = sentB - inputSent

            if (Math.abs(scoreDiffA) >= Math.abs(scoreDiffB)) {
                if (Math.abs(sentDiffA) <= Math.abs(sentDiffB)) {
                    return -1
                }
                if (
                    Math.abs(sentDiffA) > Math.abs(sentDiffB) &&
                    Math.abs(Math.abs(sentDiffA) - Math.abs(sentDiffB)) <= 0.2
                ) {
                    return -1
                }
            }
            return 1
        })
    console.dir(matchingArticles)
    console.dir({ inputScore, inputSentiment: inputSent, text: input })
}

init()
// console.log(sentiments(t_inputs));
