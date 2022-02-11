import React from 'react'
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { Switch, Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import Theme from './theme.json'
import { Grid } from '@material-ui/core'
import Header from './Header'

import { Estimate, Performance, TestUrl } from '../'

//  Common stylesheet
import './Main.css'
// //  IntroJs stylesheet
// import 'intro.js/introjs.css'

export default function Main () {
	// const context = React.useContext(UserContext)
	// const [ user, setUser ] = React.useState({ name: 'Mints Admin', role: 'Administrator' }) //{ name: 'Mints Admin', role: 'Administrator' }

	// React.useEffect(() => {
	// 	const info = sessionStorage.getItem('user')
	// 	info && setUser(JSON.parse(info))
	// }, [])

	return (
		<MuiThemeProvider theme={createTheme(Theme)}>
			<BrowserRouter>
				<Grid container spacing={0}>
					<Grid item xs={12}>
						<Header />
					</Grid>

					<Grid item xs={12} style={{ paddingTop: 60 }}>
						<Switch>
							<Route exact path='/' component={Estimate} />
							<Route exact path='/performance' component={Performance} />
							<Route exact path='/testUrl' component={TestUrl} />
						</Switch>
					</Grid>
				</Grid>
			</BrowserRouter>
		</MuiThemeProvider>
	)
}
