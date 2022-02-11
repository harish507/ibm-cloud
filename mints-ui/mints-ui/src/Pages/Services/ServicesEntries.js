import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextBox from '../../Controls/TextBox'
import _ from 'lodash'

export default function ServicesEntries (props) {
	
	return (
		<div>
			<Dialog open={props.config ? true : false} onClose={props.onCancel} maxWidth='xs' fullWidth>
				{props.config && <DialogTitle>{_.startCase(props.config.type)} Configuration</DialogTitle>}

				<DialogContent style={{ height: 100, overflow: 'auto' }}>
					{props.config && (
						<div>
							<TextBox
								label='End point Url'
								value={props.config.url}
								autoFocus={true}
								onChange={props.handleChange}
							/>
						</div>
					)}
				</DialogContent>
				<DialogActions>
					<Button variant='outlined' onClick={props.onCancel} color='primary'>
						Close
					</Button>
					<Button variant='contained' color='primary' type='submit' onClick={props.onSubmit}>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
