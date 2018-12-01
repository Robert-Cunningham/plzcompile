import React, { Component } from 'react';
import './App.css';
import Editor from './Editor'
import JoinGame from './JoinGame'
import openSocket from 'socket.io-client'
import GameOverDialog from './GameOverDialog'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      socket: openSocket('localhost:8080'),
      state: "setup",
      won: false
    }
  }

  componentDidMount() {
    this.state.socket.on('go', () => {
      this.setState({state: "playing"})
    })

    this.state.socket.on('stop', () => {
      this.setState({state: "done"})
    })
  }

  onSolve = () => {
    this.setState({won: true}, () => {
      this.state.socket.emit("done")
    })
  }


  onReady = () => {
    this.state.socket.emit("ready")
  }

  resetGame = () => {
    this.setState({
      won: false,
      state: "setup"
    })
  }

  render() {
    return (
      <div>
        {this.state.socket && <JoinGame state={this.state.state} onReady={this.onReady} socket={this.state.socket}/>}
        <Editor onSolve={this.onSolve}/>
        <GameOverDialog done={this.state.state === 'done'} won={this.state.won} resetGame={this.resetGame}/>
      </div>
    );
  }
}

export default App;
