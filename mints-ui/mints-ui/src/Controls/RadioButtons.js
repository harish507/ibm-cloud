import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
// import Radio from '@material-ui/core/Radio'
import Button from '@material-ui/core/Button'
// import RadioGroup from '@material-ui/core/RadioGroup'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import { InputLabel } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: 5,
		// border: '1px solid #ccc',
		// borderRadius: 5,
		minHeight: 51,
		textAlign: 'left',
		'&:hover': {
			// border: '1px solid #000'
		}
	},
	label: {
		fontSize: '2em',
		background: '#eee',
		padding: '0 3px 0 3px'
	},
	buttonGroup: {
		margin: 25,
		addingLeft: 10
	},
	button: { margin: 0, padding: 3, borderRadius: 0, textTransform: 'none' }
}))

export default function RadioButtons (props) {
	const classes = useStyles()

	return (
		<FormControl
			variant='standard'
			className={classes.formControl}
			style={{ width: props.width ? props.width : '100%' }}
		>
			<InputLabel shrink={true} className={classes.label}>
				{props.label}
			</InputLabel>
			<div className={classes.buttonGroup}>
				{props.items.map((item, index) => (
					<Button
						key={index}
						variant={props.value === item ? 'contained' : 'outlined'}
						color='primary' //{props.value === item ? 'primary' : 'primary'}
						className={classes.button}
						onClick={(e) => props.onChange(item)}
					>
						{item}
					</Button>
				))}
			</div>
			{/* <InputLabel shrink={true} className={classes.label}>
				{props.label}
			</InputLabel> */}
			{/* <RadioGroup className={classes.radioGroup} value={props.value} onChange={props.onChange} row>
				{props.items.map((item, index) => (
					<FormControlLabel
						key={index}
						value={item}
						control={
							<Button variant='contained' color='primary'>
								{item}
							</Button>
						}
					/>
				))}
			</RadioGroup> */}
		</FormControl>
	)
}
