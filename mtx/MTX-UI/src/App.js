import React, { useRef, useEffect, useState } from 'react'
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { Switch, Route } from 'react-router'
import { BrowserRouter, Link } from 'react-router-dom'

import Home from './Home/Home'
import Map from './Map/Map'
import FileView from './FileView/FileView'
import Theme from './theme.json'
import './App.css'
import UIHelper from './Helpers/UIHelper'
import RestHelper from './Helpers/RestHelper'

import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import AddBoxIcon from '@material-ui/icons/AddBox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import TransformIcon from '@material-ui/icons/Transform'
import DescriptionIcon from '@material-ui/icons/Description'
import Typography from '@material-ui/core/Typography'
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles'

import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'

const drawerWidth = 350

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0
		}
	},
	appBar: {
		[theme.breakpoints.up('sm')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth
		}
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none'
		}
	},
	// necessary for content to be below app bar
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: drawerWidth
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	}
}))

const Accordion = withStyles({
	root: {
		border: '1px solid rgba(0, 0, 0, .125)',
		boxShadow: 'none',
		'&:not(:last-child)': {
			borderBottom: 0
		},
		'&:before': {
			display: 'none'
		},
		'&$expanded': {
			margin: 'auto'
		}
	},
	expanded: {}
})(MuiAccordion)

const AccordionSummary = withStyles({
	root: {
		backgroundColor: 'rgba(0, 0, 0, .03)',
		borderBottom: '1px solid rgba(0, 0, 0, .125)',
		marginBottom: -1,
		minHeight: 56,
		'&$expanded': {
			minHeight: 56
		}
	},
	content: {
		'&$expanded': {
			margin: '12px 0'
		}
	},
	expanded: {}
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
	root: {
		padding: theme.spacing(1)
	}
}))(MuiAccordionDetails)

function App (props) {
	const [ maps, setMaps ] = useState(null)
	const uiRef = useRef(null)

	const { window } = props
	const classes = useStyles()
	const theme = useTheme()
	const [ mobileOpen, setMobileOpen ] = React.useState(false)

	const [ expanded, setExpanded ] = React.useState('panel1')

	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : false)
	}

	useEffect(() => {
		getMaps()
	}, [])

	const getMaps = () => {
		uiRef.current.Loading(true)
		RestHelper.get('maps')
			.then((list) => {
				if (list && list.Success) {
					setTimeout(() => {
						setMaps(list.Result)
						// if (list.Result.length > 0) {
						// 	setExpanded(list.Result[0].project)
						// }
					}, 100)
				}
				uiRef.current.Loading(false)
			})
			.catch((err) => {
				uiRef.current.Loading(false)
				uiRef.current.Error(err)
			})
	}

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}

	const drawer = (
		<div>
			<div className={classes.toolbar} style={{ paddingTop: 30 }}>
				<Typography variant='h5'>
					<b>MINTS Transformation</b>
				</Typography>
			</div>
			<Divider />
			<List>
				<ListItem className='App-link' component={Link} to='/'>
					<ListItemIcon>
						<HomeIcon />
					</ListItemIcon>
					<ListItemText primary='Home' />
				</ListItem>
				<ListItem className='App-link' component={Link} to='/map'>
					<ListItemIcon>
						<AddBoxIcon />
					</ListItemIcon>
					<ListItemText primary='New Map' />
				</ListItem>
			</List>
			<Divider />

			{maps &&
			maps.length > 0 && (
				<div>
					{[ ...new Set(maps.map((item) => item.project)) ].map((project, index) => (
						<Accordion key={index} square expanded={expanded === project} onChange={handleChange(project)}>
							<AccordionSummary aria-controls='panel1d-content' id={'header-' + index}>
								<Typography>{project}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<List>
									{maps.filter((x) => x.project === project).map((map, ind) => {
										return (
											<React.Fragment key={ind}>
												<ListItem
													className='App-link'
													component={Link}
													to={'/map/' + map.project + '/' + map.id}
												>
													<ListItemIcon>
														<TransformIcon />
													</ListItemIcon>
													<ListItemText primary={map.name} />
												</ListItem>
												<ListItem
													className='App-link'
													component={Link}
													to={'/file/' + map.project + '/' + map.sFile}
												>
													<ListItemIcon>
														<DescriptionIcon />
													</ListItemIcon>
													<ListItemText primary={'' + map.sFile} />
												</ListItem>
												<ListItem
													className='App-link'
													component={Link}
													to={'/file/' + map.project + '/' + map.tFile}
												>
													<ListItemIcon>
														<DescriptionIcon />
													</ListItemIcon>
													<ListItemText primary={'' + map.tFile} />
												</ListItem>
											</React.Fragment>
										)
									})}
								</List>
							</AccordionDetails>
						</Accordion>
					))}
				</div>
			)}
		</div>
	)

	const container = window !== undefined ? () => window().document.body : undefined

	return (
		<MuiThemeProvider theme={createTheme(Theme)}>
			<BrowserRouter>
				<div className='App'>
					<UIHelper ref={uiRef} />
					<nav className={classes.drawer} aria-label='mailbox folders'>
						{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
						<Hidden smUp implementation='css'>
							<Drawer
								container={container}
								variant='temporary'
								anchor={theme.direction === 'rtl' ? 'right' : 'left'}
								open={mobileOpen}
								onClose={handleDrawerToggle}
								classes={{
									paper: classes.drawerPaper
								}}
								ModalProps={{
									keepMounted: true // Better open performance on mobile.
								}}
							>
								{drawer}
							</Drawer>
						</Hidden>
						<Hidden xsDown implementation='css'>
							<Drawer
								classes={{
									paper: classes.drawerPaper
								}}
								variant='permanent'
								open
							>
								{drawer}
							</Drawer>
						</Hidden>
					</nav>
					{maps && (
						<div className='App-content'>
							<Switch>
								<Route exact path='/' render={() => <Home uiRef={uiRef.current} />} />
								<Route exact path='/map' render={() => <Map uiRef={uiRef.current} />} />
								<Route
									path='/map/:project/:id'
									render={({ match: { params } }) => <Map {...params} uiRef={uiRef.current} />}
								/>
								<Route
									path='/file/:project/:id'
									render={({ match: { params } }) => <FileView {...params} uiRef={uiRef.current} />}
								/>
							</Switch>
						</div>
					)}
				</div>
			</BrowserRouter>
		</MuiThemeProvider>
	)
}

export default App
