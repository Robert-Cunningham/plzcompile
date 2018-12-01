import React from 'react'
import { DialogTitle, DialogActions, Dialog, Button, DialogContent } from '@material-ui/core';

class GameOverDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render () {
        return (
            <Dialog open={this.props.done} onClose={this.props.resetGame}>
                <DialogTitle>Game over</DialogTitle>
                <DialogContent>
                    {this.props.won ? "Congratulations, you win!!" : "RIP, you lose."}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.resetGame}>Done</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default GameOverDialog