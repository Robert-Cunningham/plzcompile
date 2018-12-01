import React, { Component } from 'react';
import './App.css';
import Editor from './Editor'
import JoinGame from './JoinGame'
import openSocket from 'socket.io-client'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      socket: openSocket('localhost:8080')
    }
  }

  componentDidMount() {
    //s.emit('yo dawg')
  }

  render() {
    return (
      <div>
        <JoinGame socket={this.state.socket}/>
        <Editor />
      </div>
    );
  }
}

export default App;
