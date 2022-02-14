/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
// import { Button } from '@material-ui/core'
// import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'

const itemTarget = {
	drop (props, monitor, component) {
		props.setTrg(props.ind)
		if (!monitor.didDrop()) {
			return
		}
	}
}

function collect (connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		hovered: monitor.isOver(),
		item: monitor.getItem()
	}
}

class TargetItem extends Component {
	render () {
		const { connectDropTarget, hovered, node, removeMatch, editMatch } = this.props
		const backgroundColor = hovered ? 'orange' : 'white'

		return node.type && editMatch ? (
			connectDropTarget(
				<div className='target-item' style={{ background: backgroundColor }}>
					{/* {removeMatch && (
						<div style={{ width: 40, paddingTop: 5 }}>
							{node.label && (
								<a
									style={{ textDecoration: 'none', color: 'black' }}
									href='#remove'
									onClick={() => removeMatch(ind)}
								>
									<FunctionsIcon />
								</a>
							)}
						</div>
					)} */}
					{editMatch && (
						<div style={{ width: 40, paddingTop: 5 }}>
							{/* {node.label && ( */}
							<a
								style={{ textDecoration: 'none', color: 'black' }}
								href='#remove'
								onClick={() => editMatch(node)}
							>
								<EditIcon />
							</a>
							{/* )} */}
						</div>
					)}
					<div style={{ width: node.level * 30 }} />
					<div style={{ flex: 4 }}>{node.name}</div>
					{/* <div style={{ flex: 3 }}>{node.label}</div> */}
				</div>
			)
		) : (
			<div
				className='target-item-disabled'
				style={{ backgroundColor: node.ind === 0 ? 'lightGreen' : editMatch ? '#eee' : 'white' }}
			>
				{removeMatch && <div style={{ width: 40 }} />}
				<div style={{ width: node.level * 30 }} />
				<div style={{ flex: 4 }}>{node.name}</div>
				{/* <div style={{ flex: 1 }}>{node.value && '[ ' + node.value + ' ]'}</div> */}
			</div>
		)
	}
}

export default DropTarget('item', itemTarget, collect)(TargetItem)
