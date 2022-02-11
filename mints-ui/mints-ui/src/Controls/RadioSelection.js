import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import { InputLabel } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: 5,
		border: '1px solid #ccc',
		borderRadius: 5,
		minHeight: 51,
		textAlign: 'center',
		'&:hover': {
			border: '1px solid #000'
		}
	},
	label: {
		background: '#eee',
		padding: '0 3px 0 3px'
	},
	radioGroup: {
		margin: 5,
		paddingLeft: 10
	}
}))

export default function RadioSelection (props) {
	const classes = useStyles()

	return (
		<FormControl
			variant='outlined'
			className={classes.formControl}
			style={{ width: props.width ? props.width : '100%' }}
		>
			<InputLabel shrink={true} className={classes.label}>
				{props.label}
			</InputLabel>
			<RadioGroup className={classes.radioGroup} value={props.value} onChange={props.onChange} row>
				{props.items.map((item, index) => (
					<FormControlLabel key={index} value={item} control={<Radio />} label={item} />
				))}
			</RadioGroup>
		</FormControl>
	)
}
