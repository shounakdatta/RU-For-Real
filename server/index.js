const express = require('express')
const app = express()
const cors = require('cors')
const port = 4000

app.get('/', async (req, res) => {
    return res.send(`
        Welcome to the the backend of this app!
        Instead of running index.js, try executing
        "node textMatching" to see how text topic matching works!
    `)
})

app.use(cors())
app.listen(port, () => console.log(`Example app listening on port ${port}!`))