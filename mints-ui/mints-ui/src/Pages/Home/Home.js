import React from 'react'
// import { Typography } from '@material-ui/core'
import Features from '../Welcome/Features'

export default function Home () {
	return (
		<div className='intro' style={{}}>
			<div className='palette-group' style={{ margin: '5% auto', minHeight: 350, padding: 0, width: 600 }}>
				<div className={[ 'palette-group-header color-light' ]}>Welcome</div>
				<div className='palette-group-content'>
					<Features />
				</div>
			</div>
			{/* <div style={{ padding: '5%', textAlign: 'center' }}>
				<Typography variant='h4'>Welcome to MINTS</Typography>
				<Typography variant='body1'>Highly Scalable & Fully Customizable Integration Service</Typography>
			</div> */}
		</div>
	)
}
