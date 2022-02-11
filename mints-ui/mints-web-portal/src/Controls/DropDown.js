import React from 'react'
import { FormControl, Select, InputLabel } from '@material-ui/core'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

export default function DropDown (props) {
	const [ value, setValue ] = React.useState('')
	const [ items, setItems ] = React.useState([])
	const inputLabel = React.useRef(null)
	const [ labelWidth, setLabelWidth ] = React.useState(50)
	const [ open, setOpen ] = React.useState(false)
	const [ newItem, setNewItem ] = React.useState('')

	React.useEffect(() => {
		setLabelWidth(inputLabel.current.offsetWidth)
	}, [])
	React.useEffect(
		() => {
			if (props.items && props.value) {
				setValue(props.value)
				setItems(props.items)
				if (props.value === '-- Other --') {
					setOpen(true)
				} else {
					if (props.items.filter((i) => i === props.value).length === 0) {
						//items.push(props.value)
						setItems([ ...props.items, props.value ])
					}
				}
			}
		},
		[ props.items, props.value ]
	)

	const handleOk = (e) => {
		e.preventDefault()
		if (newItem === '') {
			props.onChange(items[0])
		} else {
			props.onChange(newItem)
		}
		setOpen(false)
	}

	const handleClose = () => {
		props.onChange(items[0])
		setNewItem('')
		setOpen(false)
	}

	return (
		<FormControl variant='standard' style={{ margin: 5, padding: 0 }} fullWidth>
			<InputLabel shrink={true} ref={inputLabel}>
				{props.label}
			</InputLabel>
			<Select
				defaultValue={value ? value : ''}
				value={value}
				onChange={(e) => props.onChange(e.target.value)}
				labelWidth={labelWidth}
				inputProps={{
					name: props.label,
					id: 'outlined-age-native-simple'
				}}
			>
				{/* <option value="" /> */}
				{items.map((item, index) => (
					<option style={{ padding: '7px 12px', cursor: 'pointer' }} key={index} value={item}>
						{item}
					</option>
				))}
				{props.new && (
					<option style={{ padding: '7px 12px', cursor: 'pointer' }} value='-- Other --'>
						-- Other --
					</option>
				)}
			</Select>

			<Dialog open={open} onClose={handleClose}>
				<form onSubmit={handleOk}>
					<DialogContent>
						<DialogContentText>Enter value for {props.label}</DialogContentText>
						<TextField autoFocus fullWidth value={newItem} onChange={(e) => setNewItem(e.target.value)} />
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color='primary'>
							Cancel
						</Button>
						<Button type='submit' color='primary'>
							Ok
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</FormControl>
	)
}
