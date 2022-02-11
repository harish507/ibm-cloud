import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import {
	Button,
	InputLabel,
	Dialog,
	DialogActions,
	DialogContent,
	Table,
	TableRow,
	TableHead,
	TableCell,
	TableBody,
	Typography
} from '@material-ui/core'

// import AddCircleIcon from '@material-ui/icons/AddCircle'
// import DeleteIcon from '@material-ui/icons/Delete'
import SwitchControl from './SwitchControl'
import FieldSet from './FieldSet'
import RadioSelection from './RadioSelection'
import TextBox from './TextBox'

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

export default function ObjectListSelection (props) {
	const classes = useStyles()
	const [ list ] = useState(props.source.map((obj) => ({ ...obj })))
	const [ data, setData ] = useState(null)
	const [ output, setOutput ] = useState(null)

	useEffect(
		() => {
			try {
				let tmp = []
				list.forEach((item) => {
					let ext = props.value.filter((x) => x.name === item.name)
					if (ext.length > 0) {
						tmp.push({ ...ext[0], selected: true })
					} else {
						tmp.push({ ...item, selected: false })
					}
				})
				setData(tmp)
			} catch (error) {
				alert(error)
				setData(null)
			}
		},
		[ props.value, list ]
	)

	const showData = () => {
		setOutput(data.map((obj) => ({ ...obj })))
	}
	const handleClose = () => {
		setOutput(null)
	}
	const handleOk = () => {
		props.onChange(output.filter((item) => item.selected === true))
		setOutput(null)
	}

	const selectionChanged = (ind) => {
		let tmp = [ ...output ]
		tmp[ind].selected = !tmp[ind].selected
		setOutput(tmp)
	}
	const propChanged = (ind, pInd, val) => {
		let tmp = [ ...output ]
		tmp[ind].properties[pInd].value = val
		setOutput(tmp)
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
					<div className={classes.content}>
						{data.map((item) => {
							if (item.selected) {
								return <span key={item.name}>{item.name} </span>
							} else {
								return null
							}
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
										<TableCell
											style={{
												textAlign: 'center',
												display: 'flex',
												flexDirection: 'row'
											}}
										>
											{output.map((ctl, ind) => {
												return (
													<div
														key={ind}
														style={{
															display: 'flex',
															flexDirection: 'row',
															marginRight: 10
														}}
													>
														<SwitchControl
															checked={ctl.selected}
															onChange={(e) => selectionChanged(ind)}
														/>
														<Typography variant='body1' style={{ marginLeft: 5 }}>
															{ctl.name}
														</Typography>
													</div>
												)
											})}
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell
											style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}
										>
											{output.map((item, ind) => {
												if (item.selected) {
													return (
														<FieldSet key={ind} label={item.name}>
															{item.properties.map((prop, pInd) => {
																if (prop.options) {
																	return (
																		<RadioSelection
																			key={pInd}
																			items={prop.options}
																			label={prop.name}
																			value={prop.value}
																			onChange={(e) =>
																				propChanged(ind, pInd, e.target.value)}
																		/>
																	)
																} else {
																	return (
																		<TextBox
																			key={pInd}
																			label={prop.name}
																			value={prop.value}
																			onChange={(e) =>
																				propChanged(ind, pInd, e.target.value)}
																		/>
																	)
																}
															})}
														</FieldSet>
													)
												} else {
													return null
												}
											})}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
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
