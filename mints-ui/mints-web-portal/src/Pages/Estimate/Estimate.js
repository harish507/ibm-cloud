import React, { useState, useEffect } from 'react'
import { Typography, Grid, Tooltip } from '@material-ui/core'
import { Table, TableHead, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core'
// import _ from 'lodash'
import FieldSet from '../../Controls/FieldSet'
import Button from '../../Controls/Button'
import TextBox from '../../Controls/TextBox'
// import DisplayLabel from '../../Controls/DisplayLabel'
import RadioButtons from '../../Controls/RadioButtons'
import DropDown from '../../Controls/DropDown'
import FaIcon from '../../Controls/FaIcon'
import db from '../../Helpers/DbHelper'
// import Report from './Report'

const messageSizes = { '1KB': 1, '10KB': 10, '100KB': 100, '500KB': 500, '1MB': 1000, '10MB': 10000 }
const volumes = { '100K': 100, '200K': 100, '500K': 500, '1M': 1000, '2M': 2000, '5M': 5000 }
const patterns = { simple: 1, medium: 3, complex: 5 }
const protocols = { AMQ: 1, WMQ: 1, Kafka: 1, REST: 2, FTP: 2 }
const initLoad = { pattern: 'simple', protocol: 'AMQ', volume: '100K', size: '1KB', count: 10 }

const metrics = [
	{
		volume: 1,
		minTps: 0,
		maxTps: 100,
		consumers: 20,
		pods: 1,
		nodes: 1,
		othNodes: 1,
		cpu: 2,
		memory: 8,
		storage: 500
	},
	{
		volume: 1,
		minTps: 100,
		maxTps: 500,
		consumers: 30,
		pods: 1,
		nodes: 1,
		othNodes: 1,
		cpu: 2,
		memory: 8,
		storage: 500
	},
	{
		volume: 1,
		minTps: 500,
		maxTps: 1000,
		consumers: 40,
		pods: 1,
		nodes: 1,
		othNodes: 1,
		cpu: 2,
		memory: 8,
		storage: 500
	},
	{
		volume: 1,
		minTps: 1000,
		maxTps: 1500,
		consumers: 50,
		pods: 1,
		nodes: 1,
		othNodes: 1,
		cpu: 2,
		memory: 8,
		storage: 1000
	},
	{
		volume: 1,
		minTps: 1000,
		maxTps: 1500,
		consumers: 60,
		pods: 1,
		nodes: 1,
		othNodes: 1,
		cpu: 2,
		memory: 8,
		storage: 500
	}
]

export default function Home () {
	const [ masters, setMasters ] = useState(null)
	const [ report, setReport ] = useState(null)
	const [ input, setInput ] = useState({ cluster: 'Azure', tps: 500, avgVolume: '100K', load: [] })
	const [ load, setLoad ] = useState({ ...initLoad })
	const [ loads, setLoads ] = useState([])

	useEffect(() => {
		db
			.getMasters()
			.then((masters) => {
				setMasters(masters)
			})
			.catch((err) => {
				alert(err)
			})
		setLoads([])
	}, [])

	const changeInput = (key, value) => {
		setInput({ ...input, [key]: value })
	}
	// const changePattern = (key, value) => {
	// 	let pats = { ...input.patterns }
	// 	pats[key].size = value
	// 	setInput({ ...input, patterns: pats })
	// }

	const addLoad = () => {
		let exist = false
		let newLoads = [ ...loads ]
		loads.forEach((l, i) => {
			if (l.pattern === load.pattern && l.protocol === load.protocol && l.size === load.size) {
				newLoads[i].count = load.count
				exist = true
			}
		})
		if (!exist) newLoads.push(load)
		setLoads([ ...newLoads ])
	}
	const removeLoad = (ind) => {
		setLoads(loads.filter((l, i) => i !== ind))
	}

	const getReport = () => {
		input.avgVolume = 0
		loads.forEach((l, i) => {
			//input.avgVolume += patterns[l.pattern] * protocols[l.protocol] * messageSizes[l.size] * l.count
			input.avgVolume += volumes[l.volume]
		})
		let y = 1,
			z = 1,
			a = 1,
			b = 1
		let rpt = metrics[4]
		if (input.tps <= 1500) {
			rpt = metrics.filter((x) => x.maxTps >= input.tps && x.minTps <= input.tps)[0]
			if (!rpt) rpt = metrics[4]
		} else {
			//y = volumes[input.avgVolume]
			y = Math.ceil(input.avgVolume / 1000)
			a = y >= 2 ? 2 : 1
			z = Math.round(input.tps / 1500)
			b = y
			rpt = {
				...rpt,
				pods: a,
				nodes: a + z,
				cpu: (b + z) * 2,
				memory: (b + z) * 8,
				storage: (b + z) * rpt.storage
			}
		}
		setReport(rpt)

		// db
		// 	.getReport({ ...input })
		// 	.then((result) => {
		// 		//alert(JSON.stringify(result, null, 4))
		// 		let obj = {}
		// 		masters.consumer.forEach((c) => (obj[c] = false))
		// 		result.forEach((r) => (obj[r.consumer] = { ...r, nodeSize: 1 }))
		// 		setReport(obj)
		// 		// setTimeout(() => setReport(obj), 10)
		// 	})
		// 	.catch((err) => {
		// 		alert(err)
		// 	})
	}

	return (
		<div className='content'>
			<Typography variant='h5'>Infra Estimate</Typography>
			<div style={{ paddingTop: 20 }}>
				{masters && (
					<Grid container spacing={2}>
						<Grid item md={6}>
							<RadioButtons
								label='Cloud'
								items={masters.cluster}
								value={input.cluster}
								onChange={(val) => changeInput('cluster', val)}
								startCase
							/>
							{/* <RadioButtons
								label='Average File Size'
								items={messageSizes}
								value={input.avgSize}
								onChange={(val) => changeInput('avgSize', val)}
								startCase
							/> */}
							{/* <RadioButtons
								label='Average Volume'
								items={[ '100K', '200K', '500K', '1M', '2M', '5M' ]}
								value={input.avgVolume}
								onChange={(val) => changeInput('avgVolume', val)}
								startCase
							/> */}
							<FieldSet label='Load:' noBorder>
								{/* {Object.keys(patterns).map((pattern, i) => {
									return (
										<TextBox
											key={i}
											label={_.startCase(pattern)}
											value={input.patterns[pattern].size}
											style={{ width: 100 }}
											onChange={(e) => changePattern(pattern, e.target.value)}
										/>
									)
								})} */}
								<TableContainer>
									{/* {records && JSON.stringify(records)} */}
									<Table size='small'>
										<TableHead>
											<TableRow style={{ backgroundColor: '#ddd' }}>
												<TableCell>Pattern</TableCell>
												<TableCell> Protocol</TableCell>
												<TableCell> Msg Size</TableCell>
												<TableCell> Msg Volume</TableCell>
												<TableCell> Pattern Count</TableCell>
												<TableCell style={{ width: 30 }}> </TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{(!loads || loads.length === 0) && (
												<TableRow>
													<TableCell colSpan={5} style={{ textAlign: 'center' }}>
														<b>No load added</b>
													</TableCell>
												</TableRow>
											)}
											{loads &&
												loads.map((r, i) => (
													<TableRow key={i}>
														<TableCell component='th' scope='row'>
															<b>{r.pattern}</b>
														</TableCell>
														<TableCell component='th' scope='row'>
															<b>{r.protocol}</b>
														</TableCell>
														<TableCell component='th' scope='row'>
															<b>{r.size}</b>
														</TableCell>
														<TableCell component='th' scope='row'>
															<b>{r.volume}</b>
														</TableCell>
														<TableCell component='th' scope='row'>
															<b>{r.count}</b>
														</TableCell>
														<TableCell style={{ width: 30 }}>
															<Button
																variant='text'
																color='default'
																style={{ minWidth: 30, maxWidth: 30 }}
																label={<FaIcon icon='faTrash' size='2x' />}
																onClick={() => removeLoad(i)}
															/>
														</TableCell>
													</TableRow>
												))}
											<TableRow style={{ backgroundColor: '#ddd' }}>
												<TableCell>
													<DropDown
														items={Object.keys(patterns)}
														value={load.pattern}
														onChange={(val) => setLoad({ ...load, pattern: val })}
													/>
												</TableCell>
												<TableCell>
													<DropDown
														items={Object.keys(protocols)}
														value={load.protocol}
														onChange={(val) => setLoad({ ...load, protocol: val })}
													/>
												</TableCell>
												<TableCell>
													<DropDown
														items={Object.keys(messageSizes)}
														value={load.size}
														onChange={(val) => setLoad({ ...load, size: val })}
													/>
												</TableCell>
												<TableCell>
													<DropDown
														items={Object.keys(volumes)}
														value={load.volume}
														onChange={(val) => setLoad({ ...load, volume: val })}
													/>
												</TableCell>
												<TableCell>
													<TextBox
														label=' '
														value={load.count}
														style={{ width: 50 }}
														onChange={(e) => setLoad({ ...load, count: e.target.value })}
													/>
												</TableCell>
												<TableCell style={{ width: 30 }}>
													<Button
														variant='text'
														color='default'
														style={{ minWidth: 30, maxWidth: 30 }}
														label={<FaIcon icon='faPlus' size='2x' />}
														onClick={addLoad}
														disabled={load.count === '' || isNaN(parseInt(load.count, 10))}
													/>
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
							</FieldSet>

							<TextBox
								label='Expected TPS'
								value={input.tps}
								style={{ width: 250 }}
								onChange={(e) => changeInput('tps', parseInt(e.target.value))}
							/>
							<br />
							<br />
							<Button
								label='Go'
								//disabled={loads.length === 0 || input.tps === '' || isNaN(parseInt(input.tps, 500))}
								onClick={getReport}
							/>
						</Grid>
						<Grid item md={1} />
						{report && (
							<Grid item md={3}>
								<Typography variant='h5'>Cluster Spec</Typography>
								<br />
								<br />
								<Grid container>
									<Grid item md={9}>
										<Tooltip title='Primary Nodes include Framework, Trans etc.'>
											<Typography variant='body1'>
												Primary Services &nbsp;&nbsp;<FaIcon icon='faInfoCircle' size='1x' />
											</Typography>
										</Tooltip>
									</Grid>
									<Grid item md={3}>
										<Typography variant='body1'>{report.nodes} Nodes</Typography>
									</Grid>
								</Grid>
								<FieldSet noBorder>
									<TableContainer>
										<Table size='small'>
											<TableHead>
												<TableRow style={{ backgroundColor: '#ddd' }}>
													<TableCell>CPU</TableCell>
													<TableCell> Memory</TableCell>
													<TableCell> Storage</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												<TableRow>
													<TableCell>{report.cpu + ' Cores'}</TableCell>
													<TableCell>{report.memory + ' GB'}</TableCell>
													<TableCell>
														{report.storage >= 1000 ? (
															report.storage / 1000 + ' TB'
														) : (
															report.storage + ' GB'
														)}
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
								</FieldSet>
								<br />
								<br />
								<Grid container>
									<Grid item md={9}>
										<Tooltip title='Secondary Nodes include UI, Backend Services etc.'>
											<Typography variant='body1'>
												Secondary Services &nbsp;&nbsp;<FaIcon icon='faInfoCircle' size='1x' />
											</Typography>
										</Tooltip>
									</Grid>
									<Grid item md={3}>
										<Typography variant='body1'>{report.othNodes} Nodes</Typography>
									</Grid>
								</Grid>
								<FieldSet noBorder>
									<TableContainer>
										<Table size='small'>
											<TableHead>
												<TableRow style={{ backgroundColor: '#ddd' }}>
													<TableCell>CPU</TableCell>
													<TableCell> Memory</TableCell>
													<TableCell> Storage</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												<TableRow>
													<TableCell>2 Cores</TableCell>
													<TableCell>8 GB</TableCell>
													<TableCell>500 GB</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
								</FieldSet>
								{/* <DisplayLabel label='CPU' text={report.cpu + ' Cores'} direction='row' />
								<br />
								<DisplayLabel label='Memory' text={report.memory + ' GB'} direction='row' />
								<br />
								<DisplayLabel
									label='Storage'
									text={
										report.storage >= 1000 ? report.storage / 1000 + 'TB' : report.storage + ' GB'
									}
									direction='row'
								/>
								<br />
								<DisplayLabel label='Primary Nodes' text={report.nodes} direction='row' />
								<br />
								<DisplayLabel label='Other Nodes' text={report.othNodes} direction='row' />
								<br />
								<DisplayLabel label='Pods per Node' text={report.pods} direction='row' />
								<br />
								<DisplayLabel label='No. of Threads' text={report.consumers} direction='row' />
								<Report data={report} masters={masters} /> */}
							</Grid>
						)}
					</Grid>
				)}
			</div>
		</div>
	)
}
