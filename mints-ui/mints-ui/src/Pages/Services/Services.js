import React, { useState } from 'react'
import ServiceHelper from '../../Helpers/ServiceHelper'
import { Grid, Button } from '@material-ui/core'
import AddServices from './AddServices'
import List from './List'
import ServiceDetails from './ServicesDetails'
import FormatEntry from './FormatEntry'
import PublishEntry from './PublishEntry'
import IbmMqEntry from './IbmMqEntry'
import ServicesEntries from './ServicesEntries'

export default function Services (props) {
	const { uiRef } = props
	const [ method, setMethod ] = useState('get')
	const [ services, setServices ] = useState({})
	const [ service, setService ] = useState([])
	const [ selected, setSelected ] = useState(null)
	const [ data, setData ] = useState('format')
	const [ add, setAdd ] = useState(false)
	const [ addService, setAddService ] = useState({
		type: 'format',
		name: '',
		version: '',
		active: false,
		default: false,
		url: ''
	})

	const [ serviceEntries, setServiceEntries ] = useState({})
	const [ formatServiceConfig, setFormatServiceConfig ] = useState(null)
	const [ publishServiceConfig, setPublishServiceConfig ] = useState(null)
	const [ ibmMqServiceConfig, setIbmMqServiceConfig ] = useState(null)
	const [ allServiceConfig, setAllServiceConfig ] = useState(null)

	const [ publishData, setPublishData ] = useState(null)
	const [ formatData, setFormatData ] = useState(null)
	const [ ibmMqData, setIbmMqData ] = useState(null)

	const [ servicesActive, setServicesActive ] = useState({})

	const loadData = (_data) => {
		setServices(_data)
		setMethod('')
		//setService(null)
		setServicesActive(null)
		setTimeout(() => {
			loadServices(data)
			setService({ ...Object.values(_data) })
		}, 10)
	}

	const loadServices = (item) => {
		setData(item)
		setMethod('')
		setService({ ...Object.values(services) })
		setFormatServiceConfig(null)
		setPublishServiceConfig(null)
		setIbmMqServiceConfig(null)
		setAllServiceConfig(null)
		setSelected(item)
	}
	const allServiceEntries = (item) => {
		if (data === 'format' || data === 'publish' || data === 'ibmMq') {
			setAllServiceConfig(null)
			setServiceEntries(item)
		} else {
			setAllServiceConfig(item)
			setServiceEntries('')
		}
	}

	const showServiceConfig = (config) => {
		if (serviceEntries.type === 'format') {
			setFormatServiceConfig({ ...config })
			setServiceEntries('')
		} else {
			if (serviceEntries.type === 'publish') {
				setPublishServiceConfig({ ...config })
				setServiceEntries('')
			} else {
				if (serviceEntries.type === 'ibmMq') {
					setIbmMqServiceConfig({ ...config })
					setServiceEntries('')
				}
			}
		}
	}

	const changeServicesActive = (data) => {
		setServicesActive(data)
		setMethod('format')
	}

	const onCreate = () => {
		setAdd(true)
	}

	const submitService = (e) => {
		e.preventDefault()
		setMethod('post')
	}
	const updateAllServiceConfig = (e) => {
		e.preventDefault()
		setMethod('put')
	}

	const handleChange = (key, value) => {
		setAddService({ ...addService, [key]: value })
	}
	const handleConfigChange = (e) => {
		e.preventDefault()
		setAllServiceConfig({ ...allServiceConfig, url: e.target.value })
	}

	const showError = (result) => {
		uiRef.Error(result)
		//setMethod('')
	}
	const showStatus = (_result) => {
		//setServices({ ...services, _id: result._id })
		//uiRef.Success('update')
		setMethod('get')
		setAdd(null)
		setAllServiceConfig(null)
		uiRef.Success('Configuration updated successfully')
	}

	const savePublishConfig = (items, env) => {
		let tmp = { ...items[env], version: serviceEntries.version, environment: env }
		setMethod('publishSave')
		setPublishData(tmp)
	}
	const updatePublishStatus = (result) => {
		if (result._id) {
			let tmp = { ...publishServiceConfig }
			tmp[result.environment] = result
			setPublishServiceConfig(tmp)
		}
		setMethod('')
	}

	const saveFormatConfig = (config) => {
		setMethod('formatSave')
		setFormatData(config)
	}

	const updateFormatStatus = (result) => {
		if (result._id) {
			let tmp = { ...formatServiceConfig }
			if (result.palette._id) {
				tmp[result.palette._id].info = result
			} else {
				tmp[result.palette].info = result
			}

			setFormatServiceConfig(tmp)
		}
		setMethod('')
	}
	const saveIbmMqConfig = (items) => {
		//let tmp = { ...items[env], version: ibmMqEntry.version }
		setMethod('ibmMqSave')
		setIbmMqData(items)
	}
	const updateIbmMqStatus = (result) => {
		if (result._id) {
			let tmp = { ...ibmMqServiceConfig }
			setIbmMqServiceConfig(tmp)
		}
		setMethod('')
	}
	const closeServiceConfig = () => {
		setFormatServiceConfig(null)
		setPublishServiceConfig(null)
		setIbmMqServiceConfig(null)
		setAllServiceConfig(null)
	}

	return (
		<div className='content'>
			{method === 'get' && (
				<ServiceHelper
					path='allServices'
					render={(services) => {
						return (
							<div>
								{services.payload && loadData(services.payload)}
								{uiRef && uiRef.Loading(services.loading)}
							</div>
						)
					}}
				/>
			)}

			{method === 'post' && (
				<ServiceHelper
					method={method}
					path={'allServices'}
					input={{
						type: addService.type,
						name: addService.name,
						version: addService.version,
						active: false,
						default: false,
						url: addService.url
					}}
					render={(result) => {
						return (
							<div>
								{/* {uiRef.Loading(result.loading)} */}
								{result.error && showError(result.error)}
								{result.payload && showStatus(result.payload)}
							</div>
						)
					}}
				/>
			)}

			{method === 'put' && (
				<ServiceHelper
					method={method}
					path={'allServices/' + allServiceConfig._id}
					input={{ ...allServiceConfig }}
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

			{method === 'format' && (
				<ServiceHelper
					method='post'
					path='services'
					input={servicesActive}
					render={(services) => {
						return (
							<div>
								{uiRef && services.error && uiRef.Error(services.error)}
								{uiRef && uiRef.Loading(services.loading)}
								{services.payload && setMethod('')}
							</div>
						)
					}}
				/>
			)}
			{serviceEntries.type === 'format' && (
				<ServiceHelper
					path={'formatConfig/' + serviceEntries.version}
					render={(config) => {
						return (
							<div>
								{config.payload && showServiceConfig({ ...config.payload })}
								{uiRef && uiRef.Loading(config.loading)}
							</div>
						)
					}}
				/>
			)}
			{serviceEntries.type === 'publish' && (
				<ServiceHelper
					path={'publishConfig/' + serviceEntries.version}
					render={(config) => {
						return (
							<div>
								{config.payload && showServiceConfig({ ...config.payload })}
								{uiRef && uiRef.Loading(config.loading)}
							</div>
						)
					}}
				/>
			)}
			{serviceEntries.type === 'ibmMq' && (
				<ServiceHelper
					path={'ibmMqConfig/' + serviceEntries.version}
					render={(config) => {
						return (
							<div>
								{config.payload && showServiceConfig({ ...config.payload })}
								{uiRef && uiRef.Loading(config.loading)}
							</div>
						)
					}}
				/>
			)}

			{method === 'publishSave' &&
			publishData && (
				<ServiceHelper
					method='post'
					path='publishConfig'
					input={publishData}
					render={(result) => {
						return (
							<div>
								{uiRef && uiRef.Loading(result.loading)}
								{uiRef && result.error && uiRef.Error(result.error)}
								{result.payload &&
									uiRef.Success(
										"Configuration saved successfully for '" +
											publishData.environment +
											"' environment"
									)}
								{result.payload && updatePublishStatus(result.payload)}
							</div>
						)
					}}
				/>
			)}
			{method === 'formatSave' &&
			formatData && (
				<ServiceHelper
					method='post'
					path='formatConfig'
					input={formatData}
					render={(result) => {
						return (
							<div>
								{uiRef && uiRef.Loading(result.loading)}
								{uiRef && result.error && uiRef.Error(result.error)}
								{result.payload && uiRef.Success('Configuration saved successfully.')}
								{result.payload && updateFormatStatus(result.payload)}
							</div>
						)
					}}
				/>
			)}
			{method === 'ibmMqSave' &&
			ibmMqData && (
				<ServiceHelper
					method='post'
					path='ibmMqConfig'
					input={ibmMqData}
					render={(result) => {
						return (
							<div>
								{uiRef && uiRef.Loading(result.loading)}
								{uiRef && result.error && uiRef.Error(result.error)}
								{result.payload && uiRef.Success('Configuration saved successfully.')}
								{result.payload && updateIbmMqStatus(result.payload)}
							</div>
						)
					}}
				/>
			)}
			<Grid container spacing={4} alignContent='flex-start' alignItems='flex-start'>
				<Grid item sm={2}>
					<div className='palette-group'>
						<Button
							style={{ textTransform: 'none', width: '100%', padding: 3, margin: 0 }}
							onClick={() => onCreate()}
						>
							New Service
						</Button>
					</div>
					{services && <List services={services} loadServices={loadServices} selected={selected} />}
				</Grid>
				<Grid item sm={10}>
					{service && (
						<ServiceDetails
							service={service}
							data={data}
							showServiceEntries={allServiceEntries}
							changeServicesActive={changeServicesActive}
							uiRef={props.uiRef}
						/>
					)}
				</Grid>

				{add && (
					<AddServices
						item={add}
						services={services}
						addService={addService}
						submitService={submitService}
						handleChange={handleChange}
						onCancel={() => setAdd(null)}
					/>
				)}

				{formatServiceConfig && (
					<FormatEntry
						config={formatServiceConfig}
						uiRef={uiRef}
						onSave={saveFormatConfig}
						onCancel={closeServiceConfig}
					/>
				)}

				{publishServiceConfig && (
					<PublishEntry
						config={publishServiceConfig}
						uiRef={uiRef}
						onSave={savePublishConfig}
						onCancel={closeServiceConfig}
					/>
				)}

				{ibmMqServiceConfig && (
					<IbmMqEntry
						config={ibmMqServiceConfig}
						uiRef={uiRef}
						onSave={saveIbmMqConfig}
						onCancel={closeServiceConfig}
					/>
				)}

				{allServiceConfig && (
					<ServicesEntries
						config={allServiceConfig}
						uiRef={uiRef}
						handleChange={handleConfigChange}
						onCancel={closeServiceConfig}
						onSubmit={updateAllServiceConfig}
					/>
				)}
			</Grid>
		</div>
	)
}
