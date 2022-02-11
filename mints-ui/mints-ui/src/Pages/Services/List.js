import React from 'react'
import { Button } from '@material-ui/core'
export default function List (props) {
	const items = Object.values(props.services).map((obj) => obj.type)
	const filtered = items.filter((type, index) => items.indexOf(type) === index)

	return (
		<div className='palette-group'>
			<div className={[ 'palette-group-header color-light' ]}>Services</div>
			<div className='palette-group-content' style={{ display: 'flex', flexDirection: 'column' }}>
				{filtered.map((item, index) => {
					return (
						<Button
							key={index}
							color='default'
							variant={props.selected === item ? 'contained' : 'text'}
							onClick={() => props.loadServices(item, index)}
						>
							{item.toUpperCase()}
						</Button>
					)
				})}
			</div>
		</div>
	)
}
