import React from 'react'
import { Button } from '@material-ui/core'

export default function CustomButton (props) {
	return (
		<Button
			variant='contained'
			color={props.secondary ? 'secondary' : 'primary'}
			{...props}
			// disabled={props.disabled}
			// type={props.type ? props.type : 'button'}
			// className={props.className}
			style={{ margin: 5, textTransform: 'none', ...props.style }}
		>
			{props.label}
		</Button>
	)
}
