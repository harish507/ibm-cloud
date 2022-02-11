import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import {
	Button,
	InputLabel,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	Table,
	TableRow,
	TableHead,
	TableCell,
	TableBody
} from '@material-ui/core'

import AddCircleIcon from '@material-ui/icons/AddCircle'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: 5,
		border: '1px solid #ccc',
		borderRadius: 5,
		minHeight: 51,
		width: '100%',
		textAlign: 'left',
		'&:hover': {
			border: '1px solid #000'
		}
	},
	label: {
		background: '#eee',
		padding: '0 3px 0 3px'
	},
	content: {
		// margin: 5,
		display: 'flex',
		flexDirection: 'column',
		height: 40,
		width: '100%',
		textAlign: 'left',
		paddingTop: 10,
		overflow: 'auto'
	}
}))

export default function ObjectEntryControl (props) {
	const classes = useStyles()
	const [ data, setData ] = useState(null)
	const [ output, setOutput ] = useState(null)
	const [ newKey, setNewKey ] = useState('')
	const [ newVal, setNewVal ] = useState('')

	useEffect(
		() => {
			try {
				setData(props.value)
			} catch (error) {
				alert(error)
				setData(null)
			}
		},
		[ props.value ]
	)

	const showData = () => {
		setOutput({ ...data })
	}
	const handleClose = () => {
		setOutput(null)
	}
	const handleOk = () => {
		props.onChange({ ...output })
		setData({ ...output })
		setOutput(null)
	}
	const addKey = () => {
		if (newKey.trim() === '' || newVal.trim() === '') return
		setOutput({ ...output, [newKey]: newVal })
		setNewKey('')
		setNewVal('')
	}
	const removeKey = (i) => {
		let out = { ...output }
		delete out[Object.keys(output)[i]]
		setOutput({ ...out })
	}

	return (
		<FormControl variant='outlined' className={classes.formControl}>
			<InputLabel shrink={true} className={classes.label}>
				{props.label}
			</InputLabel>

			{data && (
				<Button
					variant='text'
					onClick={showData}
					style={{
						width: '100%',
						maxHeight: '50px',
						minHeight: '50px',
						textTransform: 'none'
					}}
				>
					<div className={classes.content} style={{paddingLeft: 10}}>
						{JSON.stringify(data)
							.replace('{', '')
							.replace('}', '')
							.replace(new RegExp('"', 'g'), ' ')
							.split(',')
							.map((h, i) => {
								return <span>{h.trim()}</span>
							})}
					</div>
				</Button>
			)}

			{output && (
				<Dialog open={output ? true : false} maxWidth='sm' fullWidth onClose={handleClose}>
					<form onSubmit={handleOk}>
						<DialogContent>
							<Table size='small' margin='dense'>
								<TableHead>
									<TableRow style={{ backgroundColor: '#ddd' }}>
										<TableCell style={{ textAlign: 'center' }}>Key</TableCell>
										<TableCell style={{ textAlign: 'center' }}>Value</TableCell>
										<TableCell style={{ textAlign: 'center' }} width={30}>
											Action
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{Object.keys(output).map((row, ind) => {
										return (
											<TableRow key={ind}>
												<TableCell>{row}</TableCell>
												<TableCell>{output[row]}</TableCell>
												<TableCell>
													<Button onClick={() => removeKey(ind)}>
														<DeleteIcon />
													</Button>
												</TableCell>
											</TableRow>
										)
									})}
									<TableRow style={{ backgroundColor: '#ddd' }}>
										<TableCell>
											<TextField
												placeholder='Key'
												value={newKey}
												onChange={(e) => setNewKey(e.target.value)}
											/>
										</TableCell>
										<TableCell>
											<TextField
												placeholder='Value'
												value={newVal}
												onChange={(e) => setNewVal(e.target.value)}
											/>
										</TableCell>
										<TableCell>
											<Button onClick={() => addKey()}>
												<AddCircleIcon />
											</Button>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
							{/* <DialogContentText>Enter value for {props.label}</DialogContentText>
						<TextField autoFocus fullWidth value={newItem} onChange={(e) => setNewItem(e.target.value)} /> */}
						</DialogContent>
						<DialogActions>
							<Button variant='outlined' onClick={handleClose} color='primary'>
								Cancel
							</Button>
							<Button variant='contained' type='submit' color='primary'>
								Ok
							</Button>
						</DialogActions>
					</form>
				</Dialog>
			)}
		</FormControl>
	)
}
