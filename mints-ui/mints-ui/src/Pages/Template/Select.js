import React from 'react'
import Template from './Template'
import { SelectTemplate } from '../'
import ServiceHelper from '../../Helpers/ServiceHelper'
import { Grid, Button } from '@material-ui/core'

import HelpIcon from '@material-ui/icons/Help'
import { Steps as IntroObj } from 'intro.js-react'
let intro = {
	enabled: false,
	step: 0,
	options: {
		disableInteraction: true,
		showBullets: false,
		tooltipPosition: 'bottom-middle-aligned',
		overlayOpacity: 0.4
	},
	steps: [
		{
			element: '.intro-tmp-start',
			intro: 'This UI provides step-by-step actions to create / modify a template.'
		},
		{
			element: '.intro-tmp-left',
			intro:
				'Navigate through templates based on different categories. Click on category to see templates or choose new template option.'
		},
		{
			element: '.intro-tmp-right',
			intro: 'Templates related to category or based on search are displayed. Click on a template to modify'
		},
		{
			element: '.intro-tmp-show-new',
			intro: 'This UI will allow user to change template details and save.'
		},
		{
			element: '.intro-tmp-details',
			intro: 'Basic details about the template.'
		},
		{
			element: '.intro-tmp-palettes',
			intro:
				'These are the list of available palettes by category. Drag one or more to the target pane in required order to ad to the template.'
		},
		{
			element: '.intro-tmp-target',
			intro:
				'Here palettes added to the template are displayed as in order of execution. User can re-oder the palettes by dragging them up & down. Click (X) to remove unwanted palettes.'
		},
		{
			element: '.intro-tmp-properties',
			intro:
				'Properties related to the selected palettes are displayed here. User can hide unwanted properties for the template.'
		},
		{
			element: '.intro-tmp-save',
			intro:
				'After selecting required palettes & properties click save. User can delete a existing palette by clicking delete.'
		}
	]
}

export default function Select (props) {
	const [ template, setTemplate ] = React.useState(null)
	const [ categories, setCategories ] = React.useState([])
	const [ openPopup, setOpenPopup ] = React.useState(props.openPopup)

	const [ introEnabled, setIntroEnabled ] = React.useState(intro.enabled)
	const [ introSteps ] = React.useState(intro.steps)
	const [ introStep ] = React.useState(intro.step)

	const { uiRef } = props

	React.useEffect(
		() => {
			setOpenPopup(props.openPopup)
		},
		[ props ]
	)

	const resetTemplateSelection = (tpl) => {
		//setTemplate(null)
		if (props.handleSelection) {
			props.handleSelection(tpl)
		} else {
			setTemplate(tpl)
		}
	}

	/// INTRO METHODS
	const startIntro = () => {
		setTemplate({})
		setIntroEnabled(true)
	}
	const onIntroStepChange = (currentStep) => {
		if (intro.steps[currentStep].element === '.intro-tmp-palettes') {
			setTemplate({})
		}
		if (intro.steps[currentStep].element === '.intro-tmp-target') {
			setTemplate({
				palettes: [
					{
						properties: [
							{ type: 'queue', default: true, label: 'Inlet Queue', key: 'InletQueue', value: '' },
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
							{ type: 'queue', default: true, label: 'Outlet Queue', key: 'OutletQueue', value: '' }
						],
						_id: '5dfdf67aeeaa430984fe9031',
						group: 'Inputs & Outputs',
						name: 'Outlet',
						type: 'outlet',
						icon: 'faSignOutAlt'
					}
				],
				_id: '5e3046fe454fad0029ff5a27',
				id: 'T0001',
				name: 'Pass Through',
				description: 'Pass Through',
				category: 'Basic',
				hideProps: { OutletEncoding: true },
				__v: 0
			})
		}
	}
	const onIntroExit = () => {
		if (introEnabled) {
			setTemplate(null)
			setIntroEnabled(false)
		}
	}

	return (
		<div style={{ padding: 30 }}>
			{(introEnabled === true || !template) && (
				<Grid container spacing={1} style={{ minHeight: introEnabled ? 500 : 100 }} className='intro-tmp-start'>
					<Grid item md={12} sm={12} xs={12}>
						{props.openPopup === undefined && (
							<React.Fragment>
								<Button
									variant='text'
									color='primary'
									style={{ position: 'fixed', right: 20 }}
									onClick={startIntro}
								>
									<HelpIcon fontSize='large' />
								</Button>
								<IntroObj
									enabled={introEnabled}
									steps={introSteps}
									initialStep={introStep}
									// onBeforeChange={onIntroBeforeChange}
									onChange={onIntroStepChange}
									onExit={onIntroExit}
									options={intro.options}
								/>
							</React.Fragment>
						)}
						<ServiceHelper
							path='templates'
							render={(templates) => {
								return (
									<React.Fragment>
										{uiRef && uiRef.Loading(templates.loading)}
										<SelectTemplate
											items={templates.payload}
											templateId={props.templateId}
											handleSelection={props.handleSelection}
											editTemplate={(tpl, cats) => {
												//alert(JSON.stringify(tpl))
												setTemplate(tpl)
												setCategories(cats)
											}}
											openPopup={openPopup}
										/>
									</React.Fragment>
								)
							}}
						/>
					</Grid>
				</Grid>
			)}
			{template && (
				<Grid container spacing={1} className='intro-tmp-show-new'>
					<Grid item md={12} sm={12} xs={12}>
						<Template
							template={template}
							uiRef={uiRef}
							categories={categories}
							addTemplate={() => setTemplate({})}
							updateTemplate={resetTemplateSelection}
							cancel={() => setTemplate(null)}
						/>
					</Grid>
				</Grid>
			)}
		</div>
	)
}
