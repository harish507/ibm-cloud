/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'
// import TargetItem from './TargetItem'
import Card from './Card';

const itemTarget = {
  drop(props, monitor, component) {
    //console.log(monitor)
    if (!monitor.didDrop()) {
      return;
    }
    
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    item: monitor.getItem(),
  }
}

class Target extends Component {
state ={
  x: 0,
  y: 0,
  dragIndex: null,
  hoverIndex: null,
}
  _onMouseUp = e => {
    //alert(e.screenX)
}
_onMouseMove = e => {
  //this.setState({ x: e.screenX, y: e.screenY });
  }
  markNodes = (dragIndex, hoverIndex) => {
    this.setState({dragIndex, hoverIndex})
    //console.log(dragIndex + " - " + hoverIndex)
  }
  processMove = () => {
    //console.log(this.state.dragIndex + " - " + this.state.hoverIndex)
    this.props.moveNode(this.state.dragIndex,this.state.hoverIndex)
    // const { dragIndex,hoverIndex } = this.state
    // let {nodes} = this.props
    //const dragNode = nodes[dragIndex]
    //nodes.splice(hoverIndex, 0, nodes.splice(dragIndex, 1)[0]);
  }

  render() {
    // const { x, y } = this.state;
    const { connectDropTarget, hovered, nodes,removeNode } = this.props
    const backgroundColor = hovered ? 'gray' : 'white'

    return connectDropTarget(
      <div onMouseUp={this._onMouseUp} onMouseMove={this._onMouseMove}
        className="target" style={{ background: backgroundColor }}>
          {/* <h4 style={{color: 'black'}}>Mouse coordinates: { x } { y }</h4> */}
          
          {nodes.map((node,ind) => {
                return <Card
                  key={ind}
                  index={ind}
                  id={ind}
                  markNodes={this.markNodes}
                  processMove={this.processMove}
                  node={node}
                  removeNode={() => removeNode(ind)}
                />
          })}

      </div>
    )
  }
}

export default DropTarget('item', itemTarget, collect)(Target)
