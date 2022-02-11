import React, { useState, useEffect } from 'react'
import { Fab, Grid, Typography } from '@material-ui/core'
import TextBox from '../../Controls/TextBox'
import ServiceHelper from '../../Helpers/ServiceHelper'
import RadioSelection from '../../Controls/RadioSelection'
import SaveIcon from '@material-ui/icons/Save'
import ReplayIcon from '@material-ui/icons/Replay'

export default function ContactUs ({ uiRef }) {
	const [ properties, setProperties ] = useState([])
	const [ options, setOptions ] = useState(null)
	const [ method, setMethod ] = useState('')

	useEffect(() => {
		setMethod('options')
	}, [])

	const showProperties = (value) => {
		let newValue = value
			.split('\r\n')
			.filter((p) => p.length > 0 && p[0] !== '#')
			.map((x) => [ [ x.split('=')[0] ], x.split('=')[1] ])
		setProperties(newValue)
		setMethod('')
	}
	const showOptions = (opts) => {
		let list = {}
		opts.forEach((opt) => (list[opt.key] = opt))
		setOptions(list)
		setMethod('get')
	}
	const showStatus = () => {
		uiRef.Success('Configuration updated successfully.')
		setMethod('get')
	}
	const setPropValue = (i, val) => {
		var newProps = [ ...properties ]
		newProps[i] = [ properties[i][0], val ]
		setProperties(newProps)
	}

	const saveConfiguration = (e) => {
		setMethod('post')
	}

	const getControl = (key, val, ind) => {
		if (!key || !options[key]) {
			return <TextBox label={key} value={val} onChange={(e) => setPropValue(ind, e.target.value)} />
		} else {
			if (options[key].type === 'choose') {
				return (
					<RadioSelection
						items={options[key].options}
						label={key}
						value={val}
						onChange={(e) => setPropValue(ind, e.target.value)}
					/>
				)
			} else {
				return <TextBox label={key} value={val} onChange={(e) => setPropValue(ind, e.target.value)} />
			}
		}
	}

	return (
		<div>
			<Grid container spacing={1}>
				<Grid item md={9}>
					<Typography variant='h4'>Configuration</Typography>
				</Grid>
				<Grid item md={3} style={{ marginBottom: 20 }}>
					<Fab variant='extended' color='secondary' onClick={() => setMethod('get')}>
						<ReplayIcon /> <Typography variant='button'>Reset</Typography>
					</Fab>
					<Fab variant='extended' color='primary' onClick={saveConfiguration}>
						<SaveIcon /> <Typography variant='button'>Save</Typography>
					</Fab>
				</Grid>
			</Grid>

			{method === 'get' && (
				<ServiceHelper
					path='admin/configuration'
					render={(data) => {
						return (
							<div>
								{data.payload && showProperties(data.payload)}
								{uiRef && uiRef.Loading(data.loading)}
							</div>
						)
					}}
				/>
			)}
			{method === 'options' && (
				<ServiceHelper
					path='masters/configurationOptions'
					render={(data) => {
						return (
							<div>
								{data.payload && showOptions(data.payload)}
								{uiRef && uiRef.Loading(data.loading)}
							</div>
						)
					}}
				/>
			)}

			{method === 'post' && (
				<ServiceHelper
					method='post'
					path={'admin/configuration'}
					input={{ properties }}
					render={(data) => {
						return (
							<div>
								{data.payload && showStatus()}
								{uiRef && uiRef.Loading(data.loading)}
							</div>
						)
					}}
				/>
			)}

			<div style={{ padding: 10, paddingLeft: 30 }}>
				<Grid container spacing={1}>
					{properties.map((p, i) => {
						return (
							<Grid key={i} item md={4}>
								{getControl(p[0], p[1], i)}
							</Grid>
						)
					})}
				</Grid>
			</div>
		</div>
	)
}
