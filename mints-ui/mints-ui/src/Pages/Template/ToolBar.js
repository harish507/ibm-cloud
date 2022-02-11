import React, { Component } from 'react'
import Item from './Item'

class ToolBar extends Component {

    state = {
        palettes: [],
    }

    componentWillReceiveProps(props,state) {
        //console.log(props.palettes)
        this.setState({palettes: props.palettes})
    }

    
    render() {
        
        return (
            <div className="template">
                {this.state.palettes && Object.keys(this.state.palettes).length > 0 && <div>
                {Object.keys(this.state.palettes).map((key,ind) => {
                    return  <React.Fragment key={ind}>
                        <div className="palette-group">
                            <div className="palette-group-header color-light">{key}</div>
                            <div className="palette-group-content" >
                                {this.state.palettes[key].map((item, index) => (
                                    <Item key={index}  item={item} handleDrop={(node) => this.props.processItem(node)} />
                                ))}
                            </div>
                        </div>
                    </React.Fragment>
                    })}

                </div>}
            </div>
        )
    }
}

export default ToolBar