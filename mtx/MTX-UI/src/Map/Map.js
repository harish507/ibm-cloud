import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import RestHelper from '../Helpers/RestHelper'

import MapDetails from './MapDetails'
import MapDesign from './MapDesign'

const initMap = {
	id: '',
	name: '',
	project: '',
	className: '',
	sourceType: 'XML',
	targetType: 'XML',
	sourceFields: [],
	targetFields: [],
	sFile: '',
	tFile: ''
}

export default function Map (props) {
	const [ step, setStep ] = useState('details')
	const [ className, setClassName ] = useState('')
	const [ map, setMap ] = useState(null)
	const [ functions, setFunctions ] = useState(null)

	useEffect(
		() => {
			RestHelper.get('functions')
				.then((obj) => {
					if (obj && obj.Success) {
						setFunctions(obj.Result)
					} else {
						props.uiRef.Error(obj.Message)
					}
				})
				.catch((err) => props.uiRef.Error(err))
			if (props.id !== undefined) {
				RestHelper.get('map/' + props.project + '/' + props.id)
					.then((obj) => {
						if (obj && obj.Success) {
							setMap(null)
							setClassName(obj.Result.className)
							setStep(null)
							setTimeout(() => {
								setMap({ ...obj.Result, sourceFile: null, targetFile: null })
								setStep('output')
							}, 10)
						} else {
							props.uiRef.Error(obj.Message)
						}
					})
					.catch((err) => props.uiRef.Error(err))
			} else {
				setMap(null)
				setTimeout(() => {
					setStep('details')
					setMap(initMap)
				}, 10)
			}
		},
		[ props.id, props.project, props.uiRef ]
	)

	const saveDetails = (details) => {
		let uiRef = props.uiRef
		if (!details.name || !details.project) {
			uiRef.Error('Please enter Name and Project name')
		} else if (!details.sourceFile && !details.targetFile) {
			if (map.sFile !== '' && map.tFile !== '') skipUpload()
			else uiRef.Error('Please select both Source & Target definition files')
		} else if (!details.sourceFile || !details.targetFile) {
			uiRef.Error('Please select both Source & Target definition files')
		} else {
			setClassName(details.targetFile.name.split('.')[0])
			uiRef.Loading(true)
			const formData = new FormData()
			formData.append('sourceFile', details.sourceFile)
			formData.append('targetFile', details.targetFile)
			formData.append(
				'info',
				JSON.stringify({
					id: details.id,
					name: details.name,
					project: details.project,
					sourceType: details.sourceType,
					targetType: details.targetType
				})
			)
			RestHelper.post('mapDetails', formData, true)
				.then((resp) => {
					uiRef.Loading(false)
					if (resp.Success && resp.Result) {
						setMap({
							...map,
							...details,
							sFile: resp.Result.sFile,
							tFile: resp.Result.tFile,
							sourceFields: resp.Result.source,
							targetFields: resp.Result.target
						})
						setClassName(
							_.startCase(_.camelCase(resp.Result.target[0].name)).replace(new RegExp(' ', 'g'), '')
						)
						setStep('design')
					} else {
						uiRef.Error(resp.Message)
					}
				})
				.catch((error) => {
					uiRef.Loading(false)
					uiRef.Error(error)
				})
		}
	}

	const saveMap = (details) => {
		let uiRef = props.uiRef
		details.className = className
		RestHelper.post('map', details)
			.then((resp) => {
				uiRef.Loading(false)
				if (resp && resp.Success) {
					uiRef.Success('Map generated successfully.')
					window.location.href = '/map/' + resp.Result.project + '/' + resp.Result.id
				} else {
					uiRef.Error(resp.Message)
				}
			})
			.catch((error) => {
				uiRef.Loading(false)
				uiRef.Error(error)
			})
	}

	const editMap = () => {
		setStep('details')
	}
	const skipUpload = () => {
		setStep('design')
	}

	const updateMap = (details) => {
		let uiRef = props.uiRef
		details.className = className
		RestHelper.post('map', details)
			.then((resp) => {
				uiRef.Loading(false)
				if (resp && resp.Success) {
					uiRef.Success('Map generated successfully.')
					window.location.href = '/map/' + resp.Result.project + '/' + resp.Result.id
				} else {
					uiRef.Error(resp.Message)
				}
			})
			.catch((error) => {
				uiRef.Loading(false)
				uiRef.Error(error)
			})
	}

	return (
		map && (
			<div>
				<h3>{map.id && map.id !== '' ? map.project + ' > ' + map.name : 'New Map'}</h3>
				{step === 'details' && (
					<MapDetails map={map} saveDetails={saveDetails} skipUpload={skipUpload} functions={functions} />
				)}
				{step === 'design' && (
					<MapDesign map={map} saveMap={saveMap} updateMap={updateMap} functions={functions} />
				)}
				{step === 'output' && <MapDesign map={map} editMap={editMap} functions={functions} />}
			</div>
		)
	)
}
