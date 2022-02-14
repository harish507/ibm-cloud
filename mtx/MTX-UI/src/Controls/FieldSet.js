import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import { InputLabel } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
	formControl: {
		// margin: 5,
		// border: '1px solid #ccc',
		// borderRadius: 5,
		minHeight: 51,
		width: '100%',
		textAlign: 'left',
		'&:hover': {
			// border: '1px solid #000'
		}
	},
	formControlBorder: {
		border: '1px solid #ccc',
		borderRadius: 5,
		minHeight: 51,
		width: '100%',
		textAlign: 'left',
		'&:hover': {
			// border: '1px solid #000'
		}
	},
	label: {
		// background: '#fff',
		position: 'relative',
		top: -10,
		minWidth: 150
		// padding: '0 3px 0 3px'
	},
	formContent: {
		// paddingTop: 25,
		paddingLeft: 25,
		textAlign: 'left'
	}
}))

export default function FieldSet (props) {
	const classes = useStyles()

	return (
		<FormControl className={props.border ? classes.formControlBorder : classes.formControl} style={props.style}>
			<InputLabel shrink={true} className={classes.label}>
				{props.label}
			</InputLabel>
			<div className={classes.formContent} style={props.contentStyle}>
				{props.children}
			</div>
			{/* className={!props.noStyle ? classes.formContent: null} */}
		</FormControl>
	)
}
