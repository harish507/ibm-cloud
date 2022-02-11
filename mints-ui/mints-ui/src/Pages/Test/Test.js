import React, { useState, useRef, useEffect } from 'react'
import TestCase from './TestCase'
import ServiceHelper from '../../Helpers/ServiceHelper'
import UIHelper from '../../Helpers/UIHelper'
import { Paper, Grid, Tooltip, Fab, Typography } from '@material-ui/core'
import DisplayLabel from '../../Controls/DisplayLabel'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

export default function Test (props) {
	const { match: { params } } = props
	const uiRef = useRef(null)
	const [ tid, setTid ] = useState(null)
	const [ method, setMethod ] = useState('')
	const [ feature, setFeature ] = useState(null)
	const [ details ] = useState(null)
	const [ services ] = useState(null)
	const [ target, setTarget ] = useState(null)
	const [ message, setMessage ] = useState(null)
	const [ response, setResponse ] = useState(null)
	const [ files, setFiles ] = useState([])
	const [ targetData, setTargetData ] = useState(null)

	// const replaceAll = (source, inText, outText) => {
	// 	inText = inText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	// 	return source.replace(new RegExp(inText, 'g'), outText)
	// }

	// const showFeature = (data) => {
	// 	if (data.payload && data.payload.integration && data.payload.defaults && data.payload.testTemplate) {
	// 		let list = {
	// 			INTID: data.payload.integration.id,
	// 			ENV: data.payload.integration.environment,
	// 			InletEncoding: '',
	// 			OutletEncoding: '',
	// 			SourceAppConnKey: _.startCase(_.camelCase(_.toLower(data.payload.integration.source))).replace(
	// 				new RegExp(' ', 'g'),
	// 				''
	// 			),
	// 			TargetAppConnKey: _.startCase(_.camelCase(_.toLower(data.payload.integration.target))).replace(
	// 				new RegExp(' ', 'g'),
	// 				''
	// 			),
	// 			...data.payload.defaults
	// 		}
	// 		data.payload.integration.routes.forEach((route) => {
	// 			Object.keys(route.properties).forEach((prop) => {
	// 				list[prop] = route.properties[prop]
	// 			})
	// 		})
	// 		//alert(JSON.stringify(list, null, '\t'))
	// 		let tmp = data.payload.testTemplate
	// 		Object.keys(list).forEach((key) => {
	// 			tmp = replaceAll(tmp, '[' + key + ']', list[key])
	// 		})
	// 		//alert(tmp)
	// 		setDetails(data.payload.integration)
	// 		setFeature(tmp)
	// 	}
	// 	if (data.payload && data.payload.services) {
	// 		setServices(data.payload.services)
	// 	}
	// 	if (data.error) {
	// 		uiRef.current.Error(data.error)
	// 		setMessage(data.error)
	// 	}
	// 	setMethod('')
	// }

	const saveTest = (e) => {
		//alert(JSON.stringify(target, null, 4))
		let valid = true
		if (target.background.filter((rule) => rule.value === '').length > 0) {
			uiRef.current.Error('Please provide valid input for all fields')
			valid = false
		} else {
			target.scenarios.forEach((scenario) => {
				if (scenario.rules.filter((rule) => rule.value === '').length > 0) {
					uiRef.current.Error('Please provide valid input for all fields')
					valid = false
				}
				if (scenario.examples.length === 1) {
					uiRef.current.Error('Please provide at-least one example data')
					valid = false
				}
			})
		}
		if (valid) {
			const formData = new FormData()
			files.forEach((f) => {
				formData.append(f.name, f, f.name)
			})
			formData.append('info', JSON.stringify({ target, service: services[0] }))
			setTargetData(formData)
			setMethod('save')
		}
	}

	const showResult = (result) => {
		uiRef.current.Success(result)
		setMethod('')
		setFeature(null)
		setTarget(null)
		setMessage(result.message)
		setResponse(result.response)
	}

	useEffect(
		() => {
			getFeature(params.id)
		},
		[ params.id ]
	)

	const getFeature = (id) => {
		setTid(id)
		setMethod('get')
	}

	const showTestUI = ({ integration, services }) => {
		if (services.length > 0) {
			let keys = integration.keys ? '?' : ''
			if (integration.keys) {
				Object.keys(integration.keys).forEach((key) => (keys += key + '=' + integration.keys[key]))
			}
			//window.open('http://localhost:5000/projects/DATA/integration/' + integration.name + keys, '_top')
			//window.open(services[0].url + integration.name + keys, '_blank')
			//window.location.href = '/integrations'
			window.location.href = services[0].url + integration.name + keys
		} else {
			uiRef.current.Error('Integration Testing Service not configured, please contact your administrator.')
		}
	}

	return (
		<div className='content'>
			<UIHelper ref={uiRef} />

			{method === 'get' &&
			tid !== null && (
				<ServiceHelper
					path={'integrationTest/' + tid} //testTemplates && call showFeature()
					render={(result) => {
						return (
							<div>
								{uiRef && uiRef.current && uiRef.current.Loading(result.loading)}
								{(result.error || result.payload) && showTestUI(result.payload)}
							</div>
						)
					}}
				/>
			)}
			{method === 'save' && (
				<ServiceHelper
					method='post'
					path='testCase'
					optHeaders={{ 'Content-type': 'multipart/form-data' }}
					// input={{ target, service: services[0] }}
					input={targetData}
					render={(result) => {
						return (
							<div>
								{uiRef && uiRef.current && uiRef.current.Loading(result.loading)}
								{result.error && uiRef.current.Error(result.error)}
								{result.payload && showResult(result.payload)}
							</div>
						)
					}}
				/>
			)}
			{details && (
				<Paper style={{ paddingLeft: 10, marginBottom: 20, height: 60 }}>
					<Grid container spacing={1} alignItems='center'>
						<Grid item md={3}>
							<DisplayLabel label='Integration' text={details.id + ' - ' + details.name} />
						</Grid>
						<Grid item md={3}>
							<DisplayLabel label='Template' text={details.template.id + ' - ' + details.template.name} />
						</Grid>
						<Grid item md={4}>
							<DisplayLabel label='Applications' text={details.source + ' -> ' + details.target} />
						</Grid>
						<Grid item md={1}>
							{feature && (
								<Tooltip title='Continue'>
									<Fab variant='extended' color='primary' onClick={saveTest}>
										Continue <ArrowForwardIosIcon />
									</Fab>
								</Tooltip>
							)}
						</Grid>
					</Grid>
				</Paper>
			)}

			{feature !== null && (
				<TestCase
					details={details}
					source={feature}
					update={setTarget}
					uiRef={uiRef.current}
					updateFiles={setFiles}
				/>
			)}
			{message !== null && (
				<div style={{ textAlign: 'center', width: '100%', marginBottom: 20 }}>
					<Typography variant='h6' color={message.includes('Test initiated') ? 'primary' : 'secondary'}>
						{message}
					</Typography>
				</div>
			)}
			{response && <div dangerouslySetInnerHTML={{ __html: response }} />}
		</div>
	)
}
