import React, { useState } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { Grid, Button } from '@material-ui/core'

export default function Publish (props) {
	const [ framework, setFramework ] = useState(0)

	return (
		<Grid container alignContent='center' alignItems='center'>
			{props.method === 'build' && (
				<Grid item sm={12} xs={12} style={{ textAlign: 'center' }}>
					<Typography variant='h6' color='primary'>
						Integration {props.id} saved successfully
					</Typography>
				</Grid>
			)}
			<Grid item sm={12} xs={12} style={{ textAlign: 'center' }}>
				<br />
				<br />
				{props.method === 'build' &&
				props.config.format.length > 0 && (
					<Typography variant='body1'>
						Select integration framework and click publish to deploy your integration
					</Typography>
				)}
				{props.method === 'build' &&
				props.config.format.length === 0 && (
					<Typography variant='body1'>No integration frameworks are configured</Typography>
				)}
				{props.method === 'delete' && (
					<Typography variant='body1'>Click delete to un-publish the integration </Typography>
				)}
			</Grid>

			<Grid item md={4} xs={12} />

			<Grid item md={4} xs={12}>
				{props.config &&
				props.config.format.length > 0 && (
					<List component='nav'>
						{props.config.format.map((item, ind) => {
							return (
								<ListItem
									component={Button}
									key={ind}
									selected={ind === framework}
									onClick={(e) => setFramework(ind)}
									style={{ textAlign: 'center' }}
								>
									<ListItemText primary={item.name} />
								</ListItem>
							)
						})}
					</List>
				)}
			</Grid>

			<Grid item md={4} xs={12} />

			{props.method === 'build' &&
			props.config.format.length > 0 && (
				<Grid item sm={12} xs={12} style={{ textAlign: 'center' }}>
					<br />
					<br />
					{props.config.publish.length === 0 && (
						<Typography variant='body1'>Publish configuration is not complete</Typography>
					)}
					{props.config.publish.length === 1 && (
						<React.Fragment>
							{props.config.publish.map((item, ind) => {
								return (
									<Button
										key={ind}
										variant='contained'
										size='large'
										color='primary'
										onClick={() => props.publish(props.config.format[framework], item)}
									>
										Publish Integration
									</Button>
								)
							})}
						</React.Fragment>
					)}
					{props.config.publish.length > 1 && (
						<React.Fragment>
							{props.config.publish.map((item, ind) => {
								return (
									<Button
										key={ind}
										variant='contained'
										size='large'
										color='primary'
										onClick={() => props.publish(props.config.format[framework], item)}
									>
										{item.name}
									</Button>
								)
							})}
						</React.Fragment>
					)}
				</Grid>
			)}
			{props.method === 'delete' && (
				<Grid item sm={12} xs={12} style={{ textAlign: 'center' }}>
					<br />
					<br />
					{props.config.publish.length === 1 && (
						<React.Fragment>
							{props.config.publish.map((item, ind) => {
								return (
									<Button
										key={ind}
										variant='contained'
										size='large'
										color='secondary'
										onClick={() => props.delete(props.config.format[framework], item)}
									>
										Delete Integration
									</Button>
								)
							})}
						</React.Fragment>
					)}
					{props.config.publish.length > 1 && (
						<React.Fragment>
							{props.config.publish.map((item, ind) => {
								return (
									<Button
										key={ind}
										variant='contained'
										size='large'
										color='secondary'
										onClick={() => props.delete(props.config.format[framework], item)}
									>
										{' '}
										Delete: {item.name}
									</Button>
								)
							})}
						</React.Fragment>
					)}
				</Grid>
			)}
		</Grid>
	)
}
