import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import { InputLabel } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
	formControl: {
		// margin: 5,
		// border: '1px solid #ccc',
		// borderRadius: 5,
		minHeight: 51,
		width: '100%',
		textAlign: 'center',
		'&:hover': {
			// border: '1px solid #000'
		}
	},
	label: {
		background: '#fff'
		// padding: '0 3px 0 3px'
	},
	radioGroup: {
		paddingTop: 15,
		paddingLeft: 5
	}
}))

export default function RadioSelection (props) {
	const classes = useStyles()

	return (
		<FormControl className={classes.formControl}>
			<InputLabel shrink={true} className={classes.label}>
				{' '}
				{props.label}{' '}
			</InputLabel>
			<RadioGroup
				aria-label='gender'
				className={classes.radioGroup}
				value={props.value}
				onChange={props.onChange}
				row
			>
				{props.items.map((item, index) => (
					<FormControlLabel
						key={index}
						value={item}
						control={<Radio />}
						disabled={props.disabled && props.disabled.includes(item)}
						label={item}
					/>
				))}
			</RadioGroup>
		</FormControl>
	)
}
