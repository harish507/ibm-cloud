/* eslint no-eval: 0 */
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { Grid } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
		padding: 0,
		margin: 0
	},
	inline: {
		display: 'inline',
		fontSize: 11
	}
}))

export default function AppConfig(props) {
	const classes = useStyles()
	const [ config, setConfig ] = useState(null)
	const [ details, setDetails ] = useState(null)
	const [ mqConfiguration, setMqConfiguration ] = useState(null)

	useEffect(
		() => {
			setConfig(props.config)
			setDetails(props.details)
			setMqConfiguration({ ...props.mqConfig })
		},
		[ props ]
	)

	const getListItem = (label, text) => {
		return (
			<ListItem alignItems='flex-start' style={{ margin: 0, padding: 0 }}>
				{/* <ListItemIcon>{icon}</ListItemIcon> */}
				<ListItemText
					primary={
						<React.Fragment>
							<Typography
								component='span'
								variant='body2'
								className={classes.inline}
								color='textSecondary'
							>
								{label}
							</Typography>
						</React.Fragment>
					}
					secondary={
						<React.Fragment>
							<Typography component='span' variant='body1' className={classes.inline} color='textPrimary'>
								{text}
							</Typography>
						</React.Fragment>
					}
				/>
			</ListItem>
		)
	}
	const showDetails = (obj) => {
		return (
			<div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column' }}>
				{(() => {
					if (obj.defaultFtp === true && obj.defaultRest === true && obj.defaultPgp === true) {
						return (
							(obj.type === 'Default' || obj.type === 'MINTS') &&
							mqConfiguration && (
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<span>
										Url : <b>{mqConfiguration.configuration.url}</b>
									</span>
									<span>
										Que Mgr : <b>{mqConfiguration.configuration.queueManager}</b>
									</span>
								</div>
							)
						)
					}
				})()}
				{obj.type === 'AMQ' && (
					<span>
						URL : <b>{obj.amq.amqUrl}</b>
					</span>
				)}
				{obj.type === 'WMQ' && (
					<span>
						URL : <b>{obj.wmq.wmqHost}</b>
					</span>
				)}
				{obj.type === 'WMQ' && (
					<span>
						Que Mgr : <b>{obj.wmq.wmqQueMgr}</b>
					</span>
				)}
				{obj.type === 'Kafka' && (
					<span>
						Host : <b>{obj.kafka.kafkaHost}</b>
					</span>
				)}
				{obj.type === 'Kafka' && (
					<span>
						ZooKeeper Host : <b>{obj.kafka.kafkaZooKeeperHost}</b>
					</span>
				)}
			</div>
		)
	}
	const showSourceDetails = (obj) => {
			return (
				<div>
					{obj.defaultFtp === false &&
						getListItem(
							'',
							<div>
								<Typography
									component='span'
									variant='body2'
									className={classes.inline}
									color='textSecondary'
								>
									Source Configuration FTP
								</Typography>
								<div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column' }}>
									<span>
										Protocol: <b>{obj.ftp.ftpProtocol}</b>
									</span>
									<span>
										Host: <b>{obj.ftp.ftpHost}</b>
									</span>
								</div>
							</div>
						)}

					{obj.defaultRest === false &&
						getListItem(
							'',
							<div>
								<Typography
									component='span'
									variant='body2'
									className={classes.inline}
									color='textSecondary'
								>
									Source Configuration Rest
								</Typography>
								<div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column' }}>
									<span>
										Endpoint: <b>{obj.rest.restEndpoint}</b>
									</span>
								</div>
							</div>
						)}
					{obj.defaultShare === false &&
						getListItem(
							'',
							<div>
								<Typography
									component='span'
									variant='body2'
									className={classes.inline}
									color='textSecondary'
								>
									Source Configuration FileShare
								</Typography>
								<div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column' }}>
									<span>
										Location : <b>{obj.fileShare.fileLocation}</b>
									</span>
								</div>
							</div>
						)}
					{obj.defaultPgp === false &&
						getListItem(
							'',
							<div>
								<Typography
									component='span'
									variant='body2'
									className={classes.inline}
									color='textSecondary'
								>
									Source Configuration PGP
								</Typography>
								<div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column' }}>
									<span>
										Name: <b>{obj.pgp.name}</b>
									</span>
								</div>
							</div>
						)}
				</div>
			)
	}

	const showTargetDetails = (obj) => {
			return (
				<div>
					{obj.defaultFtp === false &&
						getListItem(
							'',
							<div>
								<Typography
									component='span'
									variant='body2'
									className={classes.inline}
									color='textSecondary'
								>
									Destination Configuration FTP
								</Typography>
								<div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column' }}>
									<span>
										Protocol: <b>{obj.ftp.ftpProtocol}</b>
									</span>
									<span>
										Host: <b>{obj.ftp.ftpHost}</b>
									</span>
								</div>
							</div>
						)}
					{obj.defaultRest === false &&
						getListItem(
							'',
							<div>
								<Typography
									component='span'
									variant='body2'
									className={classes.inline}
									color='textSecondary'
								>
									Destination Configuration Rest
								</Typography>
								<div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column' }}>
									<span>
										Endpoint: <b>{obj.rest.restEndpoint}</b>
									</span>
								</div>
							</div>
						)}
					{obj.defaultShare === false &&
						getListItem(
							'',
							<div>
								<Typography
									component='span'
									variant='body2'
									className={classes.inline}
									color='textSecondary'
								>
									Destination Configuration FileShare
								</Typography>
								<div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column' }}>
									<span>
										Location: <b>{obj.fileShare.fileLocation}</b>
									</span>
								</div>
							</div>
						)}
					{obj.defaultPgp === false &&
						getListItem(
							'',
							<div>
								<Typography
									component='span'
									variant='body2'
									className={classes.inline}
									color='textSecondary'
								>
									Destination Configuration PGP
								</Typography>
								<div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column' }}>
									<span>
										Name: <b>{obj.pgp.name}</b>
									</span>
								</div>
							</div>
						)}
				</div>
			)
	}
	return (
		<Grid container spacing={0}>
			<Grid item md={12} xs={12}>
				{config && (
					<div>
						<List className={classes.root}>
							<Grid container spacing={1}>
								<Grid item md={12}>
								{getListItem((config[details.source].type === 'MINTS' || config[details.source].type === 'Default' ) ? '' : 'Source Configuration ' + config[details.source].type, showDetails(config[details.source]))}
									{showSourceDetails(config[details.source])}
								</Grid>
							</Grid>
							<div style={{ margin: 10 }}> -------------------- </div>
							<Grid container>
								<Grid item md={12}>
								{getListItem((config[details.target].type === 'MINTS' || config[details.target].type === 'Default' ) ? '' : 'Destination Configuration ' + config[details.target].type, showDetails(config[details.target]))}
									{showTargetDetails(config[details.target])}
								</Grid>
							</Grid>
						</List>
					</div>
				)}
			</Grid>
		</Grid>
	)
}
