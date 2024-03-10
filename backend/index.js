const cors = require('cors')
const express = require('express')
const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json('running on ')
})


app.listen(port, () => console.log('running on ', port))