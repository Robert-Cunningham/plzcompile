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

let roomProblemIndex = {}

const problemCount = 6

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

    socket.on('disconnect', () => {
        delete socketList[UUID]
    })

    getOtherPlayersInRoom = (roomID) => {
        console.log('getting other players in room from perspective of ', UUID)
        let out = []
        Object.keys(socketList).map(uuid => { //update the recent connectee's list
            let s = socketList[uuid]
            if (s.roomID === roomID && uuid !== UUID) {
                out.push(uuid)
            }
        })
        console.log('returning ', out)

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
        let others = getAllPlayersInRoom(roomID)

        for (let i = 0; i < others.length; i++) {
            console.log(socketList[others[i]].name, 'has ready state', socketList[others[i]].ready)
            if (socketList[others[i]].ready !== 'true') {
                return
            }
        }

        if (!roomProblemIndex[roomID]) {
            roomProblemIndex[roomID] = -1
        }

        roomProblemIndex[roomID] = (roomProblemIndex[roomID] + 1) % problemCount

        io.in(roomID).emit('go', roomProblemIndex[roomID])
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