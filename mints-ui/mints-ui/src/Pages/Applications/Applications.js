import React, { useState, useEffect } from 'react'
import { Grid, Typography } from '@material-ui/core'
import ServiceHelper from '../../Helpers/ServiceHelper'
import { TableContainer, TableHead, TableCell, Table, TableBody, TableRow, Button } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import AddIcon from '@material-ui/icons/AddCircle'
import DeleteIcon from '@material-ui/icons/Delete'
import AddApplication from './AddApplication'
import Entry from './Entry'

const initApp = {
	name: '',
	connection: '',
	type: 'Default',
	defaultAmq: true,
	defaultWmq: true,
	defaultKafka: true,
	defaultFtp: true,
	defaultRest: true,
	defaultShare: true,
	defaultPgp: true,
	defaultEncoding:true,
	amq:
	{
		amqUrl: "",
		username: "",
		password: ""
	},
	wmq:
	{
		wmqHost: "",
		wmqQueMgr: "",
		wmqChannel: "",
		wmqPort: null,
		username: "",
		password: ""
	},
	kafka:
	{
		kafkaHost: "",
		kafkaPort: null,
		kafkaZooKeeperHost: "",
		kafkaZooKeeperPort: null,
		username: "",
		password: ""
	},
	ftp: {
		ftpProtocol: "",
		ftpToken: "",
		ftpHost: "",
		ftpPort: null,
		username: "",
		password: ""
	},
	rest:
	{
		restToken: "",
		restEndpoint: "",
		username: "",
		password: ""
	},
	fileShare:
	{
		fileLocation: "",
		username: "",
		password: ""
	},
	pgp:
	{
		name:"",
		publicKeyData:"",
		privateKeyData:"",
		privateKey:false,
		username: "",
		password: ""	
	}
} 

