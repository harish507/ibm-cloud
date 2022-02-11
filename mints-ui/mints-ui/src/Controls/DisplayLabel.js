import React from 'react'
import { Typography } from '@material-ui/core'

export default function DisplayLabel ({ label, text, direction, reverse }) {
	const styles = {
		root: {
			display: 'flex',
			flexDirection: direction ? direction : 'column'
		},
		label: {
			display: 'inline',
			fontSize: 11
		},
		text: {
			display: 'inline',
			fontSize: 12
		}
	}

	return (
		<div style={styles.root}>
			<Typography component='span' variant='body1' style={reverse ? styles.text : styles.label}>
				{label}
				{!reverse && <span>:</span>}
			</Typography>
			{direction === 'row' && <span>&nbsp;&nbsp;</span>}
			<Typography component='span' variant='body1' style={reverse ? styles.label : styles.text}>
				{text}
			</Typography>
		</div>
	)
}
