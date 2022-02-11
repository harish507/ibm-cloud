import React from 'react'
import Steps from './Steps'
import { Grid, Fab, Paper, Tooltip, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import CachedIcon from '@material-ui/icons/Cached'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'

export default function Deploy (props) {
	const step = 4
	return (
		<div className='content'>
			<Grid container spacing={0} alignContent='center' alignItems='flex-start'>
				<Grid item md={8} sm={12}>
					<Paper style={{ paddingTop: 10, height: 80 }}>
						<Steps step={step} />
					</Paper>
				</Grid>
				<Grid item md={4} sm={12} style={{ textAlign: 'center' }}>
					{/* <Paper style={{height: 80, marginLeft: 20 }} > */}
					{step < 5 && (
						<div style={{ paddingTop: 20, width: '100%', textAlign: 'center' }}>
							<Fab variant='extended' color='primary' disabled={step === 0 || step > 3}>
								<Tooltip title='Previous'>
									<ArrowBackIosIcon />
								</Tooltip>
							</Fab>
							<Fab variant='extended' color='secondary' disabled={step > 3}>
								{' '}
								<Tooltip title='Reset details'>
									<CachedIcon />
								</Tooltip>
							</Fab>
							<Fab variant='extended' color='primary' disabled={step > 2}>
								<Tooltip title='Continue'>
									<ArrowForwardIosIcon />
								</Tooltip>
							</Fab>
							<Fab variant='extended' color='primary' disabled={step !== 3}>
								<Tooltip title='Save'>
									<SaveIcon />
								</Tooltip>{' '}
								Save
							</Fab>
							<Fab variant='extended' color='secondary' disabled={true}>
								<DeleteIcon />
								Delete
							</Fab>
						</div>
					)}
				</Grid>
			</Grid>
			<Grid container alignContent='center' alignItems='center' style={{ padding: 20, marginTop: 20 }}>
				<Grid item sm={12} xs={12} style={{ textAlign: 'center' }}>
					<Typography variant='h6' color='primary'>
						Integration {localStorage.id} deployed Successfully
					</Typography>
				</Grid>
				<Grid item sm={12} xs={12} style={{ textAlign: 'center' }}>
					<br />
					<br />
					<Typography variant='body1'>Click the below link to test your integration </Typography>
					<br />
					<Fab
						variant='extended'
						component={Link}
						to={'/test/' + localStorage.id}
						// target='_blank'
						color='secondary'
						size='large'
					>
						Test your Integration
					</Fab>
				</Grid>
			</Grid>
		</div>
	)
}
