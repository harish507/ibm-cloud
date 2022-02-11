import React from 'react'
import { Grid } from '@material-ui/core'
import UserContext from '../../Helpers/UserContext'
import Login from './Login'
import Features from './Features'
import Register from './Register'
import Activate from './Activate'
import ServiceHelper from '../../Helpers/ServiceHelper'

const initialValue = {
	organization: '',
	name: '',
	email: '',
	password: '',
	phone: '',
	orgID: '123452',
	role: 'admin',
	active: true,
	subscriptions: [ { id: '21212', plan: '', regDT: '', startDT: '', endDt: '', active: true } ]
}
const activationKey = 'mjuytredcvghuiokjnbvgfedfghjmkiuytrdcvghu'
const secretKey = {
	key: ''
}

export default function Welcome({ uiRef }) {
	const context = React.useContext(UserContext)
	const [ method, setMethod ] = React.useState(null)
	const [ orgDetails, setOrgDetails ] = React.useState([])
	const [ register, setRegister ] = React.useState(null)
	const [ regConfig, setRegConfig ] = React.useState(false)
	const [ login, setLogin ] = React.useState(false)
	const [ active, setActive ] = React.useState(false)
	const [ signIn, setSignIn ] = React.useState(null)
	const [ activateKey, setActivateKey ] = React.useState(null)

	React.useEffect(() => {
		setMethod('get')
	}, [])
	const loadData = (data) => {
		setMethod('get')
		setOrgDetails(data)
		organizationDetails(initialValue)
	}
	const organizationDetails = (intValue) => {
		if (Object.keys(orgDetails).length === 0) {
			setRegConfig(true)
			setRegister(intValue)
			setLogin(false)
		} else {
			setLogin(true)
		}
	}
	const showStatus = (result) => {
		setMethod('')
	}

	const signUp = (orgDetails) => {
		setRegister(orgDetails)
		setMethod('save')
		setRegConfig(false)
		setActive(true)
		setActivateKey(secretKey)
	}
	const showLoginStatus = (result) => {
		if (result) {
			if (result === 'Invalid email') {
				alert('Wrong Email')
				setMethod('get')
			} else if (result === 'Invalid password') {
				alert('Wrong Password')
				setMethod('get')
			} else if (result === true) {
				alert('Login Successful')
				setMethod('')
				context.login({ name: orgDetails[0].name })
				setTimeout(() => {
					window.location.href = '/'
				}, 10)
			}
		}
	}
	const onSignIn = (loginCreds) => {
		setSignIn(loginCreds)
		setMethod('login')
	}

	const handleChange = (key, value) => {
		setActivateKey({ ...activateKey, [key]: value })
	}
	const verifyKey = (e) => {
		if (activateKey.key === activationKey) {
			e.preventDefault()
			alert('Activation Successfully Validated. Please Login')
			setMethod('get')
			setActive(false)
			setLogin(true)
		} else {
			alert('Invalid Key')
		}
	}

	return (
		<div className="content">
			{method === 'get' && (
				<ServiceHelper
					path="orgDetails"
					render={(welcome) => {
						return (
							<div>
								{/*{uiRef && uiRef.current && uiRef.current.Loading(welcome.loading)}*/}
								{welcome.payload && loadData(welcome.payload)}
							</div>
						)
					}}
				/>
			)}
			{method === 'save' && (
				<ServiceHelper
					method="post"
					path={'register'}
					input={{ ...register }}
					render={(result) => {
						return (
							<div>
								{/*{uiRef.Loading(result.loading)}*/}
								{result.error && alert(result.error)}
								{result.payload && showStatus(result.payload)}
							</div>
						)
					}}
				/>
			)}
			{method === 'login' && (
				<ServiceHelper
					method="post"
					path={'login'}
					input={{ ...signIn }}
					render={(result) => {
						return (
							<div>
								{/*{uiRef.Loading(result.loading)}*/}
								{result.error && alert(result.error)}
								{result.payload && showLoginStatus(result.payload)}
							</div>
						)
					}}
				/>
			)}
			<Grid container className="content" spacing={8}>
				<Grid item md={6} sm={12}>
					<div className="palette-group" style={{ minHeight: 350 }}>
						<div className={[ 'palette-group-header color-light' ]}>Welcome</div>
						<div className="palette-group-content">
							<Features />
						</div>
					</div>
				</Grid>
				<Grid item md={6} sm={12}>
					<div className="palette-group" style={{ minHeight: 350 }}>
						<div className={[ 'palette-group-header color-light' ]}>Organization Details</div>
						<div className="palette-group-content">
							{activateKey &&
							active &&
							login === false && (
								<Activate
									activateKey={activateKey}
									handleChange={handleChange}
									onVerifyKey={verifyKey}
								/>
							)}
							{regConfig && register && login === false && <Register item={register} signUp={signUp} />}
							{login && active === false && <Login onSignIn={onSignIn} />}
						</div>
					</div>
				</Grid>
			</Grid>
		</div>
	)
}
