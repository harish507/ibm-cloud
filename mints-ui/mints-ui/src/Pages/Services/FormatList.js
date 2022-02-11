import React from 'react'
import { Button } from '@material-ui/core'

export default function FormatList (props) {
	return (
		<div
			className='palette-group-content'
			style={{ display: 'flex', flexDirection: 'column', height: 275, overflow: 'auto' }}
		>
			{props.items.map((item, index) => (
				<Button
					key={index}
					color={item.info ? 'primary' : 'secondary'}
					variant={props.selected && props.selected.id === item.id ? 'contained' : 'text'}
					style={{ textTransform: 'none', padding: 2, margin: 0 }}
					scope='row'
					onClick={() => props.setSelected({ ...item })}
				>
					{item.name}
				</Button>
			))}
		</div>
	)
}
