import React from 'react'
import {Dialog, DialogTitle, TextField, DialogActions, Button, DialogContent, LinearProgress} from '@material-ui/core'
const randomWords = require('random-words')

class JoinGame extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            mode: "name",
            room: Math.round(Math.random() * 0),
            peers: [],
            roomSelection: "",
        }
    }

    componentDidMount() {
        this.props.socket.on('new player', (name) => {
            this.setState(prev => ({peers: prev.peers.concat(name)}))
            console.log('got new player', name)
        })
    }

    renderName() {
        return (
            <div>
                <Dialog open={this.state.mode === 'name'}>
                    <DialogTitle>Who dis?</DialogTitle>
                    <DialogContent>
                        <TextField label="Nickname" placeholder="Pepe" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}></TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button disabled={this.state.name.length === 0} onClick={this.onSelectName}>Next</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    onSelectName = (name) => {
        this.props.socket.emit('identify', this.state.name)
        this.setState({mode: 'room'})
        this.joinRoom(this.state.room)
    }

    joinRoom = (room) => {
        this.setState({
            room: room,
            roomSelection: "",
            peers: []
        }, () => {
            console.log('joined room')
            this.props.socket.emit('join room', room)
        })
    }

    onReady = () => {
        this.props.onWaiting()
        this.props.onReady()
    }


    renderRooms() {
        return (
            <div>
                <Dialog open={this.state.mode === 'room'}>
                    <DialogTitle>Join a room</DialogTitle>
                    <DialogContent>
                        <div className="join-room-container">
                            <div className="room-id">
                                <div className="room-id">{this.state.room}</div>
                                <div className="room-id-text">Your room</div>
                            </div>

                            <div className="room-switcher-container">
                                <TextField variant="outlined" placeholder="54" label="Join another room" value={this.state.roomSelection} onChange={(e) => this.setState({roomSelection: e.target.value})}></TextField>
                                <Button variant="outlined" onClick={() => this.joinRoom(this.state.roomSelection)}>Join</Button>
                            </div>

                            <div className="others-in-room-container">
                            <div className="others-in-room-header">
                                    In this room:
                            </div>
                                <ul>
                                    {this.state.peers.map((p, i) => <li key={i}>{p.name}</li>)}
                                </ul>
                            </div>

                            {this.props.waiting && "Waiting for other players to ready up."}
                            {this.props.waiting && <LinearProgress />}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.onReady} disabled={this.state.peers.length === 0}>Ready</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    render() {
        if (this.props.state !== "setup" && this.props.state !== 'waiting') {
            return null
        }
        return (
            <div>
                {this.renderName()}
                {this.renderRooms()}
            </div>
        )
    }
}

export default JoinGame