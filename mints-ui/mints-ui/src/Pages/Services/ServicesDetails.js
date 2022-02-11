import React from 'react'
import { TableContainer, TableHead, TableCell, Table, TableBody, TableRow, Button } from '@material-ui/core'
//import SwitchControlReverse from '../../Controls/SwitchControlReverse'
import SwitchControl from '../../Controls/SwitchControl'
import SettingsIcon from '@material-ui/icons/Settings'

export default function ServiceDetails (props) {
	const items = Object.values(props.service).map((obj) => obj)
	const filteredItems = items.filter((obj, ind) => obj.type === props.data)

	const value = filteredItems.map((item) => item.type)
	const valueFiltered = value.filter((type, index) => value.indexOf(type) === index)

	const changeActive = (ind) => {
		let items = [ ...filteredItems ]
		if (items[ind].active) {
			props.uiRef.Confirm(
				'Are you sure to deactivate the service ?',
				() => {
					items[ind].active = false
					props.changeServicesActive(items)
				},
				() => {}
			)
		} else {
			items[ind].active = true
			props.changeServicesActive(items)
		}
	}
	// const changeDefault = (ind) => {
	// 	let items = [...filteredItems]
	// 	items.forEach((i) => (i.default = false))
	// 	items[ind].default = true
	// 	items[ind].active = true
	// 	props.changeServicesActive(items)
	// }

	return (
		<TableContainer>
			<Table size='small'>
				<TableHead>
					{
						<TableRow>
							<TableCell style={{ textTransform: 'capitalize' }}>{valueFiltered} Name</TableCell>
							<TableCell style={{ width: 100 }}>Configuration</TableCell>
							<TableCell style={{ width: 150 }}>Status</TableCell>
						</TableRow>
					}
				</TableHead>
				<TableBody>
					{filteredItems.map((item, index) => (
						<TableRow key={index}>
							<TableCell component='td' scope='row'>
								{item.name}
							</TableCell>

							<TableCell component='td' scope='row'>
								<Button
									variant='text'
									color='primary'
									style={{ padding: 0 }}
									onClick={() => props.showServiceEntries(item)}
								>
									<SettingsIcon />
								</Button>
							</TableCell>
							<TableCell component='td' scope='row'>
								<SwitchControl checked={item.active} onChange={() => changeActive(index)} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
