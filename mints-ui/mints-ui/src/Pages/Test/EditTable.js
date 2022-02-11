import React, { useState, useEffect } from 'react'
import { Table, TableRow, TableCell, TableBody, Button } from '@material-ui/core'
import _ from 'lodash'
import DeleteIcon from '@material-ui/icons/Delete'
import AddCircleIcon from '@material-ui/icons/AddCircle'

export default function EditTable (props) {
	const [ items, setItems ] = useState([])
	const [ input, setInput ] = useState([])
	///const [ inputFiles, setInputFiles ] = useState([])

	useEffect(
		() => {
			if (items.length > 0) return
			if (props.headers && props.headers.split('|').length > 1) {
				const cols = []
				cols.push(props.headers.split('|').filter((x) => x.trim() !== '').map((x) => x.trim()))
				setItems(cols)
				resetInput(cols[0].length)
				props.update(cols)
			}
		},
		[ props, items ]
	)

	const addItem = (e) => {
		let files = []
		if (input.filter((i) => i !== null).length > 0) {
			input.forEach((inp, ind) => {
				if (typeof inp === 'object') {
					files.push(inp)
					input[ind] = '@' + inp.name
				}
			})
			//alert(files.length)
			props.addFiles(files)
			let newItems = [ ...items, [ ...input ] ]
			setItems(newItems)
			props.update(newItems)
			resetInput(input.length)
		}
	}
	const removeItem = (i) => {
		let newItems = items.filter((item, ind) => ind !== i)
		setItems(newItems)
		props.update(newItems)
	}
	const resetInput = (size) => {
		let newInput = new Array(size)
		setInput(null)
		setTimeout(() => {
			setInput(newInput)
		}, 10)
	}
	const changeInput = (ind, val) => {
		let newInput = [ ...input ]
		newInput[ind] = val
		setInput(newInput)
	}

	return (
		<Table size='small'>
			{items.length > 0 && (
				<TableBody>
					{/* <TableRow>{items.map((key, ind) => <TableCell key={ind}>{_.startCase(key)}</TableCell>)}</TableRow> */}
					{items.map((item, ind) => {
						return (
							<React.Fragment key={ind}>
								{ind === 0 && (
									<TableRow>
										{item.map((key, i) => <TableCell key={i}>{_.startCase(key)}</TableCell>)}
										<TableCell width={50}>Action</TableCell>
									</TableRow>
								)}
								{items.length === 1 && (
									<TableRow>
										<TableCell colSpan={items[0].length} style={{ textAlign: 'center' }}>
											No example data
										</TableCell>
									</TableRow>
								)}
								{ind > 0 && (
									<TableRow>
										{item.map((key, i) => <TableCell key={i}>{key}</TableCell>)}
										<TableCell width={50}>
											<Button variant='text' color='default' onClick={(e) => removeItem(ind)}>
												<DeleteIcon />
											</Button>
										</TableCell>
									</TableRow>
								)}
							</React.Fragment>
						)
					})}
					{input && (
						<TableRow>
							{items[0].map((key, i) => (
								<TableCell key={i}>
									{!_.startsWith(key, '@') && (
										<input
											placeholder={_.startCase(key)}
											value={input[i]}
											onChange={(e) => changeInput(i, e.target.value)}
										/>
									)}
									{_.startsWith(key, '@') && (
										<input
											type='file'
											placeholder={_.startCase(key)}
											// value={input[i]}
											onChange={(e) =>
												changeInput(i, e.target.files.length > 0 ? e.target.files[0] : '')}
										/>
									)}
									{/* <TextBox
										noBorder
										multiline
										label={_.startCase(key)}
										placeholder={_.startCase(key)}
										value={input[i]}
										onChange={(e) => changeInput(i, e.target.value)}
									/> */}
								</TableCell>
							))}
							<TableCell width={50}>
								<Button variant='text' color='default' onClick={addItem}>
									<AddCircleIcon />
								</Button>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			)}
			{/* <TableBody>
				<TableRow>
					<TableCell>{input.length}</TableCell>
				</TableRow>
			</TableBody> */}
		</Table>
	)
}
