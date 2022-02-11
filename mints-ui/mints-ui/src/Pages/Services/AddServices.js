import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextBox from '../../Controls/TextBox'
import DropDown from '../../Controls/DropDown'

export default function AddServices (props) {
	//const { uiRef } = props
	const items = Object.values(props.services).map((obj) => obj.type)
	const filtered = items.filter((type, index) => items.indexOf(type) === index)

	return (
		<div className='content'>
			<div style={{ width: '80%', paddingLeft: '10%' }}>
				<Dialog open={props.item ? true : false} onClose={props.onCancel} maxWidth='sm' fullWidth>
					<DialogTitle id='form-dialog-title'>Create Service</DialogTitle>
					<form>
						<DialogContent>
							<DropDown
								label='Type *'
								value={props.addService.type}
								items={filtered}
								onChange={(val) => props.handleChange('type', val)}
							/>
							<TextBox
								label='Name *'
								id='name'
								autoFocus={true}
								value={props.addService.name}
								onChange={(e) => props.handleChange('name', e.target.value)}
							/>
							<TextBox
								label='Version *'
								id='version'
								value={props.addService.version}
								onChange={(e) => props.handleChange('version', e.target.value)}
							/>
						</DialogContent>

						<DialogActions>
							<Button variant='outlined' onClick={props.onCancel} color='primary'>
								Close
							</Button>
							<Button variant='contained' type='submit' onClick={props.submitService} color='primary'>
								Save
							</Button>
						</DialogActions>
					</form>
				</Dialog>
			</div>
		</div>
	)
}
