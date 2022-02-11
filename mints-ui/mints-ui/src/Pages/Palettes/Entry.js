import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextBox from '../../Controls/TextBox'
import RadioSelection from '../../Controls/RadioSelection'
import SwitchControl from '../../Controls/SwitchControl'
import FieldSet from '../../Controls/FieldSet'
import DropDown from '../../Controls/DropDown'
import _ from 'lodash'
import { Grid, Tooltip } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'

export default function Entry (props) {
	const [ item, setItem ] = React.useState(props.entry.item)
	const [ localList, setLocalList ] = React.useState([])
	const [ newItem, setNewItem ] = React.useState('')

	React.useEffect(
		() => {
			if (props.entry.item.type === 'list') {
				setLocalList(props.entry.item.source ? props.entry.item.source : [])
			} else {
				setLocalList([])
			}
		},
		[ props.entry ]
	)

	const handlePropChange = (key, value) => {
		setItem({ ...item, [key]: value })
	}
	// const handleKeyChange = (key) => {
	// 	setItem({ key, value: item.value })
	// }
	// const handleValueChange = (value) => {
	// 	setItem({ key: item.key, value })
	// }

	const submitForm = (e) => {
		e.preventDefault()
		if (item.type === 'list') {
			if (localList.length === 0) {
				props.uiRef.Error('Please provide list of items')
				return
			} else {
				item.source = [ ...localList ]
			}
		}
		props.updateProp(item, props.entry.ind)
	}

	const addListItem = (e) => {
		setLocalList([ ...localList, newItem ])
		setNewItem('')
	}
	const deleteListItem = (ind) => {
		setLocalList(localList.filter((loc, i) => i !== ind))
	}

	return (
		<div>
			<Dialog open={item ? true : false} onClose={props.onCancel} maxWidth='sm' fullWidth>
				<DialogTitle>Palette Property</DialogTitle>
				<form>
					<DialogContent style={{ minHeight: 350, height: 350, overflow: 'auto' }}>
						<Grid container spacing={0}>
							<Grid item md={12}>
								<TextBox
									label='Label'
									value={item.label}
									onChange={(e) => handlePropChange('label', e.target.value)}
								/>
								<TextBox
									label='Key'
									value={item.key}
									onChange={(e) => handlePropChange('key', e.target.value)}
								/>
								<RadioSelection
									label='Type'
									items={[
										'text',
										'password',
										'boolean',
										'queue',
										'choose',
										'list',
										'object',
										'ObjectList'
									]}
									value={item.type}
									onChange={(e) => handlePropChange('type', e.target.value)}
								/>
								{item.type === 'list' && (
									<Grid item md={12}>
										<FieldSet
											label='List of items to choose'
											style={{ paddingTop: 10, textAlign: 'left' }}
										>
											<Grid container spacing={1}>
												<Grid item md={8}>
													Item
												</Grid>
												<Grid item md={4}>
													Action
												</Grid>
												{localList.length === 0 && (
													<Grid item md={12}>
														No items added to the list
													</Grid>
												)}
												{localList.map((lItem, lInd) => {
													return (
														<React.Fragment>
															<Grid item md={8}>
																{lItem}
															</Grid>
															<Grid item md={4}>
																<Tooltip title='Delete Item'>
																	<Button
																		variant='text'
																		color='secondary'
																		onClick={() => deleteListItem(lInd)}
																	>
																		<DeleteIcon />
																	</Button>
																</Tooltip>
															</Grid>
														</React.Fragment>
													)
												})}
												<Grid item md={8}>
													<input
														type='text'
														value={newItem}
														placeholder='New Item'
														onChange={(e) => setNewItem(e.target.value)}
													/>
												</Grid>
												<Grid item md={4}>
													<Tooltip title='Add Item'>
														<Button variant='text' color='secondary' onClick={addListItem}>
															<AddIcon />
														</Button>
													</Tooltip>
												</Grid>
											</Grid>
										</FieldSet>
									</Grid>
								)}
								{item.type === 'choose' && (
									<DropDown
										label='Source'
										value={item.source && item.source !== '---' ? _.startCase(item.source) : '---'}
										items={[
											'---',
											'Countries',
											'Applications',
											'Environments',
											'Instances',
											'Encoding Choice',
											'Filename Patterns',
											'Content Type Options'
										]}
										onChange={(val) => handlePropChange('source', _.camelCase(val))}
									/>
								)}
							</Grid>
							<Grid item md={6}>
								<FieldSet label='Assign a default value' style={{ paddingTop: 10 }}>
									<SwitchControl
										checked={item.default}
										onChange={(e) => handlePropChange('default', e.target.checked)}
									/>
								</FieldSet>
							</Grid>
							<Grid item md={6}>
								<FieldSet label='Check if optional' style={{ paddingTop: 10 }}>
									<SwitchControl
										checked={item.optional}
										onChange={(e) => handlePropChange('optional', e.target.checked)}
									/>
								</FieldSet>
							</Grid>
							<Grid item md={5}>
								<TextBox
									label='Condition Key'
									value={item.cKey}
									onChange={(e) => handlePropChange('cKey', e.target.value)}
								/>
							</Grid>
							<Grid item md={2}>
								<DropDown
									label='Operator'
									value={item.cOpr ? item.cOpr : ' '}
									items={[ ' ', '===', '!==', '<', '>', '<=', '>=' ]}
									onChange={(val) => handlePropChange('cOpr', val)}
								/>
							</Grid>
							<Grid item md={5}>
								<TextBox
									label='Condition Value'
									value={item.cValue}
									onChange={(e) => handlePropChange('cValue', e.target.value)}
								/>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={props.onCancel} color='primary' variant='outlined'>
							Cancel
						</Button>
						<Button type='submit' onClick={submitForm} color='primary' variant='contained'>
							Save
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</div>
	)
}
