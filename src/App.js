import React, { Component } from 'react';
import './App.css';
import Editor from './Editor'
import JoinGame from './JoinGame'
import openSocket from 'socket.io-client'
import GameOverDialog from './GameOverDialog'
import {challenges} from './Challenges'
import InstructionsDialog from './Instructions'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      socket: openSocket('localhost:8080'),
      state: "setup",
      won: false,
      challengeID: 0,
    }
  }

  componentDidMount() {
    this.state.socket.on('go', (data) => {
      console.log('go info', data)
      this.setState({state: "instructions", challengeID: data})
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
        {this.state.state == 'playing' && <Editor onSolve={this.onSolve} challenge={challenges[this.state.challengeID]}/>}
        <GameOverDialog done={this.state.state === 'done'} won={this.state.won} resetGame={this.resetGame}/>
        {this.state.state === 'instructions' && <InstructionsDialog active={this.state.state === 'instructions'} challenge={challenges[this.state.challengeID]} startGame={() => this.setState({state: "playing"})}/>}
      </div>
    );
  }
}

export default App;