export default function Applications({ uiRef }) {
	const [applications, setApplications] = useState(null)
	const [method, setMethod] = useState('')
	const [entry, setEntry] = useState(null)
	const [delEntry, setDelEntry] = useState(null)
	const [addApplication, setAddApplication] = useState(false)
	const [addAppConfig, setAddAppConfig] = useState(initApp)

	useEffect(() => {
		setMethod('get')
	}, [])

	const showApplications = (value) => {
		setAddApplication(false)
		setApplications(value)
		setMethod('')
	}
	const showStatus = (status) => {
		uiRef.Success('Configuration updated successfully.')
		setMethod('get')
		setAddApplication(false)
		setEntry(null)
	}
	const onCreate = () => {
		setAddApplication(true)
	}
	const handleChange = (key, value) => {
		setAddAppConfig({ ...addAppConfig, [key]: value })
	}

	const submitAppConfig = (e) => {
		e.preventDefault()
		setMethod('post')
	}
	const deleteEntry = (app) => {
		uiRef.Confirm(
			'Are you sure to delete application ' + app,
			() => {
				setDelEntry(app)
				setMethod('delete')
			},
			() => { }
		)
	}
	const saveConfig = (newEntry) => {
		if (newEntry) {
			if ( newEntry.type === 'AMQ' && (newEntry.amq.amqUrl === '' || newEntry.amq.username === '' || newEntry.amq.password === '')) {
				uiRef.Error(' Enter Valid AMQ Configuration Details ')
			} else if (
				newEntry.type === 'WMQ' && (newEntry.wmq.wmqHost === '' ||
				newEntry.wmq.wmqQueMgr === '' ||
				newEntry.wmq.wmqChannel === '' ||
				newEntry.wmq.wmqHost === '' ||
				newEntry.wmq.wmqPort === '' ||
				newEntry.wmq.username === '' ||
				newEntry.wmq.password === '')
			) {
				uiRef.Error(' Enter Valid WMQ Configuration Details ')
			} else if (newEntry.type === 'Kafka' &&
				(newEntry.kafka.kafkaHost === '' ||
				newEntry.kafka.kafkaPort === '' ||
				newEntry.kafka.kafkaZooKeeperHost === '' ||
				newEntry.kafka.kafkaZooKeeperPort === null ||
				newEntry.kafka.username === '' ||
				newEntry.kafka.password === '')
			) {
				uiRef.Error(' Enter Valid Kafka Configuration Details ')
			} else if (
				newEntry.defaultFtp === false &&
				(newEntry.ftp.ftpProtocol === '' ||
					newEntry.ftp.ftpToken === '' ||
					newEntry.ftp.ftpHost === '' ||
					newEntry.ftp.ftpPort === '' ||
					newEntry.ftp.username === '' ||
					newEntry.ftp.password === '')
			) {
				uiRef.Error(' Enter Valid FTP Configuration Details ')
			} else if (
				newEntry.defaultRest === false &&
				(newEntry.rest.restToken === '' ||
					newEntry.rest.restEndpoint === '' ||
					newEntry.rest.username === '' ||
					newEntry.rest.password === '')
			) {
				uiRef.Error(' Enter Valid REST Configuration Details ')
			} else if (
				newEntry.defaultPgp === false &&
				(newEntry.pgp.name === '' ||
					newEntry.pgp.publicKeyData === '' ||
					newEntry.pgp.privateKey === '' ||
					newEntry.pgp.privateKeyData === '' ||
					newEntry.pgp.username === '' ||
					newEntry.pgp.password === '')
			) {
				uiRef.Error(' Enter Valid PG PConfiguration Details ')
			} else {
				setEntry(newEntry)
				setMethod('post')
			}
		}
	}

	return (
		<div>
			<Grid container spacing={4}>
				<Grid item md={9}>
					<Typography variant='h5'>Application Configuration</Typography>
				</Grid>
			</Grid>

			{method === 'get' && (
				<ServiceHelper
					path='admin/applications'
					render={(data) => {
						return (
							<div>
								{data.payload && showApplications(data.payload)}
								{uiRef && uiRef.Loading(data.loading)}
								{data.error && uiRef.Error(data.error)}
							</div>
						)
					}}
				/>
			)}

			{method === 'post' && (
				<ServiceHelper
					method='post'
					path={'admin/applications'}
					input={entry ? { ...entry } : { ...addAppConfig }}
					render={(data) => {
						return (
							<div>
								{data.payload && showStatus(data.payload)}
								{uiRef && uiRef.Loading(data.loading)}
							</div>
						)
					}}
				/>
			)}
			{method === 'delete' && (
				<ServiceHelper
					method='delete'
					path={'admin/applications/' + delEntry}
					render={(data) => {
						return (
							<div>
								{uiRef && uiRef.Loading(data.loading)}
								{data.payload && showStatus(data.payload)}
								{data.error && uiRef.Error(data.error)}
							</div>
						)
					}}
				/>
			)}

			{applications && (
				<div style={{ padding: 30, paddingLeft: 50 }}>
					<TableContainer>
						<Table size='small'>
							<TableHead>
								<TableRow style={{ backgroundColor: '#ddd' }}>
									<TableCell>Application</TableCell>
									<TableCell>Connection Name</TableCell>
									<TableCell>Configurations</TableCell>
									<TableCell align='right'>
										<Button
											size='small'
											variant='text'
											color='primary'
											onClick={() => onCreate()}
										>
											<AddIcon />
										</Button>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{Object.values(applications).map((app, index) => (
									<TableRow key={index}>
										<TableCell>{app.name}</TableCell>
										<TableCell>{app.connection}</TableCell>
										<TableCell>{app.type === 'Default'?'MQ':app.type} 
										{!app.defaultFtp && ', FTP'}
										{!app.defaultRest && ', REST'}
										{!app.defaultPgp && ', PGP'}
										
										</TableCell>
										<TableCell align='right'>
											<Button
												size='small'
												variant='text'
												color='primary'
												onClick={() => setEntry({ ...app })}
											>
												<SettingsIcon />
											</Button>
											<Button
												size='small'
												variant='text'
												color='primary'
												onClick={() => deleteEntry(app.name)}
											>
												<DeleteIcon />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			)}
			{addApplication &&
				<AddApplication
					item={addApplication}
					addAppConfig={addAppConfig}
					handleChange={handleChange}
					submitAppConfig={submitAppConfig}
					onCancel={() => setAddApplication(false)}
				/>}
			{entry && <Entry item={entry} uiRef={uiRef} onCancel={() => setEntry(null)} onSave={saveConfig} initApp ={initApp}/>}
		</div>
	)
}
