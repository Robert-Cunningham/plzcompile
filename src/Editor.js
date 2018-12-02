import React from 'react'
import AceEditor from 'react-ace'
import brace from 'brace';
import {judgeSubmission, challenges, leadingComment} from './Challenges'
import {Dialog, DialogTitle, TextField, DialogActions, Button, DialogContent, CircularProgress, LinearProgress} from '@material-ui/core'

import 'brace/mode/javascript'
import 'brace/theme/monokai'

class Editor extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: leadingComment(props.challenge) + props.challenge.initial,
            result: undefined
        }
    }

    onChange = (newValue) => {
        this.setState({value: newValue})
    }

    componentDidMount() {
    }

    onClickDone = () => {
        let result = judgeSubmission(this.state.value, this.props.challenge)
        console.log(result)
        if (result.passed) {
            this.props.onSolve()
        } else {
            this.setState({result: result})
        }
    }

    render() {
        return (
            <div className="editor-container">
                <AceEditor
                    theme="monokai"
                    mode="javascript"
                    onChange={this.onChange}
                    name="UNIQUE_DIV"
                    value={this.state.value}
                    fontSize={28}
                    width={1000}
                    height={700}
                />
                <Button variant="outlined" onClick={this.onClickDone} >Submit!</Button>
                <FailedToCompile result={this.state.result} onClose={() => this.setState({result: undefined})}/>
            </div>
        )
    }
}

const FailedToCompile = (props) => (
    <Dialog onClose={props.onClose} open={Boolean(props.result)}>
        <DialogTitle>
            Failed.
        </DialogTitle>
        <DialogContent>
            <div className="error-container">
                <div className="exception-text">
                    {props.result && props.result.message}
                </div>
                <img className="facepalm" src='https://ballzbeatz.com/wp-content/uploads/2018/01/Meme-s-Facepalm-Meme-Decal.jpg' width={300} height={300} />
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>OK</Button>
        </DialogActions>
    </Dialog>
)

export default Editor