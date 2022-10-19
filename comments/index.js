const express = require('express')
const bodyParse = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const app = express()
const axios = require('axios')

app.use(bodyParse.json())
app.use(cors())
const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
    return res.send(commentsByPostId[req.params.id] || []) 
})

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex')
    const { content } = req.body

    const comments = commentsByPostId[req.params.id] || []

    comments.push({id: commentId, content})

    commentsByPostId[req.params.id] = comments
    
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id
        }
    })

    return res.status(201).send(comments)
})

app.listen(4001, () => console.log('comments listening in 4001'))