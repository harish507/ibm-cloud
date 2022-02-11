import React, { Component } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import { Grid, Fab, Tooltip, Button } from '@material-ui/core'
import ServiceHelper from '../../Helpers/ServiceHelper'
import UIHelper from '../../Helpers/UIHelper'
import Palettes from './Palettes'
import Details from './Details'
// import Properties from './Properties'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import SecurityIcon from '@material-ui/icons/Security'
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'

import { Dialog, DialogActions, DialogContent, DialogContentText} from '@material-ui/core'
import FieldSet from '../../Controls/FieldSet'

class Template extends Component {
	constructor (props) {
		super(props)
		this.uiRef = React.createRef()
	}

	state = {
		template: {
			name: '',
			category: 'Basic',
			description: '',
			palettes: [],
			hideProps: {}
		},
		nodes: [],
		hideProps: {},
		status: '',
		testTemplate: null,
		formData: null
	}

	changeDetails = (details) => {
		this.setState({ template: { ...this.state.template, ...details } })
	}

	addNode = (ctl) => {
		let { nodes } = this.state
		let node = { ...ctl }

		nodes.push(node)
		this.setState({ nodes })
	}
	removeNode = (ind) => {
		let { nodes } = this.state
		this.setState({ nodes: [] })
		nodes.splice(ind, 1)
		setTimeout(() => {
			this.setState({ nodes })
		}, 10)
	}
	moveNode = (dragIndex, dropIndex) => {
		let { nodes } = this.state
		this.setState({ nodes: [] })
		nodes.splice(dropIndex, 0, nodes.splice(dragIndex, 1)[0])
		setTimeout(() => {
			this.setState({ nodes })
		}, 10)
	}
	setHideProps = (hProps) => {
		this.setState({ ...this.state, hideProps: { ...hProps } })
	}

	saveTemplate = () => {
		let ui = this.uiRef.current
		let { template, nodes, hideProps } = this.state
		//alert(JSON.stringify(template))
		if (
			!template.name ||
			template.name.trim() === '' ||
			!template.category ||
			template.category.trim() === '' ||
			!template.description ||
			template.description.trim() === ''
		) {
			ui.Error('Please fill all details.')
		} else if (!this.state.nodes || this.state.nodes.length === 0) {
			ui.Error('Please select palettes to configure the template.')
		} else {
			template.palettes = [ ...nodes ]
			template.hideProps = {}
			Object.keys(hideProps).forEach((prop) => {
				if (hideProps[prop] && hideProps[prop] !== false) {
					template.hideProps[prop] = hideProps[prop]
				}
			})
			this.setState({ template, status: template._id && template._id.trim() !== '' ? 'put' : 'post' })
		}
	}
	deleteTemplate = () => {
		let ui = this.uiRef.current
		ui.Confirm(
			'Are you sure to delete this template ?',
			() => {
				this.setState({ status: 'delete' })
			},
			() => {}
		)
	}

	updateStatus = (template) => {
		template = this.state.status === 'delete' ? null : template
		this.setState({ status: '' })
		if (template) {
			this.uiRef.current.Success('Template saved successfully.')
		} else {
			this.uiRef.current.Success('Template deleted successfully.')
		}
		setTimeout(() => {
			this.props.updateTemplate(template)
		}, 1000)
	}

	resetAll = () => {
		let nodes = []
		if (this.props.template && Object.keys(this.props.template).length > 0) {
			this.setState({ template: { ...this.props.template } })
		}
		this.setState({ nodes })
	}

	static getDerivedStateFromProps (props, state) {
		if (props.template && Object.keys(props.template).length > 0 && !state.loaded) {
			let nodes = [ ...props.template.palettes ]
			var hideProps = { ...props.template.hideProps }
			return { loaded: true, nodes, hideProps, status: '', template: { ...props.template } }
		}
		return {}
	}

	showUploads = () => {
		this.setState({testTemplate: {feature:null, steps:null, template:null}})
	}
	selectFile = (name,files) => {
		if (files.length > 0) {
			this.setState({ testTemplate: { ...this.state.testTemplate, [name]: files[0] } })
		}
	}

	handleUpload = (e) => {
		e.preventDefault()
		const tt = this.state.testTemplate
		if (!tt.feature || !tt.steps || !tt.template) {
			this.props.uiRef.Error('Please provide all the template files')
		} else {
			const id = this.state.template.id
			const formData = new FormData()
			formData.append('feature', tt.feature, id + '.feature')
			formData.append('steps', tt.feature, id + '.steps.xml')
			formData.append('template', tt.feature, id + '.template.xml')
			formData.append('id', id.toString())
			this.setState({ status: 'upload', formData})
		}
	}
	handleClose = () => {
		this.setState({testTemplate: null})
	}
	showStatus = (result) => {
		if (result) {
			this.uiRef.current.Success('Test template updated successfully.')
			this.setState({ status: '', testTemplate: null, formData: null})
		}
	}

