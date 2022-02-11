/* eslint no-eval: 0 */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
// import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'

import InfoIcon from '@material-ui/icons/Info'
import StarIcon from '@material-ui/icons/Star'
import { Grid } from '@material-ui/core'
import TargetItem from '../Template/TargetItem.js'

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
		padding: 0,
		margin: 0
	},
	inline: {
		display: 'inline',
		fontSize: 11
	}
}))

export default function Review (props) {
	const classes = useStyles()
	const { details, template } = props

	const getValueForType = (item) => {
		switch (item.type) {
			case 'password':
				return '********'
			case 'boolean':
				return item.value ? 'Yes' : 'No'
			case 'ObjectList':
				return JSON.stringify(JSON.parse(item.value ? item.value : '[]').map((x) => x.name))
					.replace('[', '')
					.replace(']', '')
					.replace(new RegExp('"', 'g'), ' ')
			default:
				return item.value.replace('{', '').replace('}', '').replace(new RegExp('"', 'g'), ' ')
		}
	}

	const getListItem = (label, text, icon, key) => {
		return (
			<ListItem key={key} alignItems='flex-start' style={{ margin: 0, padding: 0 }}>
				{/* <ListItemIcon>{icon}</ListItemIcon> */}
				<ListItemText
					primary={
						<React.Fragment>
							<Typography
								component='span'
								variant='body2'
								className={classes.inline}
								color='textSecondary'
							>
								{label}
							</Typography>
						</React.Fragment>
					}
					secondary={
						<div style={{ paddingLeft: 3, display: 'flex', flexDirection: 'column' }}>
							{text.split(',').map((t) => {
								return (
									<Typography
										component='span'
										variant='body1'
										className={classes.inline}
										color='textPrimary'
									>
										{t.trim()}
									</Typography>
								)
							})}
						</div>
					}
				/>
			</ListItem>
		)
	}
	const getListItemBlock = (label, text, icon, key) => {
		return (
			<List key={key} className={classes.root}>
				<ListItem alignItems='flex-start' style={{ margin: 0, padding: 0 }}>
					{/* <ListItemIcon>{icon}</ListItemIcon> */}
					<ListItemText
						primary={
							<React.Fragment>
								<Typography
									component='span'
									variant='body2'
									className={classes.inline}
									color='textSecondary'
								>
									{label}
								</Typography>
							</React.Fragment>
						}
						secondary={
							<React.Fragment>
								<Typography
									component='span'
									variant='body1'
									className={classes.inline}
									color='textPrimary'
								>
									{text}
								</Typography>
							</React.Fragment>
						}
					/>
				</ListItem>
			</List>
		)
	}

	const getPropKeyPair = () => {
		let list = []
		template.palettes.forEach((route) => {
			route.properties.forEach((prop) => {
				if (props.template.hideProps[prop.key] === undefined) {
					if (checkCondition(prop)) list.push({ label: prop.label, value: prop.value, type: prop.type })
				}
			})
		})
		//alert(JSON.stringify(list))
		return list
	}

	const checkCondition = (prop) => {
		let exists = false,
			matched = false
		if (prop.cKey && prop.cKey !== '') {
			//alert(prop.key)
			exists = true
			props.template.palettes.forEach((r) => {
				r.properties.forEach((p) => {
					if (p.key === prop.cKey) {
						//alert(p.value)
						if (p.value !== undefined && p.value !== null) {
							//alert(p.value + prop.cOpr + prop.cValue)
							// alert(typeof p.value)
							// alert(typeof p.value === 'string')
							if (typeof p.value === 'string') {
								matched = p.value === prop.cValue ? true : false
							} else {
								matched = eval(p.value + prop.cOpr + prop.cValue)
							}
						}
					}
				})
			})
		}
		return !exists || (exists && matched)
	}

	return (
		<Grid container spacing={1}>
			<Grid item md={3} xs={12}>
				<div className='palette-group' style={{ minHeight: 320 }}>
					<div className='palette-group-header color-light'>Integration Details</div>
					<div className='palette-group-content'>
						<Grid container spacing={0}>
							<Grid item sm={6} xs={12}>
								{getListItemBlock('ID', details.id ? details.id : '[new]', <StarIcon />)}
							</Grid>
							<Grid item sm={6} xs={12}>
								{getListItemBlock('Name', details.name, <StarIcon />)}
							</Grid>
							<Grid item xs={12} style={{ maxHeight: 75, overflow: 'hidden' }}>
								{getListItemBlock('Description', details.description, <StarIcon />)}
							</Grid>
							<Grid item sm={6} xs={12}>
								{getListItemBlock('Source', details.source, <StarIcon />)}
							</Grid>
							<Grid item sm={6} xs={12}>
								{getListItemBlock('Destination', details.target, <StarIcon />)}
							</Grid>
							<Grid item xs={12} style={{ maxHeight: 75, overflow: 'hidden' }}>
								{getListItemBlock(
									'Keys',
									details.keys
										? JSON.stringify(details.keys)
												.replace('{', '')
												.replace('}', '')
												.replace(new RegExp('"', 'g'), ' ')
										: '',
									<StarIcon />
								)}
							</Grid>
							{/* <Grid item sm={6} xs={12}>
								{getListItemBlock('Country', details.country, <StarIcon />)}
							</Grid>
							<Grid item sm={6} xs={12}>
								{getListItemBlock('Instance', details.instance, <StarIcon />)}
							</Grid> */}
							<Grid item sm={4} xs={12}>
								{getListItemBlock('Min Volume', details.minVolume, <StarIcon />)}
							</Grid>
							<Grid item sm={4} xs={12}>
								{getListItemBlock('Avg Volume', details.avgVolume, <StarIcon />)}
							</Grid>
							<Grid item sm={4} xs={12}>
								{getListItemBlock('Max Volume', details.maxVolume, <StarIcon />)}
							</Grid>
						</Grid>
					</div>
				</div>
			</Grid>
			<Grid item md={5} xs={12}>
				<div className='palette-group' style={{ minHeight: 320 }}>
					<div className='palette-group-header color-light'>Template</div>
					<div className='palette-group-content'>
						<div>
							{template.palettes.map((node, ind) => {
								return (
									<TargetItem
										key={ind}
										index={ind}
										id={ind}
										// markNodes={this.markNodes}
										// processMove={this.processMove}
										node={node}
										// removeNode={() => removeNode(ind)}
									/>
								)
							})}
						</div>
						<div style={{ width: '100%', padding: 20, textAlign: 'justify' }}>{template.description}</div>
					</div>
				</div>
			</Grid>
			<Grid item md={4} xs={12}>
				<div className='palette-group' style={{ minHeight: 320 }}>
					<div className='palette-group-header color-light'>Route Properties</div>
					<div className='palette-group-content'>
						<Grid container>
							{getPropKeyPair().map((item, index) => {
								return (
									<Grid item md={6} xs={12}>
										<List className={classes.root}>
											{getListItem(item.label, getValueForType(item), <InfoIcon />, index)}
										</List>
									</Grid>
								)
							})}
						</Grid>
					</div>
				</div>
			</Grid>
		</Grid>
	)
}
