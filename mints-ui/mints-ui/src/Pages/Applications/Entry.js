import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextBox from '../../Controls/TextBox'
import Typography from '@material-ui/core/Typography'
import RadioSelection from '../../Controls/RadioSelection'
import { Tabs, Tab, Paper } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import FieldSet from '../../Controls/FieldSet'
import SwitchControl from '../../Controls/SwitchControl'

export default function Entry(props) {
	const protocols = [ 'Messaging', 'Ftp', 'Rest' ]
	const reader = new FileReader()
	const [ item, setItem ] = useState(props.item)
	const [ value, setValue ] = useState(0)
	const [ amqDetails, setAmqDetails ] = useState(props.item.amq)
	const [ wmqDetails, setWmqDetails ] = useState(props.item.wmq)
	const [ kafkaDetails, setKafkaDetails ] = useState(props.item.kafka)
	const [ ftpDetails, setFtpDetails ] = useState(props.item.ftp)
	const [ restDetails, setRestDetails ] = useState(props.item.rest)
	// const [ fileShareDetails, setFileShareDetails ] = useState(null)
	const [ pgpDetails, setPgpDetails ] = useState(props.item.pgp)
	const [ defaults, setDefaults ] = useState('Default')
	const [ type, setType ] = useState(item.type)
	const [ publicFileRead, setPublicFileRead ] = useState({ fileContent: '' })
	const [ privateFileRead, setPrivateFileRead ] = useState({ fileContent: '' })

	const handleTypeChange = (key, value) => {
		if (value === 'MINTS' || value === 'Default') {
			setType('Default')
			setItem({ ...item, type: value, amq:{...props.initApp.amq}, wmq: {...props.initApp.wmq}, kafka: {...props.initApp.kafka} })
		}
		if (value === 'AMQ') {
			setType(value)
			setItem({ ...item, type: value, amq : {...amqDetails}, wmq:{...props.initApp.wmq}, kafka: {...props.initApp.kafka} })
		}
		if (value === 'WMQ') {
			setType(value) 
			setItem({ ...item, type: value, wmq : {...wmqDetails} , amq:{...props.initApp.amq}, kafka: {...props.initApp.kafka} })
		}
		if (value === 'Kafka') {
			setType(value)
			setItem({ ...item, type: value, kafka: {...kafkaDetails}, amq:{...props.initApp.amq}, wmq:{...props.initApp.wmq}  })
		}
	}
	const handleAmqPropChange = (key, value) => {
		let upd = { ...amqDetails, [key]: value }
		setAmqDetails(upd)
		setItem({ ...item, amq: { ...upd } })
	}
	const handleWmqPropChange = (key, value) => {
		let upd = { ...wmqDetails, [key]: value }
		setWmqDetails(upd)
		setItem({ ...item, wmq: { ...upd } })
	}
	const handleKafkaPropChange = (key, value) => {
		let upd = { ...kafkaDetails, [key]: value }
		setKafkaDetails(upd)
		setItem({ ...item, kafka: { ...upd } })
	}
	const changeDefaultFtp = (item) => {
		if (item.defaultFtp) {
			item.defaultFtp = false
			setDefaults(item.defaultFtp)
		} else {
			item.defaultFtp = true
			setDefaults(item.defaultFtp)
		}
	}
	const handleFtpPropChange = (key, value) => {
		let upd = { ...ftpDetails, [key]: value }
		setFtpDetails(upd)
		setItem({ ...item, ftp: { ...upd } })
	}

	const handleRestPropChange = (key, value) => {
		let upd = { ...restDetails, [key]: value }
		setRestDetails(upd)
		setItem({ ...item, rest: { ...upd } })
	}

	const changeDefaultRest = (item) => {
		if (item.defaultRest) {
			item.defaultRest = false
			setDefaults(item.defaultRest)
		} else {
			item.defaultRest = true
			setDefaults(item.defaultRest)
		}
	}

	const handlePgpPropChange = (key, value) => {
		let upd = { ...pgpDetails, [key]: value }
		setPgpDetails(upd)
		setItem({ ...item, pgp: { ...upd } })
	}
	const changeDefaultPgp = (item) => {
		if (item.defaultPgp) {
			item.defaultPgp = false
			setDefaults(item.defaultPgp)
		} else {
			item.defaultPgp = true
			setDefaults(item.defaultPgp)
		}
	}

	const changeDefaultEncoding = (item) => {
		if (item.defaultEncoding) {
			item.defaultEncoding = false
			setDefaults(item.defaultEncoding)
		} else {
			item.defaultEncoding = true
			setDefaults(item.defaultEncoding)
		}
	}

	const handleChange = (key, value) => {
		setItem({ ...item, [key]: value })
	}
	const handleChangeTabs = (event, newValue) => {
		setValue(newValue)
	}
	const changeInPrivateKey = (ind) => {
		if (!ind.privateKey) {
			ind.privateKey = true
			setPgpDetails({ ...pgpDetails, ind })
		} else {
			ind.privateKey = false
			setPgpDetails({ ...pgpDetails, ind })
		}
	}
	const handlePublicKeyFileChange = (e) => {
		const file = e.target.files[0]
		reader.readAsText(file)
		reader.onload = () => {
			setPublicFileRead({ fileContent: reader.result })
		}
		reader.onerror = () => {
			console.log('file error', reader.error)
		}
	}
	const handlePrivateKeyFileChange = (e) => {
		const file = e.target.files[0]
		reader.readAsText(file)
		reader.onload = () => {
			setPrivateFileRead({ fileContent: reader.result })
			setItem({ ...item, privateFileRead })
		}
		reader.onerror = () => {
			console.log('file error', reader.error)
		}
	}
	const submitForm = (e) => {
		e.preventDefault()
		props.onSave(item)
	}
	return (
		<div>
			<Dialog open={item ? true : false} onClose={props.onCancel} maxWidth='xs' fullWidth>
				<DialogTitle id='form-dialog-title'>{item.name} Configuration</DialogTitle>
				<form>
					<DialogContent>
						<div style={{ height: 500 }}>
							<Grid container spacing={1}>
								<Grid item md={6}>
									<TextBox
										label='Application Name'
										value={item.name}
										disabled={item._id ? true : false}
										onChange={(e) => handleChange('name', e.target.value)}
									/>
								</Grid>
								<Grid item md={6}>
									<TextBox
										label='Connection Name'
										value={item.connection}
										disabled={item._id ? true : false}
										onChange={(e) => handleChange('connection', e.target.value)}
									/>
								</Grid>
							</Grid>
							<div className='palette-group'>
								<div className={[ 'palette-group-header color-light' ]}>Message Configuration</div>
								<div className='palette-group-content'>
									<Grid item md={12}>
										<Paper>
											<Tabs
												value={value}
												variant='fullWidth'
												indicatorColor='secondary'
												textColor='secondary'
												onChange={handleChangeTabs}
											>
												{Object.values(protocols).map((item) => {
													return (
														<Tab
															key={item}
															style={{ minWidth: 75, margin: 0, padding: 0 }}
															label={item}
														/>
													)
												})}
											</Tabs>
										</Paper>
									</Grid>
									{value === 0 && (
										<React.Fragment>
											<Grid container spacing={0} style={{ paddingTop: 5 }}>
												<Grid item md={12}>
													<RadioSelection
														items={[ 'MINTS', 'AMQ', 'WMQ', 'Kafka' ]}
														label='Messaging Type'
														value={type === 'Default' ? 'MINTS' : type}
														onChange={(e) => handleTypeChange('type', e.target.value)}
													/>
													{amqDetails &&
													type === 'AMQ' && (
														<React.Fragment>
															<TextBox
																label='AMQ Url'
																value={amqDetails.amqUrl}
																onChange={(e) =>
																	handleAmqPropChange('amqUrl', e.target.value)}
															/>
															<TextBox
																label='Username'
																value={amqDetails.username}
																onChange={(e) =>
																	handleAmqPropChange('username', e.target.value)}
															/>
															<TextBox
																label='Password'
																type='password'
																value={amqDetails.password}
																onChange={(e) =>
																	handleAmqPropChange('password', e.target.value)}
															/>
														</React.Fragment>
													)}
													{wmqDetails &&
													type === 'WMQ' && (
														<React.Fragment>
															<TextBox
																label='WMQ Host'
																value={wmqDetails.wmqHost}
																onChange={(e) =>
																	handleWmqPropChange('wmqHost', e.target.value)}
															/>
															<TextBox
																label='WMQ Channel'
																value={wmqDetails.wmqChannel}
																onChange={(e) =>
																	handleWmqPropChange('wmqChannel', e.target.value)}
															/>
															<TextBox
																label='WMQ Queue Manager'
																value={wmqDetails.wmqQueMgr}
																onChange={(e) =>
																	handleWmqPropChange('wmqQueMgr', e.target.value)}
															/>
															<TextBox
																label='WMQ Port'
																value={wmqDetails.wmqPort}
																onChange={(e) =>
																	handleWmqPropChange('wmqPort', e.target.value)}
															/>
															<TextBox
																label='Username'
																value={wmqDetails.username}
																onChange={(e) =>
																	handleWmqPropChange('username', e.target.value)}
															/>
															<TextBox
																label='Password'
																type='password'
																value={wmqDetails.password}
																onChange={(e) =>
																	handleWmqPropChange('password', e.target.value)}
															/>
														</React.Fragment>
													)}
													{kafkaDetails &&
													type === 'Kafka' && (
														<React.Fragment>
															<TextBox
																label='Kafka Host'
																value={kafkaDetails.kafkaHost}
																onChange={(e) =>
																	handleKafkaPropChange('kafkaHost', e.target.value)}
															/>
															<TextBox
																label='Kafka Port'
																value={kafkaDetails.kafkaPort}
																onChange={(e) =>
																	handleKafkaPropChange('kafkaPort', e.target.value)}
															/>
															<TextBox
																label='Kafka ZooKeeper Host'
																value={kafkaDetails.kafkaZooKeeperHost}
																onChange={(e) =>
																	handleKafkaPropChange(
																		'kafkaZooKeeperHost',
																		e.target.value
																	)}
															/>
															<TextBox
																label='Kafka ZooKeeper Port'
																value={kafkaDetails.kafkaZooKeeperPort}
																onChange={(e) =>
																	handleKafkaPropChange(
																		'kafkaZooKeeperPort',
																		e.target.value
																	)}
															/>
															<TextBox
																label='Username'
																value={kafkaDetails.username}
																onChange={(e) =>
																	handleKafkaPropChange('username', e.target.value)}
															/>
															<TextBox
																label='Password'
																type='password'
																value={kafkaDetails.password}
																onChange={(e) =>
																	handleKafkaPropChange('password', e.target.value)}
															/>
														</React.Fragment>
													)}
												</Grid>
											</Grid>
										</React.Fragment>
									)}
									{value === 1 && (
										<React.Fragment>
											<Grid container spacing={0} style={{ paddingTop: 5 }}>
												<Grid item md={12}>
													<RadioSelection
														items={[ 'Disabled', 'Enabled' ]}
														label='FTP Config'
														value={item.defaultFtp === true ? 'Disabled' : 'Enabled'}
														onChange={() => changeDefaultFtp(item)}
													/>
												</Grid>
											</Grid>
											{ftpDetails &&
												!defaults === true &&  (
												<React.Fragment>
													<TextBox
														label='FTP Protocol'
														value={ftpDetails.ftpProtocol}
														disabled={false}
														onChange={(e) =>
															handleFtpPropChange('ftpProtocol', e.target.value)}
													/>
													<TextBox
														label='FTP Token'
														value={ftpDetails.ftpToken}
														disabled={false}
														onChange={(e) =>
															handleFtpPropChange('ftpToken', e.target.value)}
													/>
													<TextBox
														label='FTP Host'
														value={ftpDetails.ftpHost}
														onChange={(e) => handleFtpPropChange('ftpHost', e.target.value)}
													/>
													<TextBox
														label='FTP Port'
														value={ftpDetails.ftpPort}
														onChange={(e) => handleFtpPropChange('ftpPort', e.target.value)}
													/>
													<TextBox
														label='Username'
														value={ftpDetails.username}
														onChange={(e) =>
															handleFtpPropChange('username', e.target.value)}
													/>
													<TextBox
														label='Password'
														type='password'
														value={ftpDetails.password}
														onChange={(e) =>
															handleFtpPropChange('password', e.target.value)}
													/>
												</React.Fragment>
											)}
										</React.Fragment>
									)}

									{value === 2 && (
										<React.Fragment>
											<Grid container spacing={0} style={{ paddingTop: 5 }}>
												<Grid item md={12}>
													<RadioSelection
														items={[ 'Disabled', 'Enabled' ]}
														label='Rest Config'
														value={item.defaultRest === true ? 'Disabled' : 'Enabled'}
														onChange={() => changeDefaultRest(item)}
													/>
												</Grid>
											</Grid>
											{props.item.rest &&
											!defaults === true && (
												<React.Fragment>
													<TextBox
														label='Rest Endpoint'
														value={restDetails.restEndpoint}
														onChange={(e) =>
															handleRestPropChange('restEndpoint', e.target.value)}
													/>
													<TextBox
														label='Rest Token'
														value={restDetails.restToken}
														onChange={(e) =>
															handleRestPropChange('restToken', e.target.value)}
													/>

													<TextBox
														label='Username'
														value={restDetails.username}
														onChange={(e) =>
															handleRestPropChange('username', e.target.value)}
													/>
													<TextBox
														label='Password'
														type='password'
														value={restDetails.password}
														onChange={(e) =>
															handleRestPropChange('password', e.target.value)}
													/>
												</React.Fragment>
											)}
										</React.Fragment>
									)}
								</div>
							</div>
							<div className='palette-group'>
								<div className={[ 'palette-group-header color-light' ]}>Data Integrity</div>
								<div className='palette-group-content'>
									<React.Fragment>
										<Grid container spacing={0} style={{ paddingTop: 5 }}>
											<Grid item md={12}>
												<RadioSelection
													items={[ 'Disabled', 'Enabled' ]}
													label='Data Encoding'
													value={item.defaultEncoding === true ? 'Disabled' : 'Enabled'}
													onChange={() => changeDefaultEncoding(item)}
												/>
											</Grid>
											<Grid item md={12}>
												<RadioSelection
													items={[ 'Disabled', 'Enabled' ]}
													label='Data Encryption (PGP)'
													value={item.defaultPgp === true ? 'Disabled' : 'Enabled'}
													onChange={() => changeDefaultPgp(item)}
												/>
											</Grid>
										</Grid>
										{pgpDetails &&
											!defaults === true && (
											<React.Fragment>
												<TextBox
													label='Name'
													value={(pgpDetails.name = item.connection ? item.connection : '')}
													onChange={(e) => handlePgpPropChange('name', e.target.value)}
												/>
												<FieldSet label='PublicKey File'>
													<Grid
														container
														spacing={1}
														alignContent='center'
														alignItems='center'
													>
														<Grid item>
															<input type='file' onChange={handlePublicKeyFileChange} />
															<Typography
																value={
																	(pgpDetails.publicKeyData = publicFileRead.fileContent
																		? publicFileRead.fileContent
																		: pgpDetails.publicKeyData)
																}
															/>
														</Grid>
													</Grid>
												</FieldSet>
												<Grid item>
													<FieldSet label='PrivateKey'>
														<SwitchControl
															checked={pgpDetails.privateKey}
															onChange={() => changeInPrivateKey(pgpDetails)}
														/>
													</FieldSet>
												</Grid>
												{pgpDetails.privateKey === true && (
													<FieldSet label='PrivateKey File'>
														<Grid
															container
															spacing={1}
															alignContent='center'
															alignItems='center'
														>
															<Grid item>
																<input
																	type='file'
																	onChange={handlePrivateKeyFileChange}
																/>
																<Typography
																	value={
																		(pgpDetails.privateKeyData = privateFileRead.fileContent
																			? privateFileRead.fileContent
																			: pgpDetails.privateKeyData)
																	}
																/>
															</Grid>
														</Grid>
													</FieldSet>
												)}
												<TextBox
													label='Username'
													value={pgpDetails.username}
													onChange={(e) => handlePgpPropChange('username', e.target.value)}
												/>
												{pgpDetails.privateKey === true && (
													<TextBox
														label='Password'
														type='password'
														value={pgpDetails.password}
														onChange={(e) =>
															handlePgpPropChange('password', e.target.value)}
													/>
												)}
											</React.Fragment>
										)}
									</React.Fragment>
								</div>
							</div>
							<div className='palette-group'>
								<div className={[ 'palette-group-header color-light' ]}>Notification Configuration</div>
								<div className='palette-group-content'>notify</div>
							</div>
						</div>
					</DialogContent>
					<DialogActions>
						<Button variant='outlined' onClick={props.onCancel} color='primary'>
							Cancel
						</Button>
						<Button variant='contained' type='submit' onClick={submitForm} color='primary'>
							Save
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</div>
	)
}
