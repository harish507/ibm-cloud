import React, { useState, useEffect } from 'react'
import { Typography } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
// import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Button from '../../Controls/Button'
import TextBox from '../../Controls/TextBox'
import RadioButtons from '../../Controls/RadioButtons'
import db from '../../Helpers/DbHelper'

const initEntry = {
	cluster: 'Azure',
	pattern: 'Simple',
	messageSize: '1KB',
	loadSize: '1K',
	consumer: 10,
	podSize: 1,
	transmittedBw: '',
	networkBw: '',
	cpu: '',
	memory: '',
	duration: '',
	tps: ''
}

export default function PerformanceEntry (props) {
	const [ masters ] = useState(props.masters)
	const [ select, setSelect ] = useState({ ...initEntry })
	const [ entry, setEntry ] = useState({ ...initEntry })
	const [ show, setShow ] = useState(false)

	useEffect(() => {
		getRecords(initEntry)
	}, [])

	const getRecords = (obj) =>
		db
			.getRecords(obj)
			.then((records) => {
				setEntry(null)
				setTimeout(() => setEntry({ ...obj, ...records[0] }), 10)
			})
			.catch((err) => {
				alert(err)
			})

	const updateSelect = (key, value) => {
		setSelect({ ...select, [key]: value })
		getRecords({ ...select, [key]: value })
	}
	const updateEntry = (key, value) => setEntry({ ...entry, [key]: value })

	const saveEntry = (e) => {
		db
			.saveRecord(entry)
			.then((data) => {
				//alert(JSON.stringify(data))
				alert('Data saved successfully')
			})
			.catch((err) => alert(JSON.stringify(err)))
	}

	return (
		<div style={{ width: '100%' }}>
			<div style={{ display: 'flex', width: '100%' }}>
				<div style={{ flex: 5, padding: 10 }}>
					<Typography variant='h5'>Performance</Typography>
				</div>
				<div style={{ flex: 1 }}>
					<Button label='Add / Update' onClick={() => setShow(true)} />
				</div>
			</div>
			{show && (
				<Dialog open={show} fullWidth maxWidth='md' onClose={() => setShow(false)}>
					<DialogContent>
						<DialogContentText>Save / Update record</DialogContentText>
						<div style={{ display: 'flex', marginTop: 10 }}>
							{masters && (
								<div style={{ padding: 10, flex: 7 }}>
									<RadioButtons
										label='Cloud'
										items={masters.cluster}
										value={select.cluster}
										onChange={(val) => updateSelect('cluster', val)}
									/>
									<RadioButtons
										label='Pattern'
										items={masters.pattern}
										value={select.pattern}
										onChange={(val) => updateSelect('pattern', val)}
									/>
									<RadioButtons
										label='Pods'
										items={masters.podSize}
										value={select.podSize}
										onChange={(val) => updateSelect('podSize', val)}
									/>
									<RadioButtons
										label='Consumers'
										items={masters.consumer}
										value={select.consumer}
										onChange={(val) => updateSelect('consumer', val)}
									/>
									<RadioButtons
										label='Message Size'
										items={masters.messageSize}
										value={select.messageSize}
										onChange={(val) => updateSelect('messageSize', val)}
									/>
									<RadioButtons
										label='Load Size'
										items={masters.loadSize}
										value={select.loadSize}
										onChange={(val) => updateSelect('loadSize', val)}
									/>
								</div>
							)}
							{entry && (
								<div style={{ padding: 10, paddingLeft: 30, flex: 3 }}>
									<TextBox
										label='Transmitted Bandwidth KBs'
										value={entry.transmittedBw}
										onChange={(e) => updateEntry('transmittedBw', e.target.value)}
									/>
									<TextBox
										label='Network Bandwidth KBs'
										value={entry.networkBw}
										onChange={(e) => updateEntry('networkBw', e.target.value)}
									/>
									<TextBox
										label='CPU Usage %'
										value={entry.cpu}
										onChange={(e) => updateEntry('cpu', e.target.value)}
									/>
									<TextBox
										label='Memory Usage Mib'
										value={entry.memory}
										onChange={(e) => updateEntry('memory', e.target.value)}
									/>
									<TextBox
										label='Duration in Seconds'
										value={entry.duration}
										onChange={(e) => updateEntry('duration', e.target.value)}
									/>
									<TextBox
										label='TPS'
										value={entry.tps}
										onChange={(e) => updateEntry('tps', e.target.value)}
									/>
									<br />
									<br />
									<br />
									<Button label='Save / Update' onClick={saveEntry} />
								</div>
							)}
						</div>
					</DialogContent>
					{/* <DialogActions>
						<Button onClick={() => setShow(false)} color='primary'>
							Close
						</Button>
					</DialogActions> */}
				</Dialog>
			)}
			{/* <div
				style={{
					paddingTop: 100,
					flex: 3,
					textAlign: 'center'
				}}
			>
				<Button label='Save / Update' onClick={saveEntry} />
				<Button label='Reset' onClick={saveEntry} secondary />
			</div> */}
		</div>
	)
}
