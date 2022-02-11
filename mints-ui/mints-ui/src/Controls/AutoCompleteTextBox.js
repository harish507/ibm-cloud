import React from 'react'
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete'
import FieldSet from './FieldSet'


import '@webscopeio/react-textarea-autocomplete/style.css'
// import { Typography } from '@material-ui/core'

const dropdownItem = ({ entity: item}) => {
	return (
		<div className='function-popover-item'  >
			<span className='text' style={{padding: 5, fontSize: 14}}>{item}</span>
		</div>
	)
}
// const dropdownItem = ({ entity: { type, name, label, char } }) => {
// 	return (
// 		<div className='function-popover-item'>
// 			<span>
// 				{type === 'func' ? (
// 					<FunctionsIcon className='icon' style={{ fontsize: 'xs' }} />
// 				) : (
// 					<FormatSizeIcon className='icon' style={{ fontsize: 'xs' }} />
// 				)}
// 			</span>
// 			<span className='text'>{name}</span>
// 		</div>
// 	)
// }

const Loading = ({ data }) => <div>Loading</div>
// const TextField = ({ value, handleChange }) => <TextBox label='Description' />

export default function FunctionTextBox ({ items, trg, onCancel, onChange }) {
	// const [ list, setList ] = React.useState([])
		const [ tok, setTok ] = React.useState('')
	const [ value, setValue ] = React.useState('')

	// const rta = React.useRef()
	// const textRef = React.useRef()

	// str = str.replace(/(^[,\s]+)|([,\s]+$)/g, '');


	React.useEffect(() => {
		// var items = []
		// if (map && functions) {
		// 	functions.forEach((f) => {
		// 		items.push({
		// 			type: 'func',
		// 			name: f.name,
		// 			label: f.label,
		// 			char: f.text,
		// 			definition: f.definition
		// 		})
		// 		if (trg && trg.function && trg.function.name === f.name)
		// 			setFun({
		// 				type: 'func',
		// 				name: f.name,
		// 				label: f.label,
		// 				char: f.text,
		// 				definition: f.definition
		// 			})
		// 	})
		// 	map.sourceFields.filter((f) => f.type).forEach((f) =>
		// 		items.push({
		// 			type: 'src',
		// 			name: f.parentUp,
		// 			label: f.parentUp,
		// 			char: f.parentUp,
		// 			definition: f.name
		// 		})
		// 	)
			//map.targetFields.forEach((f) => items.push({ type: 'trg', name: f.label, label: f.label, char: f.label }))
			//setList(items)
		// }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const filterItems = (token) => {
		//console.log(token)
		setTok(token)
        return token !== '' ? items.filter((x) => x.toLowerCase().includes(token.toLowerCase())) : items
		//return token !== '' ? items.filter((x) => x.toLowerCase().includes(token.toLowerCase())) : items
	}

	const formatOutput = (item, trigger) => {
		// console.log(tok)
		// console.log(rta.current.getCaretPosition() - tok.length + item.name.length + 1)
        return { text: item, caretPosition: 'end' }
		// return item.type === 'func'
		// 	? {
		// 			//text: trigger + item.name + '(  )',
		// 			text: trigger + item.label,
		// 			caretPosition: rta.current.getCaretPosition() - tok.length + item.name.length + 2
		// 		}
		// 	: { text: (trigger === ' ' ? '' : trigger) + item.name, caretPosition: 'end' }
	}

	return (
        <FieldSet label='Service' noPadding  >
				<ReactTextareaAutocomplete
                    placeholder={'Service'}
					spellcheck="false" 
					// className='my-textarea'
                    className='MuiInputBase-input MuiOutlinedInput-input'
                    // className='MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputMultiline MuiOutlinedInput-inputMultiline'
					dropdownClassName='function-dropdown'
					onItemSelected={({ item }) => {
						alert(JSON.stringify(item))
					}}
                    // textAreaComponent={{component: TextField, ref:'textRef'}}
					loadingComponent={Loading}
                    style={{fontSize: '0.8rem'}}
                    rows={1}

					// ref={rta}
					// innerRef={textRef}
					// containerStyle={{}}
					minChar={0}
					trigger={{
						' ': {
							dataProvider: filterItems,
							component: dropdownItem,
							output: formatOutput
						}
					}}
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
        </FieldSet>
			
	)
}
