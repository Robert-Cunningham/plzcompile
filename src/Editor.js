import React from 'react'
import AceEditor from 'react-ace'
import brace from 'brace';
import {judgeSubmission, challenges} from './Challenges'
import {Button} from '@material-ui/core'

import 'brace/mode/javascript'
import 'brace/theme/monokai'

class Editor extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: ""
        }
    }

    onChange = (newValue) => {
        this.setState({value: newValue})
    }

    componentDidMount() {
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
                <Button onClick={() => (judgeSubmission(this.state.value, challenges[0]))} >Test!</Button>
            </div>
        )
    }
}

export default Editor