import React from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { Switch, Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import {
	Home,
	SelectIntegration,
	Deploy,
	Integration,
	ContactUs,
	Template,
	Admin,
	Test,
	Profile,
	Welcome,
	Performance,
	AppDashboard,
	ServiceHub
} from '../'
import Theme from './theme.json'
import { Grid } from '@material-ui/core'
import Header from './Header'

//  Common stylesheet
import './Main.css'
//  IntroJs stylesheet
import 'intro.js/introjs.css'

import UserContext, { UserContextProvider } from '../../Helpers/UserContext'

export default function Main () {
	// const context = React.useContext(UserContext)
	const [ user, setUser ] = React.useState({ name: 'Mints Admin', role: 'Administrator' }) //{ name: 'Mints Admin', role: 'Administrator' }

	React.useEffect(() => {
		const info = sessionStorage.getItem('user')
		info && setUser(JSON.parse(info))
	}, [])

	return (
		<UserContextProvider>
			<MuiThemeProvider theme={createMuiTheme(Theme)}>
				<UserContext.Consumer>
					{(context) => {
						return (
							<BrowserRouter>
								<Grid container spacing={0}>
									<Grid item xs={12}>
										<Header />
									</Grid>
									{!user && (
										<Grid item xs={12} style={{ paddingTop: 60 }}>
											<Welcome />
										</Grid>
									)}
									{user && (
										<Grid item xs={12} style={{ paddingTop: 60 }}>
											{context.login(user)}
											<Switch>
												<Route exact path='/' component={Home} />
												<Route exact path='/integrations' component={SelectIntegration} />
												<Route exact path='/integrations/create' component={Integration} />
												<Route exact path='/integrations/deploy' component={Deploy} />
												<Route exact path='/integrations/:id' component={Integration} />
												<Route exact path='/serviceHub' component={ServiceHub} />
												<Route exact path='/templates' component={Template} />
												<Route exact path='/contact' component={ContactUs} />
												<Route exact path='/profile' component={Profile} />
												<Route exact path='/admin' component={Admin} />
												<Route
													exact
													path='/admin/:page'
													render={({ match: { params } }) => <Admin page={params.page} />}
												/>
												<Route exact path='/test/:id' component={Test} />
												<Route exact path='/performance' component={Performance} />
												<Route exact path='/dashboard' component={AppDashboard} />
											</Switch>
										</Grid>
									)}
								</Grid>
							</BrowserRouter>
						)
					}}
				</UserContext.Consumer>
			</MuiThemeProvider>
		</UserContextProvider>
	)
}
