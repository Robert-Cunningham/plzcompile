import React from 'react'
import AceEditor from 'react-ace'
import brace from 'brace';

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
        try {
            console.log(eval(newValue))
        } catch (e) {
            console.log('error')
        }
    }

    render() {
        return (
            <div>
                <AceEditor
                    theme="monokai"
                    mode="javascript"
                    onChange={this.onChange}
                    name="UNIQUE_DIV"
                    value={this.state.value}
                />
            </div>
        )
    }
}

export default Editor