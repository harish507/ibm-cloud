import React from 'react'
import Button from '@material-ui/core/Button'
import ToolTip from '@material-ui/core/Tooltip'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogTitle from '@material-ui/core/DialogTitle'
import { Grid } from '@material-ui/core'
import RadioButtons from '../Controls/RadioButtons'
import FieldSet from '../Controls/FieldSet'
import TextBox from '../Controls/TextBox'
import CancelIcon from '@material-ui/icons/Cancel'
import _ from 'lodash'

export default function MapFunctions ({ functions, src, trg, onCancel, onChange }) {
	const [ func, setFunc ] = React.useState(null)
	const [ custom, setCustom ] = React.useState(null)

	React.useEffect(() => {
		let sFunc = trg.function ? trg.function.name : 'EQ'
		selectFunc(functions.filter((f) => f.name === sFunc)[0])
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const selectFunc = (f) => {
		if (f.noInputs === 'c')
			setCustom(
				trg.function && trg.function.otherFields
					? { ...f.otherFields, ...trg.function.otherFields }
					: { ...f.otherFields }
			)
		else setCustom(null)
		setFunc({ ...f })
	}

	const setCustomField = (key, val) => {
		setCustom({ ...custom, [key]: val })
	}

	const removeMap = () => {
		var obj = {
			ind: trg.ind,
			parent: trg.parent,
			parentUp: trg.parentUp,
			name: trg.name,
			type: trg.type,
			level: trg.level,
			value: undefined,
			label: undefined,
			sourceUp: undefined,
			srcInd: undefined,
			function: undefined
		}
		onChange(obj)
	}

	const submitForm = (replace) => {
		var obj = {
			ind: trg.ind,
			parent: trg.parent,
			parentUp: trg.parentUp,
			name: trg.name,
			label: src.parent !== '' ? src.parent + src.name : src.name,
			type: trg.type,
			level: trg.level,
			function: trg.function ? { ...trg.function } : { inputs: [] },
			srcInd: trg.function ? [ ...trg.srcInd ] : []
		}
		if (func.name === 'EQ') {
			obj.srcInd = src.ind
			obj.value = src.parent !== '' ? '${' + src.parent + src.name + '}' : src.name
			obj.key = obj.parent !== '' ? '${' + obj.parent + obj.name + '}' : obj.name
			obj.label = src.parent !== '' ? src.parent + src.name : src.name
			obj.sourceUp = src.parentUp !== '' ? src.parentUp : ''
			obj.label = src.parent !== '' ? src.parent + src.name : src.name
			obj.function = undefined
		} else {
			if (replace) {
				obj.srcInd = [ src.ind ]
				obj.value = undefined //src.parent !== '' ? '${' + src.parent + src.name + '}' : src.name
				obj.key = undefined //obj.parent !== '' ? '${' + obj.parent + obj.name + '}' : obj.name
				obj.sourceUp = undefined //src.parentUp !== '' ? src.parentUp : ''
				obj.function = { name: func.name, label: func.label, inputs: [ src.name ] }
			} else {
				obj.srcInd = [ ...obj.srcInd, src.ind ]
				obj.value = undefined //src.parent !== '' ? '${' + src.parent + src.name + '}' : src.name
				obj.key = undefined //obj.parent !== '' ? '${' + obj.parent + obj.name + '}' : obj.name
				obj.sourceUp = undefined //src.parentUp !== '' ? src.parentUp : ''
				obj.function = { name: func.name, label: func.label, inputs: [ ...obj.function.inputs, src.name ] }
			}
		}
		onChange(obj)
	}

	const functionText = (fun, replace) => {
		//alert(replace)
		//alert(JSON.stringify(fun))
		if (fun.name === 'EQ') {
			return trg.name + ' = ' + (replace === undefined ? trg.label : src.name)
		} else {
			let text = trg.name + ' = ' + fun.label + ' ( '

			if (replace === undefined) {
				if (fun && fun.inputs) {
					fun.inputs.forEach((s, i) => (text += (i > 0 ? ', ' : '') + s))
				}
			}
			if (replace === true) {
				text += src.name
			}
			if (replace === false) {
				if (fun && fun.inputs) {
					fun.inputs.forEach((s) => (text += s + ', '))
					text += src.name
				}
			}
			text += ' )'
			return text
		}
	}
	// const functionOutput = (fun) => {
	// 	if (!fun) {
	// 		return ''
	// 	} else if (fun.name === 'EQ') {
	// 		return trg.name + ' = ' + src.name
	// 	} else {
	// 		let text = trg.name + ' = ' + fun.label + '( '
	// 		trg.srcInd.forEach((s, i) => (text += (i > 0 ? ', ' : '') + src[s].name))
	// 		text += ' )'
	// 		return text
	// 	}
	// }

	return (
		<div>
			<Dialog open={trg ? true : false} onClose={onCancel} maxWidth='sm' fullWidth>
				{/* <DialogTitle>Choose mapping function</DialogTitle> */}
				<form>
					<DialogContent style={{ minHeight: 350, height: 350, overflow: 'auto' }}>
						<Grid container spacing={0}>
							<Grid item md={12}>
								<FieldSet label='Current mapping'>
									{trg.function && functionText(trg.function)}
									{!trg.function && !trg.srcInd && ' -- No mapping -- '}
									{!trg.function && trg.srcInd && trg.name + ' = ' + trg.value}
									{trg.srcInd && (
										<ToolTip title='Remove this mapping' placement='top'>
											<Button
												style={{ textTransform: 'none', marginLeft: 10 }}
												variant='text'
												onClick={() => removeMap()}
											>
												<CancelIcon />
											</Button>
										</ToolTip>
									)}
								</FieldSet>
							</Grid>
							<Grid item md={12}>
								<RadioButtons
									label='Mapping function'
									value={func ? func.name : 'EQ'}
									items={functions}
									onChange={(val) => selectFunc(val)}
									keyField='name'
									labelField='label'
									// valueField='name'
									startCase
								/>
							</Grid>
							<FieldSet label='Select mapping'>
								{func && (
									<Grid item md={12}>
										<Button
											style={{ textTransform: 'none' }}
											variant='outlined'
											onClick={() => submitForm(true)}
											fullWidth
										>
											{functionText(func, true)}
										</Button>
									</Grid>
								)}
								{func &&
								func.noInputs !== '1' && (
									<Grid item md={12}>
										{trg.function &&
										trg.function.name === func.name &&
										trg.function.inputs &&
										trg.function.inputs.length > 0 &&
										!trg.function.inputs.includes(src.name) && (
											<Button
												style={{ textTransform: 'none' }}
												variant='outlined'
												onClick={() => submitForm(false)}
												fullWidth
											>
												{functionText(trg.function, false)}
											</Button>
										)}
										{/* {trg.function.name !== func.name && (
											<Button
												style={{ textTransform: 'none' }}
												variant='outlined'
												onClick={() => submitForm(false)}
												fullWidth
											>
												{functionText(func, true)}
											</Button>
										)} */}
									</Grid>
								)}
								{func &&
								func.noInputs !== 'c' &&
								custom && (
									<Grid item md={12}>
										{Object.keys(custom).map((cField) => {
											return (
												<TextBox
													key={cField}
													label={_.startCase(cField)}
													value={custom[cField]}
													onChange={(val) => setCustomField(cField, val)}
												/>
											)
										})}
									</Grid>
								)}
							</FieldSet>

							{/* <Grid item md={6}>
								new
							</Grid> */}
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={onCancel} color='primary' variant='outlined'>
							Close
						</Button>
						{/* <Button type='submit' onClick={submitForm} color='primary' variant='contained'>
							Save
						</Button> */}
					</DialogActions>
				</form>
			</Dialog>
		</div>
	)
}
