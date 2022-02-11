import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

const itemSource = {
  beginDrag(props) {
    //console.log('dragging');
    return props.item;
  },
  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }

    return props.handleDrop(props.item);
  }
}


function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

class Item extends Component {
  render() {
    const { isDragging, connectDragSource, item } = this.props;
    const opacity = isDragging ? 0.5 : 1;

    return connectDragSource(
          // <button className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textSizeSmall MuiButton-sizeSmall" 
          // type="button" style={{textTransform: 'none',width:'100%',opacity}}>
          //   <span className="MuiButton-label">{item.name}</span>
          //   <span className="MuiTouchRipple-root"></span>
          // </button>

      <div className="palette" style={{backgroundColor: 'white', opacity}}>
          {/* <label>{item.name}</label> */}
          <span className="MuiButton-label">{item.name}</span>
      </div>

        // <button style={{width: 175, padding: 5, marginLeft: 10, opacity}}>
        //     {item.name}
        // </button>
    )
  }
}

export default DragSource('item', itemSource, collect)(Item);
