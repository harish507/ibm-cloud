import React from 'react'
import ServiceHelper from '../../Helpers/ServiceHelper'
import { fade, makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import InputBase from '@material-ui/core/InputBase'
import Badge from '@material-ui/core/Badge'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
// import ClickAwayListener from '@material-ui/core/ClickAwayListener'
// import Grow from '@material-ui/core/Grow'
// import Paper from '@material-ui/core/Paper'
// import Popper from '@material-ui/core/Popper'
// import MenuList from '@material-ui/core/MenuList'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MailIcon from '@material-ui/icons/Mail'
import NotificationsIcon from '@material-ui/icons/Notifications'
import MoreIcon from '@material-ui/icons/MoreVert'

import { Link } from 'react-router-dom'
//import { Link as NavLink } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import BorderColorIcon from '@material-ui/icons/BorderColor'
import LeakAddIcon from '@material-ui/icons/LeakAdd'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import SettingsIcon from '@material-ui/icons/Settings'

import DisplayLabel from '../../Controls/DisplayLabel'
import UserContext from '../../Helpers/UserContext'

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	title: {
		display: 'none',
		//display: "block",
		[theme.breakpoints.up('md')]: {
			display: 'block',
			marginRight: 100
		}
	},
	search: {
		display: 'none',
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25)
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto'
		}
	},
	navBar: {
		// position: 'fixed',
		// backgroundColor: fade(theme.palette.common.white, 0.15),
		// "&:hover": {
		// 	backgroundColor: fade(theme.palette.common.white, 0.25)
		// },
		// marginRight: theme.spacing(1),
		marginLeft: theme.spacing(1) * 3,
		// width: 300, //'100%',
		padding: '0 20px 0 20px',
		borderRadius: 30,
		//right: '10%',
		[theme.breakpoints.up('xs')]: {
			padding: '0 5px 0 5px'
			//width: 'auto'
		},
		[theme.breakpoints.up('lg')]: {
			//right: '20%',
			//width: 'auto'
		}
	},
	icon: {
		paddingLeft: 12,
		paddingRight: 7,
		fontSize: 20
	},
	iconText: {
		fontSize: '0.9rem',
		[theme.breakpoints.down('sm')]: {
			display: 'none'
		}
	},
	searchIcon: {
		width: theme.spacing(7),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	inputRoot: {
		color: 'inherit'
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 7),
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: 200
		}
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex'
			// display: 'none'
		}
	},
	sectionMobile: {
		//display: "flex",
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'none'
		}
	},
	disabled: {
		color: '#999',
		curser: 'disabled !important'
	}
}))

