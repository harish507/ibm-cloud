/* eslint no-eval: 0 */
import React, { Component } from 'react'
import Steps from './Steps'
import { Grid, Fab, Container, Paper, Tooltip, Typography, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ReplayIcon from '@material-ui/icons/Replay'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
// import AddIcon from '@material-ui/icons/Add';

import BasicInfo from './BasicInfo'
// import SelectTemplate from './SelectTemplate'
import Properties from './Properties'
import Review from './Review'
import Publish from './Publish'
import ServiceHelper from '../../Helpers/ServiceHelper'
import { Template } from '../'

/// INTRO STEPS
import HelpIcon from '@material-ui/icons/Help'
import { Steps as IntroObj } from 'intro.js-react'
import AppConfig from './AppConfig'
let intro = {
	enabled: false,
	step: 0,
	options: {
		disableInteraction: true,
		showBullets: false,
		// tooltipPosition: 'bottom-right-aligned',
		overlayOpacity: 0.4
	},
	steps: [
		{
			element: '.intro-start',
			intro: 'This UI provides step-by-step actions to create, modify & deploy an integration.  '
		},
		{
			element: '.intro-steps',
			intro: 'The various steps involved in deploying an integration with progress indicator  are displayed here.'
		},
		{
			element: '.intro-actions',
			intro: 'These are the action controls to move along each step.'
		},
		{
			element: '.intro-basic-info',
			intro: 'Basic information about the integration '
		},
		{
			element: '.intro-click-next',
			intro:
				'After providing information in each step user needs to click here to validate & proceed to he next step'
		},
		{
			element: '.intro-click-prev',
			intro: 'User can go to previous step and change info by clicking here'
		},
		{
			element: '.intro-show-template',
			intro:
				'Now UI will display all the templates and provides option to choose template for the integration.User can choose templates from various catagories, search and find one suitable for his integration. Click one template to view details and proceed further.'
		},
		{
			element: '.intro-show-template-details',
			intro: 'Display the details of the template and prompt user to accept / choose another.'
		},
		{
			element: '.intro-show-properties',
			intro: 'Based on the selected template user need to provide the integration configuration properties'
		},
		{
			element: '.intro-show-review',
			intro:
				'After providing properties for the integration user can review his configuration before save & deploy.'
		},
		{
			element: '.intro-show-save',
			intro: 'Click here to save the integration and continue with deployment.'
		},
		{
			element: '.intro-show-build',
			intro: 'After saving the details user will can choose the deployment framework to publish integration'
		},
		{
			element: '.intro-show-deploy',
			intro:
				'After deploying the integration the status will be displayed and user can choose a testing framework to test it.'
		}
	]
}
let oldState = {}

export default class Wizard extends Component {
	state = {
		method: '',
		step: 0,
		validate: -1,
		templateId: '',
		template: {},
		details: {
			id: '',
			name: '',
			description: '',
			source: '',
			target: '',
			keys: {},
			environment: '',
			country: '',
			instance: '',
			minVolume: 1,
			avgVolume: 50,
			maxVolume: 100,
			template: '',
			routes: []
		},
		format: null,
		publish: null,
		masters: {
			applications: [],
			countries: [],
			environments: [],
			instances: []
		},
		appConfig: null,
		introEnabled: intro.enabled,
		introSteps: intro.steps,
		introStep: intro.step,
		openPopup: false,
		userExits: [],
		mqConfig:null
	}
	prevStep = () => {
		const step = this.state.step > 0 ? this.state.step - 1 : 0
		this.setState({ step: step, validate: step - 1 })
	}
	nextStep = () => {
		let error = null
		this.setState({ validate: this.state.validate < this.state.step ? this.state.validate + 1 : this.state.step })
		if (this.state.step === 0) {
			error = this.validateDetails(this.state.details)
		}
		if (this.state.step === 1) {
			error = this.validateTemplate(this.state)
		}
		if (this.state.step === 2) {
			error = this.validateProperties(this.state.template)
		}
		if (this.state.step === 3) {
			error = this.saveIntegration()
		}
		if (error) {
			this.props.uiRef.Error(error)
		} else {
			this.setState({ step: this.state.step < 5 ? this.state.step + 1 : 5 })
		}
	}
	setTemplateDefaults = (template) => {
		let defaults = this.state.defaults[this.state.masters.environments[0]]
		let result = { ...template, palettes: [ ...template.palettes ] }
		template.palettes.forEach((route, rIndex) => {
			let properties = [ ...route.properties ]
			route.properties.forEach((prop, pIndex) => {
				if (prop.default === true) {
					//alert(prop.key)
					properties[pIndex].value = defaults[prop.key]
				}
			})
			result.palettes[rIndex].properties = properties
		})
		return result
	}
	setTemplate = (temp, moveNext = false) => {
		let template = this.setTemplateDefaults(temp)
		if (!template.hideProps) {
			template.hideProps = {}
		}
		let details = { ...this.state.details }
		if (details.templateId !== template.id) {
			details = { ...details, templateId: template.id, routes: [] }
		}
		if (template.id !== this.state.templateId) {
			details.routes.forEach((route, rIndex) => {
				if (route && route.properties) {
					Object.keys(route.properties).forEach((propKey, pIndex) => {
						template.palettes[rIndex].properties[pIndex].value = route.properties[propKey]
					})
				}
			})
			details.routes = []
			this.setState({ details, template, templateId: template.id })
		}
		if (moveNext) {
			setTimeout(() => {
				this.nextStep()
			}, 10)
		}
	}
	setProperties = (properties) => {
		this.setState({ template: properties })
		//console.log(properties)
	}
	validateDetails = (ign) => {
		if (
			!ign.name ||
			ign.name.trim() === '' ||
			!ign.description ||
			ign.description.trim() === '' ||
			!ign.source ||
			ign.source.trim() === '' ||
			!ign.target ||
			ign.target.trim() === '' ||
			!ign.environment ||
			ign.environment.trim() === '' ||
			!ign.minVolume ||
			isNaN(ign.minVolume) ||
			!ign.avgVolume ||
			isNaN(ign.avgVolume) ||
			!ign.maxVolume ||
			isNaN(ign.maxVolume)
		) {
			return 'Please provide valid input for all the fields.'
		}
		return null
	}
	validateTemplate = (tpl) => {
		if (
			!tpl ||
			!tpl.templateId ||
			tpl.templateId.trim() === '' ||
			!tpl.template ||
			Object.keys(tpl.template).length === 0
		) {
			return 'Please select template for your integration'
		}
		return null
	}
	checkCondition = (tpl, prop) => {
		let exists = false,
			matched = false
		if (prop.cKey && prop.cKey !== '') {
			//alert(prop.key)
			exists = true
			tpl.palettes.forEach((r) => {
				r.properties.forEach((p) => {
					if (p.key === prop.cKey) {
						//alert(p.value)
						if (p.value !== undefined && p.value !== null) {
							//alert(p.value + prop.cOpr + prop.cValue)
							if (typeof p.value === 'string') {
								matched = p.value === prop.cValue ? true : false
							} else {
								matched = eval(p.value + prop.cOpr + prop.cValue)
							}
						}
					}
				})
			})
		}
		return !exists || (exists && matched)
	}

	validateProperties = (tpl) => {
		let empty = 0
		tpl.palettes.forEach((route) => {
			route.properties.forEach((prop) => {
				if (prop.type !== 'boolean' && (!prop.value || prop.value.trim() === '')) {
					if (prop.optional) {
						prop.value = ''
					} else if (tpl.hideProps[prop.key] !== undefined && tpl.hideProps[prop.key] === true) {
						prop.value = ''
					} else {
						if (this.checkCondition(tpl, prop)) {
							empty++
						}
					}
				}
			})
		})
		if (empty > 0) {
			return 'Please provide valid input for all properties'
		}
		return null
	}
	saveIntegration = () => {
		this.setState({ method: this.state.details.id === '' ? 'post' : 'put' })
		return null
	}
	setSaveStatus = (id) => {
		this.setState({ method: 'build', details: { ...this.state.details, id } })
		return null
	}
	publishIntegration = (format, publish) => {
		//alert(JSON.stringify(format))
		//alert(JSON.stringify(publish))
		this.setState({ method: 'deploy', format, publish })
	}
	deleteIntegration = (format, publish) => {
		//alert(JSON.stringify(format))
		//alert(JSON.stringify(publish))
		this.setState({ method: 'unDeploy', format, publish })
	}
	confirmDelete = () => {
		this.props.uiRef.Confirm(
			'Are you sure to delete integration ' + this.state.details.id + '?',
			() => {
				this.setState({ method: 'delete', step: 5 })
			},
			() => {}
		)
	}
	componentDidMount () {
		if (this.state.details.id === '') {
			this.setState({
				details: {
					...this.state.details,
					country: this.state.masters.countries[0],
					environment: this.state.masters.environments[0],
					instance: this.state.masters.instances[0],
					source: this.state.masters.applications[0],
					target: this.state.masters.applications[0]
				}
			})
		}
	}
	static getDerivedStateFromProps (props, state) {
		if (props.details && props.details._id !== state.details._id) {
			//alert(JSON.stringify(props.details.template))
			let details = { ...props.details, templateId: props.details.template.id }
			return { masters: props.masters, details: details, appConfig: props.appConfig, userExits: props.userExits, mqConfig : props.mqConfig}
		} else {
			if (props.masters && props.masters !== state.masters) {
				return {
					masters: props.masters,
					defaults: props.defaults ? props.defaults : {},
					appConfig: props.appConfig,
					userExits: props.userExits,
					mqConfig : props.mqConfig
				}
			} else {
				return null
			}
		}
	}
	reset = () => {
		window.location.reload()
	}
	deploy = () => {
		localStorage.id = this.state.details.id
		window.location = '/integrations/deploy'
	}

	/// INTRO METHODS
	startIntro = () => {
		oldState = this.state
		this.setState({
			step: 0,
			introEnabled: true
		})
	}
	// onIntroBeforeChange = (currentStep) => {}
	onIntroStepChange = (currentStep) => {
		if (intro.steps[currentStep].element === '.intro-basic-info') {
		}
		if (intro.steps[currentStep].element === '.intro-click-next') {
			this.setState({ step: 0, details: { ...oldState.details } })
		}
		if (intro.steps[currentStep].element === '.intro-click-prev') {
			this.setState({ step: 1, details: { name: 'Test', description: 'Test' } })
		}
		if (intro.steps[currentStep].element === '.intro-show-template') {
			this.setState({ step: 0, openPopup: false })
			setTimeout(() => {
				this.setState({ step: 1, openPopup: false })
			}, 10)
		}
		if (intro.steps[currentStep].element === '.intro-show-template-details') {
			this.setState({ step: 0, openPopup: false })
			setTimeout(() => {
				this.setState({
					step: 1,
					openPopup: true,
					templateId: '',
					template: {}
				})
			}, 10)
		}
		if (intro.steps[currentStep].element === '.intro-show-properties') {
			this.setState({
				step: 1,
				openPopup: false,
				templateId: '',
				template: {}
			})
			setTimeout(() => {
				this.setTemplate(
					{
						palettes: [
							{
								properties: [
									{
										type: 'queue',
										default: true,
										label: 'Inlet Queue',
										key: 'InletQueue',
										value: ''
									},
									{
										type: 'choose',
										source: 'encodingChoice',
										label: 'Inlet Encoding',
										key: 'InletEncoding',
										value: 'None'
									}
								],
								_id: '5dfdf48e1354e409841d7be3',
								group: 'Inputs & Outputs',
								name: 'Inlet',
								type: 'inlet',
								icon: 'faSignInAlt'
							},
							{
								properties: [
									{
										type: 'choose',
										source: 'encodingChoice',
										label: 'Outlet Encoding',
										key: 'OutletEncoding',
										value: 'None'
									},
									{
										type: 'queue',
										default: true,
										label: 'Outlet Queue',
										key: 'OutletQueue',
										value: ''
									}
								],
								_id: '5dfdf67aeeaa430984fe9031',
								group: 'Inputs & Outputs',
								name: 'Outlet',
								type: 'outlet',
								icon: 'faSignOutAlt'
							}
						],
						_id: '5e3bef3b4c904e25f48c7283',
						id: 'T0001',
						name: 'Pass Through',
						description: 'Template with basic pass through',
						category: 'Basic',
						hideProps: { OutletEncoding: true }
					},
					true
				)
			}, 10)
		}
		if (intro.steps[currentStep].element === '.intro-show-review') {
			this.setState({ step: 3, method: '', details: { ...this.state.details, id: '' } })
		}
		if (intro.steps[currentStep].element === '.intro-show-save') {
			this.setState({ step: 3, method: '', details: { ...this.state.details, id: '' } })
		}
		if (intro.steps[currentStep].element === '.intro-show-build') {
			this.setState({ step: 4, method: 'introBuild', details: { ...this.state.details, id: 'I0007' } })
		}
		if (intro.steps[currentStep].element === '.intro-show-deploy') {
			this.setState({ step: 4, method: 'introDeploy' })
		}
	}
	onIntroExit = () => {
		this.setState({ ...oldState, details: { ...oldState.details } })
	}

	render () {
		return (
			<Container className='intro-start'>
				<Grid container spacing={0} alignContent='center' alignItems='flex-start'>
					<Grid item md={8} sm={12}>
						<Paper className='intro-steps' style={{ paddingTop: 10, height: 80 }}>
							<Steps step={this.state.step} />
						</Paper>
					</Grid>
					<Grid item md={4} sm={12} className='intro-actions' style={{ textAlign: 'center' }}>
						{/* <Paper style={{height: 80, marginLeft: 20 }} > */}
						{this.state.step < 6 && (
							<div style={{ paddingTop: 20, width: '100%', textAlign: 'center' }}>
								<Tooltip title='Previous'>
									<Fab
										variant='extended'
										color='primary'
										onClick={this.prevStep}
										disabled={this.state.step === 0 || this.state.step > 3}
										className='intro-click-prev'
									>
										<ArrowBackIosIcon />
									</Fab>
								</Tooltip>
								<Tooltip title='Reset details'>
									<Fab
										variant='extended'
										color='primary'
										component={Link}
										onClick={this.reset}
										to={
											'/integrations/' +
											(this.state.details.id ? this.state.details.id : 'create')
										}
										disabled={this.state.step > 3}
									>
										{' '}
										<ReplayIcon />
									</Fab>
								</Tooltip>
								<Tooltip title='Continue'>
									<Fab
										variant='extended'
										color='primary'
										onClick={this.nextStep}
										disabled={this.state.step > 2}
										className='intro-click-next'
									>
										<ArrowForwardIosIcon />
									</Fab>
								</Tooltip>
								<Tooltip title='Save integration details'>
									<Fab
										variant='extended'
										color='primary'
										onClick={this.nextStep}
										disabled={this.state.step !== 3}
										className='intro-show-save'
									>
										<SaveIcon />
										Save
									</Fab>
								</Tooltip>
								<Tooltip title='Delete this integration'>
									<Fab
										variant='extended'
										color='secondary'
										onClick={this.confirmDelete}
										disabled={
											this.state.details.id === '' ||
											(this.state.details.id !== '' && this.state.step !== 3)
										}
									>
										<DeleteIcon />
										Delete
									</Fab>
								</Tooltip>
								<Button
									variant='text'
									color='primary'
									style={{ position: 'fixed', right: 20 }}
									onClick={this.startIntro}
								>
									<HelpIcon fontSize='large' />
								</Button>
								<IntroObj
									enabled={this.state.introEnabled}
									steps={this.state.introSteps}
									initialStep={this.state.introStep}
									// onBeforeChange={this.onIntroBeforeChange}
									onChange={this.onIntroStepChange}
									onExit={this.onIntroExit}
									options={intro.options}
								/>
							</div>
						)}

						{/* { this.state.step === 5 &&
                            <Fab color="default" onClick={this.NextStep}><AddIcon /></Fab>} */}
						{/* </Paper> */}
					</Grid>
				</Grid>

				<Grid
					container
					spacing={0}
					className='intro-basic-info intro-show-template intro-show-properties intro-show-review intro-show-build intro-show-deploy'
					alignContent='flex-start'
					alignItems='center'
					style={{ minHeight: 350 }}
				>
					{this.state.step === 0 && (
						<Grid item md={10} sm={12} style={{ marginTop: 20 }}>
							<BasicInfo
								details={this.state.details}
								masters={this.state.masters}
								validate={this.state.validate >= this.state.step}
								handleChange={(val) => this.setState({ details: val })}
							/>
						</Grid>
					)}

					{this.state.step === 1 && (
						<Grid item md={12} sm={12}>
							<Template
								handleSelection={this.setTemplate}
								uiRef={this.props.uiRef}
								templateId={
									this.state.templateId ? this.state.templateId : this.state.details.templateId
								}
								openPopup={this.state.openPopup}
							/>
							{/* <ServiceHelper path='templates' render={templates => {
                                return <SelectTemplate  items={templates.payload} 
                                templateId={this.state.templateId ? this.state.templateId : this.state.details.templateId} handleSelection={this.setTemplate} />
                            }} /> */}
						</Grid>
					)}

					{this.state.step === 2 && (
						<Grid item container md={12} sm={12} spacing={1} style={{ marginTop: 40 }}>
							<Grid item md={9} sm={12}>
								<div className='palette-group' style={{ minHeight: 400 }}>
									<div className='palette-group-header color-light'>Route Properties</div>
									<div className='palette-group-content'>
										<Properties
											details={this.state.details}
											masters={this.state.masters}
											validate={this.state.validate >= this.state.step}
											template={this.state.template}
											userExits={this.state.userExits}
											handleChange={this.setProperties}
										/>
									</div>
								</div>
							</Grid>
							<Grid item md={3} sm={12}>
								<div className='palette-group' style={{ minHeight: 400 }}>
									<div className='palette-group-header color-light'>Application Configuration</div>
									<div className='palette-group-content'>
										<AppConfig config={this.state.appConfig} details={this.state.details} mqConfig ={this.state.mqConfig} />
									</div>
								</div>
							</Grid>
						</Grid>
					)}

					{this.state.step === 3 && (
						<Grid item md={12} sm={12} style={{ marginTop: 40 }}>
							<Review details={this.state.details} template={this.state.template} />
						</Grid>
					)}

					{(this.state.method === 'put' || this.state.method === 'post') && (
						<Grid item md={12} sm={12} style={{ padding: 20, marginTop: 20 }}>
							<ServiceHelper
								method={this.state.method}
								path={'integrations/' + this.state.details.id}
								input={{ details: this.state.details, template: this.state.template }}
								render={(result) => {
									return (
										<div>
											{this.props.uiRef.Loading(result.loading)}
											{result.error && this.props.uiRef.Error(result.error)}
											{result.payload && this.setSaveStatus(result.payload.id)}
										</div>
									)
								}}
							/>
						</Grid>
					)}

					{(this.state.method === 'build' || this.state.method === 'delete') && (
						<Grid item md={12} sm={12} style={{ padding: 20, marginTop: 20 }}>
							<ServiceHelper
								path='services/active'
								render={(config) => {
									return (
										<div>
											{this.props.uiRef && this.props.uiRef.Loading(config.loading)}
											{config.error && this.props.uiRef.Error(config.error)}
											{config.error && <error>{config.error.message}</error>}
											{/* {alert(JSON.stringify(config.payload))} */}
											{config.payload && (
												<Publish
													id={this.state.details.id}
													method={this.state.method}
													config={config.payload}
													publish={this.publishIntegration}
													delete={this.deleteIntegration}
												/>
											)}
										</div>
									)
								}}
							/>
						</Grid>
					)}

					{this.state.method === 'deploy' && (
						<Grid item md={12} sm={12} style={{ padding: 20, marginTop: 20, textAlign: 'center' }}>
							<ServiceHelper
								method='post'
								path='buildAndDeploy'
								input={{
									details: this.state.details,
									template: this.state.template,
									format: this.state.format,
									publish: this.state.publish
								}}
								render={(result) => {
									return (
										<React.Fragment>
											{this.props.uiRef.Loading(result.loading)}
											{result.error && this.props.uiRef.Error(result.error)}
											{result.error && (
												<Typography variant='h6' color='secondary'>
													{JSON.stringify(result.error)}
												</Typography>
											)}
											{result.payload && this.deploy()}
										</React.Fragment>
									)
								}}
							/>
						</Grid>
					)}

					{this.state.method === 'unDeploy' && (
						<Grid item md={12} sm={12} style={{ padding: 20, marginTop: 20, textAlign: 'center' }}>
							<ServiceHelper
								method='post'
								path='UnDeployAndDelete'
								input={{
									details: this.state.details,
									template: this.state.template,
									format: this.state.format,
									publish: this.state.publish
								}}
								render={(result) => {
									return (
										<React.Fragment>
											{this.props.uiRef.Loading(result.loading)}
											{result.error && this.props.uiRef.Error(result.error)}
											{result.error && (
												<Typography variant='h6' color='secondary'>
													{JSON.stringify(result.error)}
												</Typography>
											)}
											{result.payload && (
												<Typography variant='h6' color='primary'>
													{JSON.stringify(result.payload)}
												</Typography>
											)}
											{/* {result.payload && this.deploy()} */}
										</React.Fragment>
									)
								}}
							/>
						</Grid>
					)}

					{(this.state.method === 'introBuild' || this.state.method === 'introDeploy') && (
						<Grid item md={12} sm={12} style={{ padding: 20, marginTop: 20 }}>
							{this.state.method === 'introBuild' && (
								<Publish
									id={'I0007'}
									method={'build'}
									config={{
										format: [
											{
												_id: '5e05e3b52e6e0b34840acd53',
												id: 1,
												type: 'format',
												name: 'Integration Framework V0',
												version: 'v0',
												active: true,
												default: true,
												url: ''
											}
										],
										publish: [
											{
												_id: '5e05e4db2e6e0b34840acd54',
												id: 1,
												type: 'publish',
												name: 'Publish to Git',
												version: 'v0',
												active: true,
												default: true,
												url: ''
											}
										]
									}}
									publish={() => {}}
									delete={() => {}}
								/>
							)}
							{this.state.method === 'introDeploy' && (
								<Grid container alignContent='center' alignItems='center'>
									<Grid item sm={12} xs={12} style={{ textAlign: 'center' }}>
										<Typography variant='h6' color='primary'>
											Integration I0007 deployed Successfully
										</Typography>
									</Grid>
									<Grid item sm={12} xs={12} style={{ textAlign: 'center' }}>
										<br />
										<br />
										<Typography variant='body1'>
											Click the below link to test your integration{' '}
										</Typography>
										<br />
										<br />
										<Fab variant='extended' color='secondary' size='large'>
											Test your Integration
										</Fab>
										<br />
									</Grid>
								</Grid>
							)}
						</Grid>
					)}
				</Grid>
				{/* <div>
                    {JSON.stringify(this.state.details)}
                </div> */}
			</Container>
		)
	}
}
