const express = require('express')
const bodyParse = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(bodyParse.json())
app.use(cors())
//mock dat
const posts = {};

app.get('/posts', (req, res) => {
    return res.send(posts)
})

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex')
    const { title } = req.body

    posts[id] = {
        id,
        title
    }
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    }).catch(e => console.log(e))
    return res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {
    console.log("Event received: ", req.body.type)
    return res.send({})
})

app.listen(4000, () => console.log("listening on 4000"))