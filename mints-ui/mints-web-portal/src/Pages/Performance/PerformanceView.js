import React, { useState, useEffect } from 'react'

import db from '../../Helpers/DbHelper'
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core'
// import PerformanceChart from './PerformanceChart'
// import DropDown from '../../Controls/DropDown'
import RadioButtons from '../../Controls/RadioButtons'
// import RadioSelection from '../../Controls/RadioSelection'
import DisplayLabel from '../../Controls/DisplayLabel'

const filters = [ 'cluster', 'pattern', 'messageSize', 'podSize' ]
const fields = [ 'transmittedBw', 'networkBw', 'cpu', 'memory', 'duration', 'tps' ]

export default function PerformanceEntry (props) {
	const [ masters ] = useState({
		messageSize: [],
		loadSize: [],
		consumer: [],
		cluster: [],
		pattern: [],
		...props.masters
	})
	const [ records, setRecords ] = useState(null)
	const [ data, setData ] = useState(null)
	const [ filter, setFilter ] = useState({ cluster: 'Azure', pattern: 'Simple', messageSize: '1KB', podSize: 1 })
	const [ field, setField ] = useState('tps')
	const [ x ] = useState('consumer')
	const [ y ] = useState('loadSize')

	useEffect(() => {
		Promise.all([ db.getAllRecords() ])
			.then((results) => {
				setRecords(results[0])
				prepareData(masters, filterData(results[0]))
			})
			.catch((err) => {
				alert(err)
			})
		// eslint-disable-next-line
	}, [])

	const prepareData = (mats, recs) => {
		let obj = {}
		mats[y].forEach((l) => {
			obj[l.toString()] = {}
			mats[x].forEach((c) => {
				obj[l.toString()][c.toString()] = 0
			})
		})
		recs.forEach((r) => (obj[r[y].toString()][r[x].toString()] = r))
		setData(obj)
		// setTimeout(() => setData(obj), 100)
	}

	const filterData = (recs, flt = { ...filter }) => {
		return recs.filter(
			(x) =>
				x.cluster === flt.cluster &&
				x.pattern === flt.pattern &&
				x.messageSize === flt.messageSize &&
				x.podSize === flt.podSize
		)
	}

	const changeFilter = (key, value) => {
		setFilter({ ...filter, [key]: value })
		prepareData(masters, filterData(records, { ...filter, [key]: value }))
	}

	return (
		<div>
			{/* <Typography variant='h5'>Performance</Typography> */}
			<div style={{ display: 'flex', marginTop: 10, padding: 20 }}>
				<div style={{ flex: 2, paddingRight: 10 }}>
					<RadioButtons
						label='Compare'
						items={fields}
						value={field}
						onChange={(val) => setField(val)}
						startCase
					/>
					<br />
					<br />
					<DisplayLabel label='X axis' text={x} direction='row' startCase />
					<DisplayLabel label='Y axis' text={y} direction='row' startCase />
					<br />
					<br />
					<DisplayLabel
						label='Filters'
						text={
							<div>
								{filters.map((f) => {
									return (
										<RadioButtons
											key={f}
											label={f}
											items={masters[f]}
											value={filter[f]}
											onChange={(val) => changeFilter(f, val)}
										/>
									)
								})}
							</div>
						}
					/>
					{/* {fields.map((field) => {
						return <RadioButtons key={field} label={field} items={masters[field]} />
					})} */}
					{/* <DropDown label='X axis' items={[ '1', '2' ]} value={x} onChange={(val) => setX(val)} />
					<DropDown label='X axis' items={[ '1', '2' ]} value={y} onChange={(val) => setY(val)} /> */}
				</div>
				<div style={{ flex: 3, padding: 10 }}>
					<TableContainer>
						{/* {records && JSON.stringify(records)} */}
						<Table size='small'>
							{/* <TableHead>
								<TableRow>
									<TableCell> </TableCell>
									{masters[x].map((size, index) => (
										<TableCell align='right' key={index}>
											{size}
										</TableCell>
									))}
								</TableRow>
							</TableHead> */}
							<TableBody>
								{data &&
									masters[y].map((load) => (
										<TableRow key={load}>
											<TableCell component='th' scope='row'>
												<b>{load}</b>
											</TableCell>
											{data &&
												masters[x].map((size, index) => (
													<TableCell align='right' key={index}>
														{data[load.toString()][size.toString()][field]}
													</TableCell>
												))}
										</TableRow>
									))}
								<TableRow>
									<TableCell> </TableCell>
									{masters[x].map((size, index) => (
										<TableCell align='right' key={index}>
											<b>{size}</b>
										</TableCell>
									))}
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				</div>
				{/* <div style={{ flex: 2, padding: 10 }}>Graph</div> */}
			</div>
			{/* <PerformanceChart data={records} /> */}
		</div>
	)
}