	render () {
		const { uiRef } = this.props

		return (
			<div style={{ paddingTop: 20 }}>
				<UIHelper ref={this.uiRef} />
				<Grid container spacing={1} alignItems='center' alignContent='center'>
					<Grid item md={9} sm={9} xs={12} className='intro-tmp-details'>
						<Details
							{...this.state.template}
							categories={this.props.categories}
							handleChange={this.changeDetails}
						/>
						<Dialog open={this.state.testTemplate?true:false} onClose={this.handleClose} >
							<form onSubmit={this.handleUpload}>
								<DialogContent>
									<DialogContentText>Upload test template configuration</DialogContentText>
									<FieldSet label = "Simple Feature file">
										<input type='file' id='uploadFeature' onChange={e => this.selectFile('feature',e.target.files)} />
									</FieldSet>
									<FieldSet label="Steps file">
										<input type='file' id='uploadSteps' onChange={e => this.selectFile('steps', e.target.files)} />
									</FieldSet>
									<FieldSet label="Template file">
										<input type='file' id='uploadTemplate' onChange={e => this.selectFile('template', e.target.files)} />
									</FieldSet>
								</DialogContent>
								<DialogActions>
									<Button onClick={this.handleClose} color='primary'>
										Cancel
									</Button>
									<Button type='submit' color='primary'>
										Ok
									</Button>
								</DialogActions>
							</form>
						</Dialog>
					</Grid>
					<Grid item md={3} sm={3} xs={12} style={{ textAlign: 'center' }} className='intro-tmp-save'>
						<Tooltip title='Update Test Templates'>
							<Fab variant='extended' color='default' onClick={this.showUploads}
								disabled={this.state.template._id && this.state.template._id.trim() !== '' ? false : true}>
								<SecurityIcon />
							</Fab>
						</Tooltip>
						<Tooltip title='Back'>
							<Fab variant='extended' color='primary' onClick={this.props.cancel}>
								<ArrowBackIcon />
							</Fab>
						</Tooltip>
						<Tooltip title='Save'>
							<Fab variant='extended' color='primary' onClick={this.saveTemplate}>
								<SaveIcon />
							</Fab>
						</Tooltip>
						<Tooltip title='Delete'>
							<Fab
								variant='extended'
								disabled={this.state.template._id && this.state.template._id.trim() !== '' ? false : true}
								color='secondary'
								onClick={this.deleteTemplate}
							>
								<DeleteIcon />
							</Fab>
						</Tooltip>
						{/* )} */}
					</Grid>
					<Grid item md={12} sm={12} xs={12}>
						<ServiceHelper
							path='palettes'
							render={(palettes) => {
								return (
									<React.Fragment>
										{uiRef && uiRef.Loading(palettes.loading)}
										<Palettes
											palettes={palettes.payload}
											hideProps={this.state.hideProps}
											setHideProps={this.setHideProps}
											moveNode={this.moveNode}
											addNode={this.addNode}
											removeNode={this.removeNode}
											nodes={this.state.nodes}
										/>
									</React.Fragment>
								)
							}}
						/>
					</Grid>
					{(this.state.status === 'post' ||
						this.state.status === 'put' ||
						this.state.status === 'delete') && (
						<Grid item md={12} sm={12} xs={12}>
							<ServiceHelper
								method={this.state.status}
								path={'templates/' + (this.state.template._id ? this.state.template._id : '')}
								input={{ ...this.state.template }}
								render={(result) => {
									return (
										<div>
											{this.uiRef.current.Loading(result.loading)}
											{result.error && this.uiRef.current.Error(result.error)}
											{result.payload && this.updateStatus(result.payload)}
										</div>
									)
								}}
							/>
						</Grid>
					)}
					{this.state.status === 'upload' && (
						<Grid item md={12} sm={12} xs={12}>
							<ServiceHelper
								method='post'
								path='templates/upload'
								optHeaders={{ 'Content-type': 'multipart/form-data' }}
								input={this.state.formData}
								render={(result) => {
									return (
										<div>
											{uiRef && uiRef.current.Loading(result.loading)}
											{result.error && uiRef.current.Error(result.error)}
											{result.payload && this.showStatus(result.payload)}
										</div>
									)
								}}
							/>
						</Grid>
					)}
				</Grid>
			</div>
		)
	}
}

export default DragDropContext(HTML5Backend)(Template)
