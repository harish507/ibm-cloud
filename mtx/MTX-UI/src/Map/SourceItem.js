import React, { Component } from 'react'
import { DragSource } from 'react-dnd'

const itemSource = {
	beginDrag (props) {
		return props.item
	},
	endDrag (props, monitor, component) {
		//console.log(monitor, component)
		if (!monitor.didDrop()) {
			return
		}

		return props.handleDrop(props.item)
	}
}

function collect (connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging()
	}
}

class SourceItem extends Component {
	render () {
		const { connectDragSource, item, editMatch } = this.props //isDragging
		// const opacity = isDragging ? 0.5 : 1

		return item.type && editMatch ? (
			connectDragSource(
				<div className='source-item'>
					<div style={{ width: item.level * 20 }} />
					<div>{item.name}</div>
				</div>
			)
		) : (
			<div
				className='source-item-disabled'
				style={{ backgroundColor: item.ind === 0 ? 'lightYellow' : editMatch ? '#eee' : 'white' }}
			>
				<div style={{ width: item.level * 20 }} />
				<div>{item.name}</div>
			</div>
		)
	}
}

export default DragSource('item', itemSource, collect)(SourceItem)
