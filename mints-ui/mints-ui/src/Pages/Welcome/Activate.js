import React from 'react'
import{ Button, Typography }from '@material-ui/core'
import TextBox from '../../Controls/TextBox'

export default function Activate(props) {
	return (
		<div className="content">
		<Typography style={{  marginBottom : '2%' }} >Organization details saved successfully.Please check your emails activation key</Typography>
			<div style={{ width: '80%', paddingLeft: '10%' }}>
				<TextBox
					label="Activation Key *"
					value={props.activateKey.key}
					onChange={(e) => props.handleChange('key', e.target.value)}
				/>
				<Button
					type="submit"
					style={{ padding: 10 }}
					variant="contained"
					onClick={props.onVerifyKey}
					color="primary"
				>
					Verify
				</Button>
			</div>
		</div>
	)
}
