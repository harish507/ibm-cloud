import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextBox from '../../Controls/TextBox'
// import { Tabs, Tab, Paper } from '@material-ui/core'

// const initConfig = {
// 	url: '',
// 	path: '',
// 	queueManager: '',
// 	username: '',
// 	password: ''
// }

export default function IbmMqEntry (props) {
    console.log(props.config,"IBM ENtry")
	const [ items, setItems ] = useState(props.config)
	//const [ value, setValue ] = useState(false)
	const [ details, setDetails ] = useState(null)

	useEffect(
		() => {
			setItems(props.config)
			setDetails(props.config.configuration)
			// if (value === false) {
			// 	setValue(0)
			// 	setDetails({ ...initConfig, ...Object.values(items)[0].configuration })
			// } else {
			// 	setDetails({ ...initConfig, ...Object.values(items)[value].configuration })
			// }
		},
		[ props.config ]
	)

	// const handleChange = (event, newValue) => {
	// 	setValue(newValue)
	// 	setDetails(null)
	// 	setTimeout(() => {
	// 		setDetails({ ...initConfig, ...Object.values(items)[newValue].configuration })
	// 	}, 10)
	// }

	// const copyFromDev = () => {
	// 	let tmp = { ...items[Object.keys(items)[0]].configuration }
	// 	let upd = { ...details, ...tmp }
	// 	setDetails(upd)
	// 	let temp = { ...items }
	// 	temp[Object.keys(items)[value]].configuration = { ...upd }
	// 	setItems(temp)
	// }

	const handleConfigChange = (key, val) => {
		//alert(val)
		let upd = { ...details, [key]: val }
		setDetails(upd)
		setItems({ ...items, configuration: { ...upd } })
	}

	const submitForm = (e) => {
		e.preventDefault()
		if (
			!details.url ||
			details.url.trim() === '' ||
			!details.path ||
			details.path.trim() === '' ||
			!details.queueManager ||
			details.queueManager.trim() === '' ||
			!details.username ||
			details.username.trim() === '' ||
			!details.password ||
			details.password.trim() === ''
		) {
			props.uiRef.Error('Please provide all the values')
		} else {
			props.onSave(items)
		}
	}

	return (
		<div>
			<Dialog open={items ? true : false} onClose={props.onCancel} maxWidth='xs' fullWidth>
				<DialogTitle>
					IBM MQ Configuration
					{/* <Paper>
						<Tabs
							value={value}
							variant='fullWidth'
							indicatorColor='secondary'
							textColor='secondary'
							onChange={handleChange}
						>
							{Object.keys(items).map((item) => {
								return <Tab key={item} style={{ minWidth: 75, margin: 0, padding: 0 }} label={item} />
							})}
						</Tabs>
					</Paper> */}
				</DialogTitle>
				<form autocomplete='off'>
					<DialogContent style={{ height: 300, overflow: 'auto' }}>
						{details && (
							<div>
								{/* {value > 0 && (
									<Button
										variant='text'
										color='primary'
										style={{
											textTransform: 'none',
											width: '100%',
											textAlign: 'center',
											marginBottom: 10
										}}
										onClick={copyFromDev}
									>
										Copy from {Object.keys(items)[0]}
									</Button>
								)} */}
								<TextBox
									label='API Base Url'
									value={details.url}
									autoFocus={true}
									onChange={(e) => handleConfigChange('url', e.target.value)}
								/>
								<TextBox
									label='API Path'
									value={details.path}
									onChange={(e) => handleConfigChange('path', e.target.value)}
								/>
								<TextBox
									label='Default Queue Manager'
									value={details.queueManager}
									onChange={(e) => handleConfigChange('queueManager', e.target.value)}
								/>
								<TextBox
									label='Username'
									value={details.username}
									onChange={(e) => handleConfigChange('username', e.target.value)}
								/>
								<TextBox
									label='Password'
									value={details.password}
									type='password'
									onChange={(e) => handleConfigChange('password', e.target.value)}
								/>
							</div>
						)}
					</DialogContent>
					<DialogActions>
						<Button variant='outlined' onClick={props.onCancel} color='primary'>
							Close
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
