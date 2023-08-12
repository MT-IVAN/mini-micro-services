const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())

const events = []

app.post('/events', (req, res) => {
    const event = req.body

    events.push(event)
    
    axios.post('http://localhost:4000/events', event).catch(e => console.log(e))
    axios.post('http://localhost:4001/events', event).catch(e => console.log(e))
    axios.post('http://localhost:4002/events', event).catch(e => console.log(e))
    axios.post('http://localhost:4003/events', event).catch(e => console.log(e))

    return res.send({status: 'Ok'})

})

app.get('/events', (req, res) => {
    return res.send(events)
})

app.listen(4005, () => console.log('bus running on port 4005'))