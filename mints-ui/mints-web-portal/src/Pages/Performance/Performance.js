import React, { useState, useEffect } from 'react'
import { Box } from '@material-ui/core'
// import { Tabs, Tab } from '@material-ui/core'
import PerformanceEntry from './PerformanceEntry'
import PerformanceView from './PerformanceView'
import db from '../../Helpers/DbHelper'

export default function Performance () {
	const [ masters, setMasters ] = useState(null)
	// const [ tab, setTab ] = React.useState(0)

	// const handleChange = (event, newValue) => {
	// 	setTab(newValue)
	// }

	useEffect(() => {
		db
			.getMasters()
			.then((masters) => {
				setMasters(masters)
			})
			.catch((err) => {
				alert(err)
			})
	}, [])

	return (
		<Box sx={{ width: '100%' }}>
			{/* <Tabs value={tab} onChange={handleChange} centered>
				<Tab label='View' />
				<Tab label='Update' />
			</Tabs> */}

			{/* {tab === 0 && <PerformanceView />}
			{tab === 1 && <PerformanceEntry />} */}

			{masters && (
				<div style={{ display: 'flex', padding: '10px 30px' }}>
					<PerformanceEntry masters={masters} />
				</div>
			)}
			{masters && (
				<div style={{ display: 'flex', padding: '10px 30px' }}>
					<div style={{ flex: 2 }}>
						<PerformanceView masters={masters} />
					</div>
					{/* <div style={{ flex: 3 }}>
						<PerformanceEntry masters={masters} />
					</div> */}
				</div>
			)}
		</Box>
	)
}
