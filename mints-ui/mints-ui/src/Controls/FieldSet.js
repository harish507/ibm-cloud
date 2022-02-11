import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import { InputLabel } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: 5,
		border: '1px solid #ccc',
		borderRadius: 5,
		minHeight: 51,
		width: '100%',
		textAlign: 'center',
		'&:hover': {
			border: '1px solid #000'
		}
	},
	label: {
		background: '#eee',
		padding: '0 7px 0 7px'
	},
	formContent: {
		padding: 10,
		// margin: 5,
		paddingLeft: 30
		// minHeight: 300,
	},
	formContentNoPadding: {
		padding: 0
	}
}))

export default function FieldSet (props) {
	const classes = useStyles()

	return (
		<FormControl variant='outlined' className={classes.formControl} style={props.style}>
			<InputLabel shrink={true} className={classes.label}>
				{props.label}
			</InputLabel>
			<div className={props.noPadding ? classes.formContentNoPadding: classes.formContent} style={props.bodyStyle}>{props.children}</div>
			{/* className={!props.noStyle ? classes.formContent: null} */}
		</FormControl>
	)
}
