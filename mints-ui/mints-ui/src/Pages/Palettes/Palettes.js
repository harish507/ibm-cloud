import React, { useState } from 'react'
import ServiceHelper from '../../Helpers/ServiceHelper'
// import _ from 'lodash'
import Items from './Items'
import Entry from './Entry'
import Icons from './Icons'
import { Grid } from '@material-ui/core'
import Details from './Details'

export default function Palettes (props) {
	const { uiRef } = props
	const [ method, setMethod ] = useState('get')
	const [ palettes, setPalettes ] = useState({})
	const [ entry, setEntry ] = useState(null)
	const [ icon, setIcon ] = useState(null)
	const [ palette, setPalette ] = useState(null)
	const [ PID, setPID ] = useState(null)

	const newPalette = {
		group: 'Inputs & Outputs',
		name: '',
		type: 'inlet',
		icon: 'faQuestion',
		properties: []
	}

	const loadData = (data) => {
		setMethod('')
		setPalettes(data)
	}
	// const showPalette = (item) => {
	// 	setPalette(null)
	// 	if (item) {
	// 		setTimeout(() => {
	// 			setPalette({ ...item })
	// 		}, 10)
	// 	}
	// }
	const showPalette = (ind) => {
		setPalette(null)
		setPID(ind)
		setTimeout(() => {
			if (ind < palettes.length) {
				setPalette({ ...palettes[ind] })
			} else {
				setPalette({ ...newPalette })
			}
		}, 10)
	}
	const deleteProp = (ind) => {
		let list = [ ...palette.properties ]
		list.splice(ind, 1)
		setPalette(null)
		setTimeout(() => {
			setPalette({ ...palette, properties: list })
		}, 10)
	}

	const handleChange = (key, value) => {
		// val newPalette = {...palette}
		// setPalette(null)
		setPalette({ ...palette, [key]: value })
	}
	const updateProp = (item, ind) => {
		let newProps = [ ...palette.properties ]
		if (ind < palette.properties.length) {
			newProps[ind] = { ...item, value: item.type === 'boolean' ? false : null }
		} else {
			newProps.push({ ...item, value: item.type === 'boolean' ? false : null })
		}
		setEntry(null)
		setPalette(null)
		setTimeout(() => {
			setPalette({ ...palette, properties: newProps })
		}, 10)
	}
	const updateIcon = (item) => {
		setIcon(null)
		setPalette(null)
		setTimeout(() => {
			setPalette({ ...palette, icon: item })
		}, 10)
	}
	const showEntry = (item) => {
		setEntry(item)
	}
	const showIcons = (item) => {
		setIcon(item)
	}
	const resetPalette = () => {
		showPalette(PID)
	}
	const updatePalette = () => {
		if (
			!palette.name ||
			palette.name.trim() === '' ||
			!palette.group ||
			palette.group.trim() === '' ||
			!palette.type ||
			palette.type.trim() === '' ||
			palette.properties.length === 0
		) {
			uiRef.Error('Please provide Name, Group, Style & at-least one property')
		} else {
			setMethod(palette._id ? 'put' : 'post')
		}
	}
	const deletePalette = (item) => {
		props.uiRef.Confirm(
			'Are you sure to delete the item ?',
			() => {
				setMethod('delete')
			},
			() => {}
		)
	}
	const showError = (result) => {
		uiRef.Error(result)
		setMethod('')
	}
	const showStatus = (result) => {
		if (method === 'delete') {
			setPalette(null)
			uiRef.Success('Palette deleted successfully. ')
		} else {
			setPalette({ ...palette, _id: result._id })
			uiRef.Success('Palette saved successfully. ')
		}
		setMethod('get')
	}

	return (
		<div style={{ paddingTop: 30 }}>
			{method === 'get' && (
				<ServiceHelper
					path='palettes/all'
					render={(palettes) => {
						return (
							<div>
								{uiRef && uiRef.Loading(palettes.loading)}
								{palettes.payload && loadData(palettes.payload)}
							</div>
						)
					}}
				/>
			)}
			{(method === 'post' || method === 'put' || method === 'delete') && (
				<ServiceHelper
					method={method}
					path={'palettes/' + (palette._id ? palette._id : '')}
					input={{ ...palette }}
					render={(result) => {
						return (
							<div>
								{uiRef.Loading(result.loading)}
								{result.error && showError(result.error)}
								{result.payload && showStatus(result.payload)}
							</div>
						)
					}}
				/>
			)}

			<Grid container spacing={4} alignContent='flex-start' alignItems='flex-start'>
				{/* <Grid item md={1} sm={12}></Grid> */}
				<Grid item sm={2}>
					<Items items={palettes} palette={palette} showPalette={showPalette} />
				</Grid>
				{palette && (
					<Grid item sm={10}>
						<Details
							palette={palette}
							groups={[ ...new Set(palettes.map((p) => p.group)) ]}
							handleChange={handleChange}
							showIcons={showIcons}
							showEntry={showEntry}
							deleteProp={deleteProp}
							resetPalette={resetPalette}
							updatePalette={updatePalette}
							deletePalette={deletePalette}
						/>
					</Grid>
				)}
				{entry && <Entry uiRef={uiRef} entry={entry} updateProp={updateProp} onCancel={() => setEntry(null)} />}
				{icon && <Icons uiRef={uiRef} icon={icon} updateIcon={updateIcon} onCancel={() => setIcon(null)} />}
			</Grid>
		</div>
	)
}
