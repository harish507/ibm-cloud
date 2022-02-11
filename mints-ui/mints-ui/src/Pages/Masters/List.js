import React from 'react'
import { Button } from '@material-ui/core'
import _ from 'lodash'

export default function List (props) {
	return (
		<div className='palette-group'>
			<div className='palette-group-header color-light'>Masters</div>
			<div className='palette-group-content' style={{ display: 'flex', flexDirection: 'column' }}>
				{props.list.map(
					(item, index) =>
						item !== 'applications' && (
							<Button
								key={index}
								variant={props.selected === item ? 'contained' : 'text'}
								color='default'
								size='small'
								style={{ textTransform: 'none' }}
								onClick={() => props.selectMaster(item)}
							>
								{_.startCase(item)}
							</Button>
						)
				)}
			</div>
		</div>
	)
}
