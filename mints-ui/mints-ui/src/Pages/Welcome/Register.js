import React, { useState } from 'react'
import { Button, Typography } from '@material-ui/core'
import TextBox from '../../Controls/TextBox'

export default function Register(props) {
	//const { uiRef } = props
	const [ orgDetails, setOrgDetails ] = useState(props.item)

	const handleChange = (key, value) => {
		setOrgDetails({ ...orgDetails, [key]: value })
	}
	const submit = (e) => {
		e.preventDefault()
		props.signUp(orgDetails)
	}
	return (
		<div>
			<Typography style={{ paddingRight: '44%', marginBottom : '2%' }}> No organization details found please register</Typography>
			<div style={{ width: '80%', paddingLeft: '10%' }}>
				<TextBox
					label="Organization *"
					autoFocus={true}
					value={orgDetails.organization}
					onChange={(e) => handleChange('organization', e.target.value)}
				/>
				<TextBox
					label="Name *"
					autoFocus={true}
					value={orgDetails.name}
					onChange={(e) => handleChange('name', e.target.value)}
				/>
				<TextBox
					label="Email *"
					autoFocus={true}
					value={orgDetails.email}
					onChange={(e) => handleChange('email', e.target.value)}
				/>
				<TextBox
					label="Phone *"
					autoFocus={true}
					value={orgDetails.phone}
					onChange={(e) => handleChange('phone', e.target.value)}
				/>
				<Button type="submit" style={{ padding: 10 }} variant="contained" onClick={submit} color="primary">
					SignUp
				</Button>
			</div>
		</div>
	)
}
