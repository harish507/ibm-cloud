import React, { useState } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
// import ListItemIcon from '@material-ui/core/ListItemIcon'
import { Typography, InputBase, Button, Tooltip } from '@material-ui/core/'
import { Link } from 'react-router-dom'
import ServiceHelper from '../../Helpers/ServiceHelper'

// import StarIcon from '@material-ui/icons/Star'
import { Grid } from '@material-ui/core'
import UIHelper from '../../Helpers/UIHelper'

import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import EditIcon from '@material-ui/icons/Edit'

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper
	},
	button: {
		margin: 0,
		height: 80,
		// border: '1px solid',
		border: '1px solid ' + theme.palette.primary.main,
		borderLeft: '5px solid ' + theme.palette.primary.main,
		// borderColor: theme.secondary,
		borderRadius: 10,
		backgroundColor: '#fff',
		'&:hover': {
			//borderLeft: '2px solid',
			boxShadow: '5px 5px #aaa'
		}
	},
	inline: {
		display: 'inline'
	},
	search: {
		display: 'block',
		//position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25)
		},
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto'
		}
	},
	inputRoot: {
		color: 'inherit',
		border: '1px solid #999',
		borderRadius: 20,
		width: '100%',
		maxWidth: 600
	},
	inputInput: {
		textAlign: 'center',
		padding: 10,
		transition: theme.transitions.create('width'),
		width: '100%',
		maxWidth: 600
	},
	icon: {
		padding: 0,
		margin: 0
	}
}))

export default function SelectIntegration (props) {
	const [ items, setItems ] = useState(null)
	const [ search, setSearch ] = useState('')
	const [ list, setList ] = useState(null)

	const classes = useStyles()
	const uiRef = React.useRef()

	const setPayload = (payload) => {
		if (payload) {
			setItems([ ...payload ])
			setList([ ...payload ])
		}
	}

	const setSearchText = (e) => {
		setSearch(e.target.value)
		filterItems(e.target.value)
	}

	const filterItems = (text) => {
		if (text === '') {
			setList([ ...items ])
		} else {
			text = text.toLowerCase()
			setList(
				[ ...items ].filter(
					(x) =>
						x.id.toLowerCase().includes(text) || // === text
						x.name.toLowerCase().includes(text) ||
						x.source.toLowerCase().includes(text) ||
						x.target.toLowerCase().includes(text) ||
						x.description.toLowerCase().includes(text) ||
						x.template.id.toLowerCase().includes(text) || // === text
						x.template.name.toLowerCase().includes(text)
				)
			)
		}
	}

	const trimText = (text, size) => {
		if (text.length > size) {
			text = text.substring(0, size - 3) + '...'
		}
		return text
	}

	const getListItem = (id, label, text, apps, details) => {
		return (
			<div className='select-item'>
				<List style={{ padding: 0, margin: 0 }}>
					<ListItem component={Link} to={'/integrations/' + id} className={classes.button}>
						{/* <ListItemIcon>
						<StarIcon style={{ fontSize: 25, padding: 3 }} />
					</ListItemIcon> */}
						<ListItemText
							primary={
								<React.Fragment>
									<Typography
										component='span'
										variant='body1'
										className={classes.inline}
										color='textPrimary'
									>
										{label} [{id}]
									</Typography>
								</React.Fragment>
							}
							secondary={
								<React.Fragment>
									<Typography
										component='span'
										variant='body2'
										className={classes.inline}
										color='textSecondary'
									>
										{trimText(text, 50)}
									</Typography>
									<br />
									<Typography
										component='span'
										variant='body2'
										className={classes.inline}
										color='textSecondary'
									>
										{apps}
									</Typography>
									<br />
									<Typography
										component='span'
										variant='body2'
										className={classes.inline}
										color='textSecondary'
									>
										{trimText(details, 50)}
									</Typography>
								</React.Fragment>
							}
						/>
					</ListItem>
				</List>
				<div className='hover-icons'>
					<Tooltip title='Edit' placement='top'>
						<Button className={classes.icon} color='default' component={Link} to={'/integrations/' + id}>
							<EditIcon />
						</Button>
					</Tooltip>
					<Tooltip title='Test' placement='bottom'>
						<Button className={classes.icon} color='default' component={Link} to={'/test/' + id}>
							<VerifiedUserIcon />
						</Button>
					</Tooltip>
				</div>
			</div>
		)
	}

	return (
		<div className='content'>
			<UIHelper ref={uiRef} />

			{!items && (
				<ServiceHelper
					path='integrations'
					render={(data) => {
						return (
							<React.Fragment>
								{uiRef.current && uiRef.current.Loading(data.loading)}
								{data.error && <error>Error processing request</error>}
								{data.error && uiRef.current.Error(data.error)}
								{data.payload && setPayload(data.payload)}
							</React.Fragment>
						)
					}}
				/>
			)}

			{list && (
				<Grid container spacing={4}>
					<Grid item md={12} sm={12} xs={12} style={{ textAlign: 'center' }}>
						<div className={classes.search}>
							<InputBase
								onChange={setSearchText}
								value={search}
								placeholder='Search by integration / template (id, name, description)'
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput
								}}
								inputProps={{ 'aria-label': 'search' }}
							/>
						</div>
					</Grid>

					{list.map((ign) => {
						return (
							<Grid item key={ign.id} sm={4} xs={12}>
								{getListItem(
									ign.id,
									ign.name,
									ign.description,
									ign.source + ' -> ' + ign.target,
									ign.template.name
								)}
							</Grid>
						)
					})}
				</Grid>
			)}
		</div>
	)
}
