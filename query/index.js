const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {}

function handleEvent(type, data) {

    if (type === 'PostCreated') {
        const { id, title } = data
        posts[id] =  {
            id,
            title,
            comments: []
        }

    } else if (type === 'CommentCreated') {
        const { id, content, postId, status } = data
        const post = posts[postId]
        post.comments.push({
            id, content, status
        })
    } else if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data
        const post = posts[postId]
        const comment = post.comments.find(comment => {
            return comment.id === id
        })
        comment.status = status
        comment.content = content
    }

}

app.get('/posts', (req, res) => {
    return res.send(posts)
})
app.post('/events', (req, res) => {
    const { type, data } = req.body

    handleEvent(type, data)
    
    console.log(posts)

    return res.status(200)
})

app.listen(4002, async () => {
    console.log('query running in 4002')

    try {
        const events = await axios.get('http://localhost:4005/events')

        for (let event of events.data) {
            console.log('Processing event:', event.type)
            handleEvent(event.type, event.data)
        }
    } catch (err) {
        console.log(err.message)
    }
})