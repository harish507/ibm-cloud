import React from 'react'
import { Table, TableHead, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core'
import _ from 'lodash'

const fields = [ 'tps', 'cpu', 'memory', 'podSize', 'transmittedBw', 'networkBw' ] // 'nodeSize', 'consumer',

export default function Report ({ masters, data, x, y }) {
	return (
		<TableContainer>
			{/* {records && JSON.stringify(records)} */}
			<Table size='small'>
				<TableHead>
					<TableRow>
						<TableCell> Consumer</TableCell>
						{fields.map((f) => (
							<TableCell align='right' key={f}>
								{_.startCase(f)}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{data &&
						Object.keys(data).map((c) => (
							<TableRow key={c}>
								<TableCell component='th' scope='row'>
									<b>{c}</b>
								</TableCell>
								{data[c] &&
									fields.map((f, index) => (
										<TableCell align='right' key={index}>
											{data[c][f]}
										</TableCell>
									))}
							</TableRow>
						))}
					{/* <TableRow>
						<TableCell> </TableCell>
						{masters[x].map((size, index) => (
							<TableCell align='right' key={index}>
								<b>{size}</b>
							</TableCell>
						))}
					</TableRow> */}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
