import React, { useState, useEffect } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import { Grid, Button } from '@material-ui/core'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import { InputBase } from '@material-ui/core/'
import TemplateButton from './TemplateButton'
import TargetItem from '../Template/TargetItem'

const Transition = React.forwardRef(function Transition (props, ref) {
	return <Slide direction='up' ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
	search: {
		display: 'block',
		//position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25)
		},
		width: '100%'
	},
	inputRoot: {
		color: 'inherit',
		border: '1px solid #999',
		borderRadius: 20,
		width: '100%',
		maxWidth: 350
	},
	inputInput: {
		textAlign: 'center',
		padding: 10,
		transition: theme.transitions.create('width'),
		width: '100%',
		maxWidth: 600
	}
}))

export default function SelectTemplateScreen (props) {
	const classes = useStyles()
	const [ category, setCategory ] = useState(null)
	const [ template, setTemplate ] = useState(null)
	const [ templateId, setTemplateId ] = useState(null)
	const [ items, setItems ] = useState([])
	const [ list, setList ] = useState([])
	const [ categories, setCategories ] = useState([])
	const [ search, setSearch ] = useState('')
	const [ open, setOpen ] = useState(false)

	const setSearchText = (e) => {
		if (e.target.value !== '') {
			setCategory('')
		}
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
						x.description.toLowerCase().includes(text)
				)
			)
		}
	}

	const selectCategory = (item) => {
		if (item !== '') {
			setCategory(item)
			setSearch('')
			setList([ ...items ].filter((i) => i.category === item))
		}
	}

	const selectTemplate = (item, moveNext = false) => {
		setTemplate(item)
		setTemplateId(item.id)
		props.handleSelection(item, moveNext)
	}
	const showTemplate = (item) => {
		if (props.handleSelection) {
			setOpen(item)
		} else {
			props.editTemplate(item, categories)
		}
	}
	const acceptTemplate = () => {
		selectTemplate({ ...open }, true)
		setOpen(false)
	}

	const hideTemplate = () => {
		setOpen(false)
	}

	useEffect(
		() => {
			if (props.templateId && !templateId) {
				setTemplateId(props.templateId)
			}
			if (props.items && props.items.length > 0 && items.length === 0) {
				let cats = []
				props.items.forEach((item) => {
					if (!cats.includes(item.category)) {
						cats.push(item.category)
					}
					if (props.templateId === item.id) {
						setCategory(item.category)
						setList([ ...props.items ].filter((i) => i.category === item.category))
						setTemplate(item)
						setTemplateId(item.id)
						props.handleSelection(item)
					}
				})
				setCategories(cats)
				setItems(props.items)
				if (props.openPopup) {
					setOpen(props.items[0])
				}

				if (!props.templateId) {
					setCategory(cats[0])
					setList([ ...props.items ].filter((i) => i.category === cats[0]))
				}
			}
		},
		[ props, templateId, items.length, props.templateId, props.items, props.openPopup ]
	)

	return (
		<React.Fragment>
			<Grid container spacing={4} alignContent='center'>
				<Grid item md={2} xs={12} className='intro-tmp-left'>
					{!props.handleSelection && (
						<div className='palette-group'>
							<Button
								fullWidth
								variant='text'
								color='default'
								onClick={(e) => props.editTemplate({}, categories)}
								size='small'
								style={{ textTransform: 'none' }}
							>
								New Template
							</Button>
						</div>
					)}

					<div className='palette-group'>
						<div className='palette-group-header color-light'>Categories</div>
						<div className='palette-group-content' style={{ display: 'flex', flexDirection: 'column' }}>
							{categories.map((cat, ind) => {
								return (
									<Button
										key={ind}
										variant={cat === category ? 'contained' : 'text'}
										color='default'
										size='small'
										style={{ textTransform: 'none' }}
										onClick={(e) => selectCategory(cat)}
									>
										{cat}
									</Button>
								)
							})}
						</div>
					</div>
				</Grid>
				<Grid
					item
					container
					md={10}
					xs={12}
					spacing={1}
					alignContent='flex-start'
					alignItems='center'
					className='intro-tmp-right'
				>
					<Grid item sm={6} xs={12}>
						<div className={classes.search}>
							<InputBase
								onChange={setSearchText}
								value={search}
								placeholder='Search template (id, name, description)'
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput
								}}
								inputProps={{ 'aria-label': 'search' }}
							/>
						</div>
					</Grid>
					<Grid item sm={6} xs={12}>
						{template && (
							<span style={{ color: '#999' }}>
								Selected Template: {template.name} ({templateId})
							</span>
						)}
					</Grid>

					{list.length > 0 && (
						<Grid item container md={12} sm={12} xs={12} spacing={2}>
							{list.map((tpl, ind) => {
								return (
									<Grid key={ind} item md={3} sm={6} xs={12}>
										<TemplateButton
											tpl={tpl}
											templateId={templateId}
											onClick={() => showTemplate(tpl)}
										/>
									</Grid>
								)
							})}
						</Grid>
					)}
				</Grid>
			</Grid>

			<Dialog
				open={open ? true : false}
				TransitionComponent={Transition}
				keepMounted
				className='intro-show-template-details'
				maxWidth='md'
				onClose={hideTemplate}
			>
				{open && (
					<React.Fragment>
						<DialogTitle>{open.name}</DialogTitle>
						<DialogContent>
							<DialogContentText component={'div'}>
								<div style={{ display: 'flex', flexDirection: 'row' }}>
									<div style={{ width: 500, padding: 10 }}>
										{open.palettes.map((node, ind) => {
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
									<div style={{ width: 400, padding: 10, textAlign: 'justify' }}>
										{open.description}
									</div>
								</div>
							</DialogContentText>
						</DialogContent>
					</React.Fragment>
				)}
				<DialogActions>
					<Button variant='contained' onClick={acceptTemplate} color='primary'>
						Select
					</Button>
					<Button variant='contained' onClick={hideTemplate} color='primary'>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	)
}
