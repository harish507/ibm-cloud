import React from 'react'
import { Typography } from '@material-ui/core'
import _ from 'lodash'

export default function DisplayLabel ({ variant, label, text, direction, reverse, startCase }) {
	const styles = {
		root: {
			display: 'flex',
			flexDirection: direction ? direction : 'column'
		},
		label: {
			flex: 3,
			display: 'inline',
			fontSize: 11
		},
		text: {
			flex: 3,
			display: 'inline',
			fontSize: 12
		}
	}

	return (
		<div style={styles.root}>
			<Typography
				component='span'
				variant={variant ? variant : 'body1'}
				style={reverse ? styles.text : styles.label}
			>
				{_.startCase(label)}
				{!reverse && <span>:</span>}
			</Typography>
			{direction === 'row' && <span style={{ width: 20, flex: 1 }}>&nbsp;&nbsp;</span>}
			<Typography
				component='span'
				variant={variant ? variant : 'body1'}
				style={reverse ? styles.label : styles.text}
			>
				{startCase ? _.startCase(text) : text}
			</Typography>
		</div>
	)
}