export default function PrimarySearchAppBar () {
	const classes = useStyles()
	//const [ degOpen, setDegOpen ] = React.useState(false)
	//const [ mapsDegOpen, setMapsDegOpen ] = React.useState(false)
	const [ degList, setDegList ] = React.useState(null)
	const [ intTest, setIntTestList ] = React.useState(null)
	//const designerRef = React.useRef(null)
	//const mapsDesignerRef = React.useRef(null)
	const context = React.useContext(UserContext)

	const signOut = (e) => {
		e.preventDefault()
		context.logout()
	}

	// const handleDegToggle = () => {
	// 	setDegOpen((prevOpen) => !prevOpen)
	// }
	// const handleMapDegToggle = () => {
	// 	setMapsDegOpen((prevOpen) => !prevOpen)
	// }
	// const handleDegClose = (event) => {
	// 	if (designerRef.current && designerRef.current.contains(event.target)) {
	// 		return
	// 	}
	// 	setDegOpen(false)
	// 	setMapsDegOpen(false)
	// }
	// function handleListKeyDown (event) {
	// 	if (event.key === 'Tab') {
	// 		event.preventDefault()
	// 		setDegOpen(false)
	// 	}
	// }

	const [ anchorEl, setAnchorEl ] = React.useState(null)
	const [ mobileMoreAnchorEl, setMobileMoreAnchorEl ] = React.useState(null)

	const isMenuOpen = Boolean(anchorEl)
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null)
	}

	const handleMenuClose = () => {
		setAnchorEl(null)
		handleMobileMenuClose()
	}

	const handleMobileMenuOpen = (event) => {
		setMobileMoreAnchorEl(event.currentTarget)
	}

	const menuId = 'primary-search-account-menu'
	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={menuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem onClick={handleMenuClose}>Profile</MenuItem>
			<MenuItem onClick={handleMenuClose}>My account</MenuItem>
		</Menu>
	)

	const mobileMenuId = 'primary-search-account-menu-mobile'
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			<MenuItem>
				<IconButton aria-label='show 4 new mails' color='inherit'>
					<Badge badgeContent={4} color='secondary'>
						<MailIcon />
					</Badge>
				</IconButton>
				<p>Messages</p>
			</MenuItem>
			<MenuItem>
				<IconButton aria-label='show 11 new notifications' color='inherit'>
					<Badge badgeContent={11} color='secondary'>
						<NotificationsIcon />
					</Badge>
				</IconButton>
				<p>Notifications</p>
			</MenuItem>
			<MenuItem onClick={handleProfileMenuOpen}>
				<IconButton
					aria-label='account of current user'
					aria-controls='primary-search-account-menu'
					aria-haspopup='true'
					color='inherit'
				>
					<AccountCircle />
				</IconButton>
				<p>Profile</p>
			</MenuItem>
		</Menu>
	)

	return (
		<div className={classes.grow}>
			<AppBar position='fixed'>
				<Toolbar>
					{/* <IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="open drawer"
					>
						<MenuIcon />
					</IconButton> */}
					<Typography className={classes.title} variant='h6' noWrap>
						Miracle Integration Service
					</Typography>
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder='Search…'
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput
							}}
							inputProps={{ 'aria-label': 'search' }}
						/>
					</div>
					{context.user && (
						<div className={classes.navBar}>
							<ul className='mainMenu'>
								<li>
									<IconButton color='inherit' component={Link} to='/'>
										<HomeIcon className='mainMenuIcon' />
										<Typography className='mainMenuText' variant='button' color='inherit'>
											Home
										</Typography>
									</IconButton>
								</li>
								<li>
									<IconButton color='inherit' component={Link} to='/integrations/create'>
										<AddCircleOutlineIcon className='mainMenuIcon' />
										<Typography className='mainMenuText' variant='button' color='inherit'>
											Create
										</Typography>
									</IconButton>
								</li>
								<li>
									<IconButton color='inherit' component={Link} to='/integrations'>
										<BorderColorIcon className='mainMenuIcon' />
										<Typography className='mainMenuText' variant='button' color='inherit'>
											Modify
										</Typography>
									</IconButton>
								</li>
								<li>
									<IconButton color='inherit' component={Link} to='/serviceHub'>
										<LeakAddIcon className='mainMenuIcon' />
										<Typography className='mainMenuText' variant='button' color='inherit'>
											Service Hub
										</Typography>
									</IconButton>
								</li>
								<li>
									<a href='/' onClick={(e) => e.preventDefault()}>
										<MenuIcon className='mainMenuIcon' />
										<Typography className='mainMenuText' variant='button' color='inherit'>
											Designers
										</Typography>
									</a>
									{degList && (
										<ul className='subMenu'>
											<li>
												<a href='/' onClick={(e) => e.preventDefault()}>
													<Typography
														className='mainMenuText'
														variant='button'
														color='inherit'
													>
														Maps
													</Typography>
												</a>
												<ul className='SuperSubMenu'>
													{degList.map((item, ind) => {
														return (
															<React.Fragment key={ind}>
																{item.active && (
																	<a
																		href={item.url}
																		rel='noopener noreferrer'
																		target='_blank'
																	>
																		<Typography
																			className='mainMenuText'
																			variant='button'
																			color='inherit'
																		>
																			{item.name}
																		</Typography>
																	</a>
																)}
																{!item.active && (
																	<a
																		href='/'
																		onClick={(e) => e.preventDefault()}
																		className='disabled'
																		disabled
																	>
																		<Typography
																			className='mainMenuText'
																			variant='body1'
																			color='textSecondary'
																		>
																			{item.name}
																		</Typography>
																	</a>
																)}
															</React.Fragment>
														)
													})}
												</ul>
											</li>
											<li>
												<a href='/templates'>
													<Typography
														className='mainMenuText'
														variant='button'
														color='inherit'
													>
														Templates
													</Typography>
												</a>
											</li>
											{intTest &&
											intTest.length > 0 && (
												<li>
													<a
														href={intTest[0].url.replace('/integration', '')}
														target='noopener noreferrer'
													>
														<Typography
															className='mainMenuText'
															variant='button'
															color='inherit'
														>
															Test Case Designer
														</Typography>
													</a>
												</li>
											)}
										</ul>
									)}
								</li>
								<li>
									<a href='/' onClick={(e) => e.preventDefault()}>
										<SettingsIcon className='mainMenuIcon' />
										<Typography className='mainMenuText' variant='button' color='inherit'>
											Administration
										</Typography>
									</a>
									<ul className='subMenu'>
										<li>
											<a href='/admin/configuration'>
												<Typography className='mainMenuText' variant='button' color='inherit'>
													Configuration
												</Typography>
											</a>
										</li>
										<li>
											<a href='/admin/masters'>
												<Typography className='mainMenuText' variant='button' color='inherit'>
													Masters
												</Typography>
											</a>
										</li>
										<li>
											<a href='/admin/defaults'>
												<Typography className='mainMenuText' variant='button' color='inherit'>
													Defaults
												</Typography>
											</a>
										</li>
										<li>
											<a href='/admin/applications'>
												<Typography className='mainMenuText' variant='button' color='inherit'>
													Application Config
												</Typography>
											</a>
										</li>
										<li>
											<a href='/admin/services'>
												<Typography className='mainMenuText' variant='button' color='inherit'>
													Services
												</Typography>
											</a>
										</li>
										<li>
											<a href='/admin/palettes'>
												<Typography className='mainMenuText' variant='button' color='inherit'>
													Palettes
												</Typography>
											</a>
										</li>
										<li>
											<a href='/admin/mapsRoutes'>
												<Typography className='mainMenuText' variant='button' color='inherit'>
													Maps & Routes
												</Typography>
											</a>
										</li>
									</ul>
								</li>
								{/* <li>
									<IconButton color='inherit' component={Link} to='/admin'>
										<SettingsIcon className='mainMenuIcon' />
										<Typography className='mainMenuText' variant='button' color='inherit'>
											Administration
										</Typography>
									</IconButton>
								</li> */}
								<li>
									<IconButton color='inherit' component={Link} to='/contact'>
										<AlternateEmailIcon className='mainMenuIcon' />
										<Typography className='mainMenuText' variant='button' color='inherit'>
											Contact Us
										</Typography>
									</IconButton>
								</li>
							</ul>
						</div>
					)}
					{/* <div className={classes.navBar} style={{ display: 'none' }}>
						<IconButton color='inherit' component={Link} to='/'>
							<HomeIcon className={classes.icon} />
							<Typography className={classes.iconText} variant='button' color='inherit'>
								Home
							</Typography>
						</IconButton>
						<IconButton color='inherit' component={Link} to='/integrations/create'>
							<AddCircleOutlineIcon className={classes.icon} />
							<Typography className={classes.iconText} variant='button' color='inherit'>
								Create
							</Typography>
						</IconButton>
						<IconButton color='inherit' component={Link} to='/integrations'>
							<BorderColorIcon className={classes.icon} />
							<Typography className={classes.iconText} variant='button' color='inherit'>
								Modify
							</Typography>
						</IconButton>
						<IconButton color='inherit' ref={designerRef} onClick={handleDegToggle}>
							<MenuIcon className={classes.icon} />
							<Typography className={classes.iconText} variant='button' color='inherit'>
								Designers
							</Typography>
						</IconButton>
						<Popper open={degOpen} anchorEl={designerRef.current} role={undefined} transition disablePortal>
							{({ TransitionProps, placement }) => (
								<Grow
									{...TransitionProps}
									style={{
										transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
									}}
								>
									{degList && (
										<Paper
											style={{
												border: '1px solid #ccc',
												backgroundColor: '#fff',
												paddingX: 5
											}}
										>
											<ClickAwayListener onClickAway={handleDegClose}>
												<MenuList
													autoFocusItem={degOpen}
													id='menu-list-grow'
													onKeyDown={handleListKeyDown}
												>
													<NavLink ref={mapsDesignerRef} onClick={handleMapDegToggle}>
														<MenuItem>Maps</MenuItem>
													</NavLink>
													<NavLink href='/templates' onClick={handleDegClose}>
														<MenuItem>Templates</MenuItem>
													</NavLink>
												</MenuList>
											</ClickAwayListener>
										</Paper>
									)}
								</Grow>
							)}
						</Popper>
						<Popper
							open={mapsDegOpen}
							anchorEl={mapsDesignerRef.current}
							role={undefined}
							transition
							disablePortal
						>
							{({ TransitionProps, placement }) => (
								<Grow
									{...TransitionProps}
									style={{
										transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
									}}
								>
									{degList && (
										<Paper
											style={{
												border: '1px solid #ccc',
												backgroundColor: '#fff',
												paddingX: 5
											}}
										>
											<ClickAwayListener onClickAway={handleDegClose}>
												<MenuList
													autoFocusItem={degOpen}
													id='menu-list-grow'
													onKeyDown={handleListKeyDown}
												>
													{degList.map((item, ind) => {
														return (
															<React.Fragment>
																{item.active && (
																	<NavLink
																		key={ind}
																		onClick={handleDegClose}
																		href={item.url}
																		target='_blank'
																	>
																		<MenuItem>{item.name}</MenuItem>
																	</NavLink>
																)}
																{!item.active && (
																	<NavLink key={ind} className={classes.disabled}>
																		<MenuItem>{item.name}</MenuItem>
																	</NavLink>
																)}
															</React.Fragment>
														)
													})}
												</MenuList>
											</ClickAwayListener>
										</Paper>
									)}
								</Grow>
							)}
						</Popper>
						<IconButton color='inherit' component={Link} to='/admin'>
							<SettingsIcon className={classes.icon} />
							<Typography className={classes.iconText} variant='button' color='inherit'>
								Administration
							</Typography>
						</IconButton>
						<IconButton color='inherit' component={Link} to='/contact'>
							<AlternateEmailIcon className={classes.icon} />
							<Typography className={classes.iconText} variant='button' color='inherit'>
								Contact Us
							</Typography>
						</IconButton>
					</div> */}
					<div className={classes.grow} />
					{context.user && (
						<div className={classes.sectionDesktop}>
							<ul className='mainMenu'>
								<li>
									<a
										href='/'
										onClick={(e) => e.preventDefault()}
										style={{ marginRight: 0, width: 100, justifyContent: 'center' }}
									>
										{/* <AccountCircle className='mainMenuIcon' /> */}
										<DisplayLabel label={context.user.name} text={context.user.role} reverse />
										{/* <Typography className='mainMenuText' variant='button' color='inherit'>
													{context.user.name}
												</Typography> */}
									</a>
									<ul className='subMenu'>
										<li>
											<a href='/profile'>
												<Typography className='mainMenuText' variant='button' color='inherit'>
													Profile
												</Typography>
											</a>
										</li>
										<li>
											<a href='/' onClick={signOut}>
												<Typography className='mainMenuText' variant='button' color='inherit'>
													Sign out
												</Typography>
											</a>
										</li>
									</ul>
								</li>
							</ul>
						</div>
					)}

					<div className={classes.sectionMobile}>
						<IconButton
							aria-label='show more'
							aria-controls={mobileMenuId}
							aria-haspopup='true'
							onClick={handleMobileMenuOpen}
							color='inherit'
						>
							<MoreIcon />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
			{renderMobileMenu}
			{renderMenu}
			{!degList && (
				<ServiceHelper
					path='services'
					render={(services) => {
						return (
							<div>
								{services.payload && setDegList(services.payload.designer)}
								{services.payload && setIntTestList(services.payload.testing)}
							</div>
						)
					}}
				/>
			)}
		</div>
	)
}
