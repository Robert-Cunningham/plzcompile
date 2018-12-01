const express = require('express')
const bodyparser = require('body-parser')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')

const prod = process.env.NODE_ENV === 'production'

app.get('/dank', (req, res) => {
    res.send('meme, bro')
})

app.post('/identify', (req, res) => {
    
})

app.use(express.static(path.resolve(__dirname + '/../build')))

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

    getOtherPlayersInRoom = (roomID) => {
        let out = []
        Object.keys(socketList).map(uuid => { //update the recent connectee's list
            let s = socketList[uuid]
            if (s.roomID === roomID && uuid !== UUID) {
                out.push(uuid)
            }
        })

        return out
    }

    getAllPlayersInRoom = roomID => {
        if (socketList[UUID].roomID === roomID) {
            return getOtherPlayersInRoom(roomID).concat(UUID)
        } else {
            return getOtherPlayersInRoom(roomID)
        }
    }

    socket.on('ready', () => {

        console.log(socketList[UUID].name, 'is ready')

        let roomID = socketList[UUID].roomID
        socketList[UUID].ready = 'true'
        let others = getOtherPlayersInRoom(roomID)

        for (let i = 0; i < others.length; i++) {
            if (socketList[others[i]].ready !== 'true') {
                return
            }
        }

        io.in(roomID).emit('go', Math.floor(Math.random()*2))
    })

    socket.on('done', () => {
        let roomID = socketList[UUID].roomID
        let others = getAllPlayersInRoom(roomID)

        for (let i = 0; i < others.length; i++) {
            socketList[others[i]].ready = 'false'
        }

        io.in(roomID).emit('stop')
    })

    socket.on('yo dawg', () => {
        console.log('sup')
    })
})

http.listen(prod ? 80 : 8080, () => {
    console.log("Server live.")
    if (prod) {
        console.log("In production.")
    }
})