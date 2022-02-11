import React, { useState, useEffect } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextBox from '../../Controls/TextBox'
import { Tabs, Tab, Paper } from '@material-ui/core'

const initConfig = {
	routesLocation: 'routes',
	host: '',
	repo: '',
	group: '',
	branch: '',
	name: '',
	username: '',
	password: '',
	email: '',
	token:''
}

export default function PublishEntry (props) {
	const [ items, setItems ] = useState(props.config)
	const [ value, setValue ] = useState(false)
	const [ details, setDetails ] = useState(null)

	useEffect(
		() => {
			setItems(props.config)
			if (value === false) {
				setValue(0)
				setDetails({ ...initConfig, ...Object.values(items)[0].configuration })
			} else {
				setDetails({ ...initConfig, ...Object.values(items)[value].configuration })
			}
		},
		[ props.config, items, value ]
	)

	const handleChange = (event, newValue) => {
		setValue(newValue)
		setDetails(null)
		setTimeout(() => {
			setDetails({ ...initConfig, ...Object.values(items)[newValue].configuration })
		}, 10)
	}

	const copyFromDev = () => {
		let tmp = { ...items[Object.keys(items)[0]].configuration }
		let upd = { ...details, ...tmp }
		setDetails(upd)
		let temp = { ...items }
		temp[Object.keys(items)[value]].configuration = { ...upd }
		setItems(temp)
	}

	const handleConfigChange = (key, val) => {
		let upd = { ...details, [key]: val }
		setDetails(upd)
		let temp = { ...items }
		temp[Object.keys(items)[value]].configuration = { ...upd }
		setItems(temp)
	}

	const submitForm = (e) => {
		e.preventDefault()
		if (
			!details.routesLocation ||
			details.routesLocation.trim() === '' ||
			!details.host ||
			details.host.trim() === '' ||
			!details.repo ||
			details.repo.trim() === '' ||
			!details.group ||
			details.group.trim() === '' ||
			!details.branch ||
			details.branch.trim() === '' ||
			!details.name ||
			details.name.trim() === '' ||
			!details.username ||
			details.username.trim() === '' ||
			!details.password ||
			details.password.trim() === '' ||
			!details.email ||
			details.email.trim() === ''
		) {
			props.uiRef.Error('Please provide all the values')
		} else {
			props.onSave(items, Object.keys(items)[value])
		}
	}

	return (
		<div>
			<Dialog open={items ? true : false} onClose={props.onCancel} maxWidth='xs' fullWidth>
				<DialogTitle>
					<Paper>
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
					</Paper>
				</DialogTitle>
				<form autocomplete='off'>
					<DialogContent style={{ height: 300, overflow: 'auto' }}>
						{details && (
							<div>
								{/* {items[Object.keys(items)[value]]._id} */}
								{value > 0 && (
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
								)}
								<TextBox
									label='Routes location'
									value={details.routesLocation}
									autoFocus={true}
									onChange={(e) => handleConfigChange('routesLocation', e.target.value)}
								/>
								<TextBox
									label='Host'
									value={details.host}
									onChange={(e) => handleConfigChange('host', e.target.value)}
								/>
								<TextBox
									label='Repo'
									value={details.repo}
									onChange={(e) => handleConfigChange('repo', e.target.value)}
								/>
								<TextBox
									label='Team / Organization'
									value={details.group}
									onChange={(e) => handleConfigChange('group', e.target.value)}
								/>
								<TextBox
									label='Branch'
									value={details.branch}
									onChange={(e) => handleConfigChange('branch', e.target.value)}
								/>
								<TextBox
									label='Username'
									value={details.username}
									onChange={(e) => handleConfigChange('username', e.target.value)}
								/>
								<TextBox
									label='Password'
									type='password'
									value={details.password}
									onChange={(e) => handleConfigChange('password', e.target.value)}
								/>
								<TextBox
									label='Display Name'
									value={details.name}
									onChange={(e) => handleConfigChange('name', e.target.value)}
								/>
								<TextBox
									label='Email'
									type='email'
									value={details.email}
									onChange={(e) => handleConfigChange('email', e.target.value)}
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
