import React from 'react'
import _ from 'lodash'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import { InputLabel } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: 5,
		marginBottom: 20,
		// border: '1px solid #ccc',
		// borderRadius: 5,
		// minHeight: 51,
		textAlign: 'left',
		'&:hover': {
			// border: '1px solid #000'
		}
	},
	label: {
		fontSize: '1rem',
		background: '#eee',
		padding: '0 3px 0 3px'
	},
	buttonGroup: {
		marginLeft: 25,
		marginTop: 25,
		addingLeft: 10
	},
	button: { margin: 0, padding: 3, paddingLeft: 15, paddingRight: 15, borderRadius: 0, textTransform: 'none' }
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
				{_.startCase(props.label)}
			</InputLabel>
			<div className={classes.buttonGroup}>
				{props.items.map((item, index) => (
					<Button
						key={index}
						variant={
							props.keyField ? props.value === item[props.keyField] ? (
								'contained'
							) : (
								'outlined'
							) : props.value === item ? (
								'contained'
							) : (
								'outlined'
							)
						}
						color='primary' //{props.value === item ? 'primary' : 'primary'}
						className={classes.button}
						onClick={(e) => props.onChange(props.valueField ? item[props.valueField] : item)}
					>
						{props.labelField ? props.startCase ? (
							_.startCase(item[props.labelField])
						) : (
							item[props.labelField]
						) : props.startCase ? (
							_.startCase(item)
						) : (
							item
						)}
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
