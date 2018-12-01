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

        this.joinRoom(this.state.room)

    }

    componentDidMount() {
        this.props.socket.on('new player', (name) => {
            this.setState(prev => ({peers: prev.peers.concat(name)}))
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
                        <Button onClick={() => {this.props.socket.emit('identify', this.state.name); this.setState({mode: 'room'})}}>Next</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    joinRoom = (room) => {
        this.props.socket.emit('join room', room)
    }

    renderRooms() {
        return (
            <div>
                <Dialog onClose={() => this.setState({mode: 'closed'})} open={this.state.mode === 'room'}>
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
                            {this.state.peers.map(p => <li>{p.name}</li>)}
                        </ul>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({mode: 'closed'})}>Done</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    render() {
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