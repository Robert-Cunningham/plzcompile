import React from 'react'
import {Dialog, DialogTitle, TextField, DialogActions, Button, DialogContent, CircularProgress, LinearProgress} from '@material-ui/core'

class Instructions extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }

        this.duration = 15000

    }

    componentDidMount() {
        setTimeout(() => {
            //this.props.startGame()
        }, (this.duration));
        this.setState({start: new Date().getTime()})

        this.tick = setInterval(() => this.forceUpdate(), 30)
    }

    componentWillUnmount = () => {
        clearInterval(this.tick)
    }

    render() {
        let pct = (new Date().getTime() - this.state.start) / this.duration * 100
        let audioLive = this.duration - (new Date().getTime() - this.state.start) < 5000
        return (
            <div>
                <Dialog open={this.props.active}>
                    <DialogTitle>
                        Welcome to Plz Compile. 
                    </DialogTitle>
                    <DialogContent>
                        You're playing gamemode "Zero Infinite Loop."

                        Your challenge is as follows:
                        {this.props.challenge.instructions}

                        Examples:
                        <ol>
                            {this.props.challenge.tests.slice(0, this.props.challenge.examples).map(e => (
                                <li key={e.input}>{e.input} => {e.output}</li>
                            ))}
                        </ol>
                        {audioLive && <audio src="mario.mp3" autoPlay onEnded={this.props.startGame}/>}
                        <LinearProgress variant="determinate" value={pct}/>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default Instructions