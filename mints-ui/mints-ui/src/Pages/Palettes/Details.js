import React from 'react'
import {
	TableContainer,
	TableHead,
	TableCell,
	Table,
	TableBody,
	TableRow,
	Button,
	Fab,
	Tooltip,
	Typography
} from '@material-ui/core'
import _ from 'lodash'
import CreateIcon from '@material-ui/icons/Create'
import ReplayIcon from '@material-ui/icons/Replay'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
import { Grid } from '@material-ui/core'
import TextBox from '../../Controls/TextBox'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SwitchControl from '../../Controls/SwitchControl'
import FaIcon from '../Template/FaIcon'
import FieldSet from '../../Controls/FieldSet'
import DropDown from '../../Controls/DropDown'

const paletteTypes = [ 'inlet', 'outlet', 'trans', 'orch', 'enrich' ]
const newProp = {
	label: '',
	key: '',
	type: 'text',
	default: false,
	optional: false,
	source: ''
}

export default function Details (props) {
	const editProp = (item, ind) => {
		props.showEntry({ item: { ...item }, ind })
	}

	const { palette } = props

	return (
		<Grid container spacing={1} alignContent='flex-start' alignItems='center'>
			<Grid item xs={12} sm={9} />
			<Grid item xs={12} sm={3} style={{ textAlign: 'center' }}>
				<Tooltip title='Reset details'>
					<Fab variant='extended' color='primary' onClick={props.resetPalette}>
						<ReplayIcon />
					</Fab>
				</Tooltip>
				<Tooltip title='Save palette'>
					<Fab variant='extended' color='primary' onClick={props.updatePalette}>
						<SaveIcon />
					</Fab>
				</Tooltip>
				<Tooltip title='Delete palette'>
					<Fab
						variant='extended'
						color='secondary'
						onClick={props.deletePalette}
						disabled={palette._id ? false : true}
					>
						<DeleteIcon />
					</Fab>
				</Tooltip>
			</Grid>
			<Grid item sm={3} xs={12}>
				<TextBox
					label='Name'
					autoFocus={true}
					value={palette.name}
					onChange={(e) => props.handleChange('name', e.target.value)}
				/>
			</Grid>
			<Grid item sm={3} xs={12}>
				<DropDown
					new
					label='Group'
					value={palette.group}
					items={props.groups ? props.groups : []}
					onChange={(val) => props.handleChange('group', val)}
				/>
			</Grid>
			<Grid item sm={3} xs={12}>
				<DropDown
					label='Style'
					value={palette.type}
					items={paletteTypes}
					onChange={(val) => props.handleChange('type', val)}
				/>
			</Grid>
			<Grid item sm={3} xs={12}>
				<FieldSet label='Icon'>
					<Button onClick={(e) => props.showIcons(palette.icon)} variant='text' style={{ padding: 0 }}>
						<FaIcon icon={palette.icon} size='2x' />
						<Typography style={{ paddingLeft: 20, textTransform: 'none' }}>Choose your icon</Typography>
					</Button>
				</FieldSet>
			</Grid>
			<Grid item xs={12} label='Properties'>
				<TableContainer>
					<Table size='small' aria-label='a dense table'>
						<TableHead>
							<TableRow>
								<TableCell>Label</TableCell>
								<TableCell>Key</TableCell>
								<TableCell>Type</TableCell>
								<TableCell>Default</TableCell>
								<TableCell>Optional</TableCell>
								<TableCell>Source</TableCell>
								<TableCell>Condition</TableCell>

								{/* <TableCell>Value</TableCell> */}
								<TableCell align='right'>
									<Tooltip title='Add Property'>
										<Button
											size='small'
											variant='text'
											color='primary'
											onClick={() => editProp(newProp, palette.properties.length)}
										>
											<AddCircleIcon />
										</Button>
									</Tooltip>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{palette.properties.map((p, index) => (
								<TableRow key={index}>
									<TableCell> {p.label} </TableCell>
									<TableCell> {p.key} </TableCell>
									<TableCell>{p.type} </TableCell>
									<TableCell>
										<SwitchControl checked={p.default ? true : false} />
									</TableCell>
									<TableCell>
										<SwitchControl checked={p.optional ? true : false} />
									</TableCell>
									<TableCell> {_.startCase(p.source)} </TableCell>
									<TableCell> {p.cKey ? p.cKey + ' ' + p.cOpr + ' ' + p.cValue : ''}</TableCell>

									{/* <TableCell> {p.value} </TableCell> */}
									<TableCell align='right'>
										<Tooltip title='Edit Property'>
											<Button
												size='small'
												variant='text'
												color='primary'
												onClick={() => editProp(p, index)}
											>
												<CreateIcon />
											</Button>
										</Tooltip>
										<Tooltip title='Delete Property'>
											<Button
												size='small'
												variant='text'
												color='primary'
												onClick={() => props.deleteProp(index)}
											>
												<DeleteIcon />
											</Button>
										</Tooltip>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</Grid>
	)
}
