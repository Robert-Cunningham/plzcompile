import React from 'react'
import {Dialog, DialogTitle, TextField, DialogActions, Button, DialogContent} from '@material-ui/core'

class JoinGame extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            mode: "name",
            room: Math.round(Math.random() * 100),
            peers: [],
            roomSelection: ""
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
                        <TextField label="Name" placeholder="Pepe" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})}></TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.onSelectName}>Next</Button>
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


    renderRooms() {
        return (
            <div>
                <Dialog open={this.state.mode === 'room'}>
                    <DialogTitle>Join a room</DialogTitle>
                    <DialogContent>
                        <div>
                            Have somebody else join your room: {this.state.room} <br></br><br></br>
                        </div>
                        <div>
                            Or join someone else's room: 
                            <TextField value={this.state.roomSelection} onChange={(e) => this.setState({roomSelection: e.target.value})}></TextField>
                            <Button onClick={() => this.joinRoom(this.state.roomSelection)}>Join</Button>
                        </div>
                        People who you're about to wreck:
                        <ul>
                            {this.state.peers.map((p, i) => <li key={i}>{p.name}</li>)}
                        </ul>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.onReady} disabled={this.state.peers.length === 0}>Ready</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    render() {
        if (this.props.state !== "setup") {
            return null
        }
        return (
            <div>
                {this.renderName()}
                {this.renderRooms()}
                <Button onClick={() => this.setState({mode: "room"})}>Pick a room</Button>
            </div>
        )
    }
}

export default JoinGame