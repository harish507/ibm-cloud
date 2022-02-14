import React, { Component } from 'react'

class OutputItem extends Component {
	render () {
		const { node, output } = this.props

		return node.type ? (
			<div className='output-item'>
				<div style={{ width: node.level * 20 }} />
				{output && <div style={{ flex: 3, textAlign: 'right' }}>{node.sourceUp}</div>}
				{output && <div style={{ flex: 1, textAlign: 'center' }}>{'----->'}</div>}
				{output && <div style={{ flex: 3 }}>{node.parentUp}</div>}
			</div>
		) : (
			<div className='target-item-disabled'>
				<div style={{ width: node.level * 20 }} />
				<div style={{ flex: 1 }}>{node.name}</div>
			</div>
		)
	}
}

export default OutputItem
