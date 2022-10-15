const express = require('express')
const bodyParse = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')

const app = express()
app.use(bodyParse.json())
app.use(cors())
//mock dat
const posts = {};

app.get('/posts', (req, res) => {
    return res.send(posts)
})

app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex')
    const { title } = req.body

    posts[id] = {
        id,
        title
    }
    return res.status(201).send(posts[id])
})

app.listen(4000, () => console.log("listening on 4000"))