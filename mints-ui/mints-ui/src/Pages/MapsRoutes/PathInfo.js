import React from 'react'
import { Fab, Grid } from '@material-ui/core'
import TextBox from '../../Controls/TextBox'
import FieldSet from '../../Controls/FieldSet'
import RefreshIcon from '@material-ui/icons/Refresh'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace'

export default function PathInfo ({ path, refresh, moveUp }) {
	return (
		<FieldSet label='Path'>
			<Grid container spacing={1} alignContent='center' alignItems='center'>
				<Grid item md={10} xs={12}>
					<TextBox variant='none' label='Path' value={path} noBorder readonly />
				</Grid>
				<Grid item md={2} xs={12}>
					<Fab variant='round' size='small' onClick={refresh} color='primary'>
						<RefreshIcon />
					</Fab>
					<Fab disabled={path === '/'} variant='round' size='small' onClick={moveUp} color='primary'>
						<KeyboardBackspaceIcon />
					</Fab>
				</Grid>
			</Grid>
		</FieldSet>
	)
}
