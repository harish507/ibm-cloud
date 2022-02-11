import React from 'react'
import { Switch, Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import Clocks from './Clocks'

const Layout = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path='/' component={App} />
				<Route exact path='/clocks' component={Clocks} />
			</Switch>
		</BrowserRouter>
	)
}

export default Layout
