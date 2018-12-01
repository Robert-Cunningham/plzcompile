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

let socketList = {}

//setInterval(() => console.log(socketList), 500)

io.on('connection', socket => {
    console.log('someone connected')
    let UUID = JSON.stringify(Math.round(Math.random() * 100000000)) + ""
    socketList[UUID] = {socket: socket}

    socket.on('identify', (name) => {
        console.log('identified as', name)
        socketList[UUID].name = name
    })

    socket.on('join room', (roomID) => {
        roomID = roomID + ""
        console.log(socketList[UUID].name, 'joined', roomID)
        if (socketList[UUID].roomID) {
            socketList[UUID].socket.leave(roomID)
        }
        socketList[UUID].roomID = roomID
        io.in(roomID).emit("new player", {name: socketList[UUID].name})

        socketList[UUID].socket.join(roomID)

        Object.keys(socketList).map(uuid => { //update the recent connectee's list
            let s = socketList[uuid]
            if (s.roomID === roomID && uuid !== UUID) {
                socket.emit("new player", {name: s.name})
            }
        })
    })


    socket.on('ready', () => {
        let room = socketList[UUID].roomID
        io.in(room).emit('go')
    })

    socket.on('done', () => {
        let room = socketList[UUID].roomID
        io.in(room).emit('stop')
    })

    socket.on('yo dawg', () => {
        console.log('sup')
    })
})

http.listen(8080, () => {
    console.log("Server live.")
})