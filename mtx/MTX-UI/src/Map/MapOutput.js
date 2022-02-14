import React, { useState } from 'react'
import { Button, Grid } from '@material-ui/core'
import FieldSet from '../Controls/FieldSet'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import OutputItem from './OutputItem'

const MapOutput = (props) => {
	const [ map ] = useState(props.map)

	return (
		<Grid container spacing={4} alignContent='flex-start' alignItems='flex-start' style={{ padding: 10 }}>
			<Grid item md={10} sm={5} xs={12}>
				<FieldSet label='Mapping details' border>
					{map.targetFields.filter((x) => x.value !== undefined).map((field, index) => {
						return <OutputItem key={index} node={field} ind={index} output />
					})}
				</FieldSet>
			</Grid>
			<Grid item md={5} sm={5} xs={12}>
				<FieldSet label='Source format' border contentStyle={{ height: '50vh', overflow: 'auto' }}>
					<pre>{props.sFile}</pre>
				</FieldSet>
			</Grid>
			<Grid item md={5} sm={5} xs={12}>
				<FieldSet label='Target format' border contentStyle={{ height: '50vh', overflow: 'auto' }}>
					<pre>{props.tFile}</pre>
				</FieldSet>
			</Grid>
			<Grid item sm={10} xs={12} style={{ textAlign: 'center' }}>
				<Button variant='contained' color='primary' onClick={() => props.editMap(map)}>
					Edit Map
				</Button>
			</Grid>
		</Grid>
	)
}

export default DragDropContext(HTML5Backend)(MapOutput)
