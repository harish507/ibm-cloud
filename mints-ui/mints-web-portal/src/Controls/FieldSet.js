import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import { InputLabel } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: 5,
		// border: '1px solid #ccc',
		// borderRadius: 5,
		minHeight: 51,
		width: '100%',
		textAlign: 'left',
		'&:hover': {
			// border: '1px solid #000'
		}
	},
	label: {
		// background: '#fff',
		padding: '0 3px 0 3px'
	},
	formContent: {
		paddingTop: 20,
		// margin: 5,
		paddingLeft: 20
		// minHeight: 300,
	},
	formContentNoLabel: {
		paddingTop: 0,
		// margin: 5,
		paddingLeft: 20
		// minHeight: 300,
	}
}))

export default function FieldSet (props) {
	const classes = useStyles()

	return (
		<FormControl variant='standard' className={classes.formControl} style={props.style}>
			<InputLabel shrink={true} className={classes.label}>
				{props.label}
			</InputLabel>
			<div className={props.label ? classes.formContent : classes.formContentNoLabel}>{props.children}</div>
			{/* className={!props.noStyle ? classes.formContent: null} */}
		</FormControl>
	)
}
