import React, { useState } from 'react'
import { CircularProgress, Typography, Button, Fade } from '@material-ui/core'
import TextBox from '../../Controls/TextBox'

export default function Login(props) {
	var [ isLoading ] = useState(false)
	var [ error ] = useState(null)
	const [ loginCerds, setLoginCreds ] = useState({ email: '', password: '' })

	const handleChange = (key, value) => {
		setLoginCreds({ ...loginCerds, [key]: value })
	}

	const submit = (e) => {
		e.preventDefault()
		props.onSignIn(loginCerds)
	}
	return (
		<div className="content">
			<div style={{ width: '80%', paddingLeft: '10%' }}>
				<Typography variant="h4"> </Typography>
				{error && (
					<Fade in={error}>
						<Typography color="secondary">Something is wrong with your login or password :(</Typography>
					</Fade>
				)}
				<div style={{ width: '100%', marginBottom: 20 }}>
					<TextBox
						id="email"
						label="Email *"
						value={loginCerds.email}
						placeholder="Email"
						type="email"
						onChange={(e) => handleChange('email', e.target.value)}
					/>
				</div>
				<div style={{ width: '100%', marginBottom: 40 }}>
					<TextBox
						id="password"
						label="Password *"
						value={loginCerds.password}
						type="password"
						onChange={(e) => handleChange('password', e.target.value)}
					/>
				</div>
				<div
					style={{
						width: '100%',
						display: 'flex',
						justifyContent: 'space-around',
						alignItems: 'center'
					}}
				>
					{isLoading ? (
						<CircularProgress size={26} />
					) : (
						<Button onClick={submit} variant="contained" color="primary" size="large">
							Login
						</Button>
					)}
					<Button color="primary" size="large">
						Forget Password
					</Button>
				</div>
			</div>
		</div>
	)
}
