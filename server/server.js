const express = require('express')
const bodyparser = require('body-parser')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/dank', (req, res) => {
    res.send('meme, bro')
})

app.post('/identify', (req, res) => {
    
})

io.on('connection', socket => {
    console.log('someone connected')

    socket.on('identify', (name) => {
        console.log('identified as', name)
        socket.name = name
    })

    socket.on('join room', (roomID) => {
        console.log(socket.name, 'joined', roomID)
        if (socket.roomID) {
            socket.leave(roomID)
        }
        socket.roomID = roomID
        socket.join(JSON.stringify(roomID))

        socket.in(roomID).emit("new player", {name: socket.name})
    })

    socket.on('yo dawg', () => {
        console.log('sup')
    })
})

http.listen(8080, () => {
    console.log("Server live.")
})