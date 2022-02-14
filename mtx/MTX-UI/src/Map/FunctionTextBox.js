import React from 'react'
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete'
import Button from '@material-ui/core/Button'
// import ToolTip from '@material-ui/core/Tooltip'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormatSizeIcon from '@material-ui/icons/FormatSize'
import FunctionsIcon from '@material-ui/icons/Functions'

import '@webscopeio/react-textarea-autocomplete/style.css'
// import { Typography } from '@material-ui/core'

const dropdownItem = ({ entity: { type, name, label, char } }) => {
	return (
		<div className='function-popover-item'>
			<span>
				{type === 'func' ? (
					<FunctionsIcon className='icon' style={{ fontsize: 'xs' }} />
				) : (
					<FormatSizeIcon className='icon' style={{ fontsize: 'xs' }} />
				)}
			</span>
			<span className='text'>{name}</span>
		</div>
	)
}
// const Item = ({ entity: { type, name, label, char } }) => {
// 	return <div className='function-popover-item'>{`${label}`}</div>
// }
const Loading = ({ data }) => <div>Loading</div>

export default function FunctionTextBox ({ map, containerStyle, functions, src, trg, onCancel, onChange }) {
	const [ list, setList ] = React.useState([])
	const [ fun, setFun ] = React.useState({ char: 'Select a function for definition' })
	const [ tok, setTok ] = React.useState('')
	const [ value, setValue ] = React.useState('')

	const rta = React.useRef()

	// str = str.replace(/(^[,\s]+)|([,\s]+$)/g, '');

	const formatStringArray = str => {
		let  val =''
		str = str.replace('[','').replace(']','').trim()
		str.split(',').forEach(inp => {
			val += ',' + inp.trim()
		})
		return '[' + val.substring(1) + ']'
	}
	const formatFieldArray = str => {
		let text = ''
		let  val =''
		str = str.replace('[','').replace(']','').trim()
		str.split(',').forEach(inp => {
			let sf = getSourceField(inp.trim())
			text += ',' + sf.parentUp
			val += ',' + (sf.parent !== '' ? '${' + sf.parent + sf.name + '}' : sf.name)
		})
		return '[' + text.substring(1) + ']:[' + val.substring(1) + ']'
	}

	React.useEffect(() => {
		var items = []
		if (map && functions) {
			functions.forEach((f) => {
				items.push({
					type: 'func',
					name: f.name,
					label: f.label,
					char: f.text,
					definition: f.definition
				})
				if (trg && trg.function && trg.function.name === f.name)
					setFun({
						type: 'func',
						name: f.name,
						label: f.label,
						char: f.text,
						definition: f.definition
					})
			})
			map.sourceFields.filter((f) => f.type).forEach((f) =>
				items.push({
					type: 'src',
					name: f.parentUp,
					label: f.parentUp,
					char: f.parentUp,
					definition: f.name
				})
			)
			//map.targetFields.forEach((f) => items.push({ type: 'trg', name: f.label, label: f.label, char: f.label }))
			setList(items)
		}
		setTimeout(() => setValue(!trg.text ? '=' : (trg.text.includes('=') ? '' : '=') + trg.text))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const getSourceField = inp => {
		let val = {}
		map.sourceFields.forEach((sf) => {
			if (inp === sf.parentUp) val = sf 
		})
		return val;
	}

	const onClear = () => {
		let updTrg = { ...trg }
		updTrg.srcInd = undefined
		updTrg.value = undefined
		updTrg.text = undefined
		updTrg.label = undefined
		updTrg.sourceUp = undefined
		updTrg.function = undefined
		onChange(updTrg)
	}

	const submitForm = () => {
		let updTrg = { ...trg }
		if (!value || value.trim() === '' || value.trim() === '=') {
			updTrg.srcInd = undefined
			updTrg.value = undefined
			updTrg.text = undefined
			updTrg.label = undefined
			updTrg.sourceUp = undefined
			updTrg.function = undefined
			//setMap({ ...map, targetFields: fields })
			onChange(updTrg)
		} else {
			let srcInd = []
			let inputs = []
			let inputStatics = []
			//console.log('value', value)
			let val = value.replace('=', '').trim()
			//console.log('val', val)
			if (!fun || !fun.name || !val.startsWith(fun.name)) {
				map.sourceFields.forEach((sf) => {
					if (val === sf.parentUp) {
						updTrg.srcInd = sf.ind
						updTrg.text = val
						updTrg.value = sf.parent !== '' ? '${' + sf.parent + sf.name + '}' : sf.name
						updTrg.key = updTrg.parent !== '' ? '${' + updTrg.parent + updTrg.name + '}' : updTrg.name
						updTrg.label = sf.parent !== '' ? sf.parent + sf.name : sf.name
						updTrg.sourceUp = sf.parentUp !== '' ? sf.parentUp : ''
						updTrg.function = undefined
					}
				})
				onChange(updTrg)
			} else {
				val = val.replace(fun.name, '').replace('(', '').replace(')', '')
				//console.log('val', val)
				map.sourceFields.forEach((sf) => {
					if (sf.type && val.includes(sf.parentUp)) {
						srcInd.push(sf.ind)
					}
				})
				try {
					let params = val.split(';')
					if (params.length !== fun.definition.length) {
						alert('Invalid format for input function. Please revalidate.')
					} else {
						params.forEach((inp, ind) => {
							switch (fun.definition[ind]) {
								case 'S':
									inputStatics.push(inp.trim())
									break
								case 'F':
									inputs.push( inp.trim() + ':' +  getSourceField(inp.trim()).sourceUp)
									break
								case 'SA':
									//inputStatics = inputStatics.concat(inp)
									inputStatics.push(formatStringArray(inp))
									break
								case 'FA':
									//inputs = inputs.concat(inp)
									inputs.push( formatFieldArray(inp))
									break
								default:
									break
							}
						})
						updTrg.srcInd = srcInd
						updTrg.text = value
						updTrg.value = value
						updTrg.label = src.parent !== '' ? src.parent + src.name : src.name
						updTrg.sourceUp = src.parentUp !== '' ? src.parentUp : ''
						updTrg.function = { name: fun.name, label: fun.label, inputs, inputStatics }
						onChange(updTrg)
					}
				} catch (e) {
					alert('Invalid format for input function. Please revalidate.')
				}
			}

		}
	}

	const filterItems = (token) => {
		//console.log(token)
		setTok(token)
		return token !== '' ? list.filter((x) => x.name.toLowerCase().includes(token.toLowerCase())) : list
	}

	const formatOutput = (item, trigger) => {
		// console.log(tok)
		// console.log(rta.current.getCaretPosition() - tok.length + item.name.length + 1)
		return item.type === 'func'
			? {
					//text: trigger + item.name + '(  )',
					text: trigger + item.label,
					caretPosition: rta.current.getCaretPosition() - tok.length + item.name.length + 2
				}
			: { text: (trigger === ' ' ? '' : trigger) + item.name, caretPosition: 'end' }
	}

	return (
		<Dialog open={trg ? true : false} onClose={onCancel} maxWidth='md' fullWidth>
			<DialogTitle>Type &lt;space&gt; for autocomplete / suggestion </DialogTitle>
			<DialogContent style={{ height: 250, overflow: 'auto' }}>
				<div style={{ paddingBottom: 10 }}>{fun.char}</div>
				<ReactTextareaAutocomplete
					autoFocus={true}
					className='my-textarea'
					dropdownClassName='function-dropdown'
					onItemSelected={({ item }) => {
						if (item.type === 'func') setFun(item)
						//alert(JSON.stringify(item))
					}}
					loadingComponent={Loading}
					style={{
						fontSize: '16px',
						lineHeight: '22px',
						padding: 10,
						minWidth: 10
					}}
					ref={rta}
					// innerRef={(_textarea) => {
					// 	textarea = _textarea
					// }}
					containerStyle={containerStyle}
					minChar={0}
					trigger={{
						// '=': {
						// 	dataProvider: filterItems,
						// 	component: outputItem,
						// 	output: formatOutput
						// },
						// ',': {
						// 	dataProvider: filterItems,
						// 	component: dropdownItem,
						// 	output: formatOutput
						// },
						' ': {
							dataProvider: filterItems,
							component: dropdownItem,
							output: formatOutput
						}
						// '"': {
						// 	dataProvider: filterItems,
						// 	component: dropdownItem,
						// 	output: formatOutput
						// }
					}}
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClear} color='warning' variant='outlined'>
					Clear
				</Button>
				<Button onClick={onCancel} color='primary' variant='outlined'>
					Close
				</Button>
				<Button type='submit' onClick={submitForm} color='primary' variant='contained'>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	)
}
