import React, { useState } from 'react'
import { Typography } from '@material-ui/core'
import RadioButtons from '../../Controls/RadioButtons'

export default function Performance () {
	const [ value, setValue ] = useState('one')
	return (
		<div className='content'>
			<div style={{ paddingLeft: 50 }}>
				<Typography variant='h5'>Performance</Typography>
				<div style={{ padding: 10, paddingLeft: 30 }}>
					<RadioButtons
						label='Phone'
						items={[ 'one', 'two', 'three' ]}
						value={value}
						onChange={(val) => setValue(val)}
					/>
				</div>
			</div>
		</div>
	)
}
