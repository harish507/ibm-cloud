import React from 'react'
import TextField from '@material-ui/core/TextField'

export default function TextBox (props) {
	return (
		<TextField
			disabled={props.disabled}
			label={props.noBorder ? '' : props.label}
			placeholder={props.label}
			type={props.type}
			value={props.value}
			error={props.error}
			autoFocus={props.autoFocus}
			InputProps={{
				readOnly: props.readOnly
			}}
			InputLabelProps={{
				shrink: true
			}}
			margin='none'
			variant={props.noBorder ? 'standard' : 'outlined'}
			onChange={props.onChange}
			fullWidth
			multiline={props.multiline}
			rows={props.rows}
			style={{ margin: 5, padding: 0, ...props.style }}
		/>
	)
}
