import React, { useState, useEffect } from 'react'
import TextBox from '../../Controls/TextBox'
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, Grid } from '@material-ui/core'
import FormatList from './FormatList'

export default function FormatEntry(props) {

	const [items, setItems] = useState(props.config)
	const [selected, setSelected] = useState(null)
	const [details, setDetails] = useState(null)

	useEffect(
		() => {
			setItems(props.config)
			if (selected && selected.palette) {
				if (selected.palette._id) {
					showSelected(selected.palette._id)
				} else {
					showSelected(selected.palette)
				}
			}
			// setTimeout(() => {
			// 	setItems(props.config)
			// }, 10)
		},
		[props.config, selected]
	)

	const showSelected = (item) => {
		setSelected(null)
		setDetails(null)
		setTimeout(() => {
			setSelected(item)
			setDetails(
				JSON.stringify(
					{
						inputs: item.info ? item.info.inputs : {},
						outputs: item.info ? item.info.outputs : [],
						xml: item.info ? item.info.xml : {}
					},
					null,
					4
				)
			)
		}, 10)
	}

	const validateDetails = () => {
		let invalid = false
		try {
			invalid = JSON.parse(details) ? false : true
		} catch (error) {
			invalid = true
		}
		return invalid
	}
	const submitForm = () => {
		//e.preventDefault()
		if (!validateDetails()) {
			let tmp = { ...JSON.parse(details), version: selected.version, palette: selected.id }
			if (selected.info && selected.info._id) {
				tmp._id = selected.info._id
			}
			props.onSave(tmp)
		}
	}

	return (
		<div>
			<Dialog open={items ? true : false} onClose={props.onCancel} maxWidth='md' fullWidth>
				<DialogTitle>Palettes Configuration</DialogTitle>
				<DialogContent style={{ height: 300, overflow: 'auto' }}>
					<Grid container spacing={0}>
						<Grid item md={3}>
							{/* {JSON.stringify(items)} */}
							<FormatList items={Object.values(items)} selected={selected} setSelected={showSelected} />
						</Grid>
						<Grid item md={9}>
							{details !== null && (
								<TextBox
									multiline
									rows='14'
									label='Format Configuration'
									value={details}
									onChange={(e) => setDetails(e.target.value)}
									error={validateDetails()}
								/>
							)}
						</Grid>
					</Grid>
				</DialogContent>

				<DialogActions>
					<Button variant='outlined' onClick={props.onCancel} color='primary'>
						Close
					</Button>
					<Button
						variant='contained'
						type='submit'
						disabled={validateDetails()}
						onClick={submitForm}
						color='primary'
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
