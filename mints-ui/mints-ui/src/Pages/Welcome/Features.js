import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import FaIcon from '../Template/FaIcon'

export default function Features () {
	return (
		<div style={{ width: '100%', paddingTop: 30 }}>
			<Typography variant='h4'>Miracle Integration Service</Typography>
			<Typography variant='body1'>Highly Scalable & Fully Customizable Integration Service</Typography>
			<div style={{ paddingLeft: 20, paddingTop: 50 }}>
				<Grid container spacing={2}>
					<Grid item sm={2}>
						{/* 45abfa //  faRandom */}
						<FaIcon size='4x' color='grey' icon='faBriefcase' />
					</Grid>
					<Grid item sm={9} style={{ textAlign: 'justify', verticalAlign: 'middle', paddingTop: 10 }}>
						<Typography variant='body2' style={{ color: 'grey' }}>
							Seamless creation, configuration & integration of business interfaces with workflow
							automation
						</Typography>
					</Grid>
					<Grid item sm={1} />
					<Grid item sm={2}>
						<FaIcon size='4x' color='grey' icon='faRandom' />
					</Grid>
					<Grid item sm={9} style={{ textAlign: 'justify', verticalAlign: 'middle', paddingTop: 10 }}>
						<Typography variant='body2' style={{ color: 'grey' }}>
							Secure data / file transfer with formatting, compression & encryption support
						</Typography>
					</Grid>
					<Grid item sm={1} />
					<Grid item sm={2}>
						<FaIcon size='4x' color='grey' icon='faChartPie' />
					</Grid>
					<Grid item sm={9} style={{ textAlign: 'justify', verticalAlign: 'middle', paddingTop: 10 }}>
						<Typography variant='body2' style={{ color: 'grey' }}>
							Customizable reports with automated alerts & activity / transaction logs as per standards
						</Typography>
					</Grid>
					<Grid item sm={1} />
					<Grid item sm={2}>
						<FaIcon size='4x' color='grey' icon='faCloudSun' />
					</Grid>
					<Grid item sm={9} style={{ textAlign: 'justify', verticalAlign: 'middle', paddingTop: 10 }}>
						<Typography variant='body2' style={{ color: 'grey' }}>
							Cloud based scalable & flexible and comprehensive distributable solution
						</Typography>
					</Grid>
					<Grid item sm={1} />
				</Grid>
			</div>
		</div>
	)
}
