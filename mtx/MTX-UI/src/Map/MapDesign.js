/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { Button, Grid } from '@material-ui/core'
// import FieldSet from '../Controls/FieldSet'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import SourceItem from './SourceItem'
import TargetItem from './TargetItem'
// import MapFunctions from './MapFunctions'
import FunctionTextBox from './FunctionTextBox'

const MapDesign = (props) => {
	const canvas = useRef(null)
	const [ map, setMap ] = useState(props.map)
	const [ src, setSrc ] = useState(-1)
	const [ trg, setTrg ] = useState(-1)
	let ctx = null
	let height = 36.5
	let width = 200
	let topEdge = 10

	useEffect(() => {
		updateMapping()
	}, [])

	const updateMapping = (tFields = map.targetFields) => {
		const canvasEle = canvas.current
		canvasEle.width = canvasEle.clientWidth
		canvasEle.height =
			(map.targetFields.length >= map.sourceFields.length ? map.targetFields.length : map.sourceFields.length) *
			36.5
		ctx = canvasEle.getContext('2d')
		width = canvasEle.clientWidth
		ctx.clearRect(0, 0, width, height)
		tFields.forEach((field) => {
			if (field.srcInd) {
				if (field.function) {
					field.srcInd.forEach((sInd) =>
						drawLine(0, topEdge + sInd * height, width, topEdge + field.ind * height)
					)
				} else {
					drawLine(0, topEdge + field.srcInd * height, width, topEdge + field.ind * height)
				}
			}
		})
	}

	const drawLine = (x1, y1, x2, y2) => {
		//ctx.strokeStyle = '#aaa'
		ctx.beginPath()
		ctx.moveTo(x1, y1)
		ctx.lineTo(x2, y2)
		ctx.stroke()
		//ctx.fillStyle = '#666'
		ctx.beginPath()
		ctx.arc(x1, y1, 5, 0, 2 * Math.PI)
		ctx.arc(x2, y2, 5, 0, 2 * Math.PI)
		ctx.fill()
	}

	// const handleDropOrg = (ctl) => {
	// 	var fields = [ ...map.targetFields ]
	// 	fields[trg].srcInd = ctl.ind
	// 	fields[trg].value = ctl.parent !== '' ? '${' + ctl.parent + ctl.name + '}' : ctl.name
	// 	fields[trg].key =
	// 		fields[trg].parent !== '' ? '${' + fields[trg].parent + fields[trg].name + '}' : fields[trg].name
	// 	fields[trg].label = ctl.parent !== '' ? ctl.parent + ctl.name : ctl.name
	// 	fields[trg].sourceUp = ctl.parentUp !== '' ? ctl.parentUp : ''
	// 	setMap({ ...map, targetFields: fields })
	// 	updateMapping()
	// }

	// const removeMatch = (tmp) => {
	// 	var fields = [ ...map.targetFields ]
	// 	fields[tmp].srcInd = undefined
	// 	fields[tmp].value = undefined
	// 	fields[tmp].label = undefined
	// 	fields[tmp].sourceUp = undefined
	// 	setMap({ ...map, targetFields: fields })
	// 	updateMapping()
	// }

	const handleDrop = (ctl) => {
		setSrc(ctl.ind)
		// var fields = [ ...map.targetFields ]
		// fields[trg].srcInd = ctl.ind
		// fields[trg].value = ctl.parent !== '' ? '${' + ctl.parent + ctl.name + '}' : ctl.name
		// fields[trg].key =
		// 	fields[trg].parent !== '' ? '${' + fields[trg].parent + fields[trg].name + '}' : fields[trg].name
		// fields[trg].label = ctl.parent !== '' ? ctl.parent + ctl.name : ctl.name
		// fields[trg].sourceUp = ctl.parentUp !== '' ? ctl.parentUp : ''
		// setMap({ ...map, targetFields: fields })
		//updateMapping()
	}

	const editMatch = (tmp) => {
		setTrg(tmp.ind)
		//tmp.function ? setSrc(tmp.srcInd[0]) : setSrc(tmp.srcInd)
		setSrc(tmp.srcInd === undefined ? 0 : tmp.function ? tmp.srcInd[0] : tmp.srcInd)
	}
	const updateMapFunction = (updTrg) => {
		var fields = [ ...map.targetFields ]
		fields[trg] = { ...updTrg }
		//setMap({ ...map, targetFields: null })
		setMap({ ...map, targetFields: fields })
		setTimeout(() => {
			updateMapping(fields)
		}, 10)
		setSrc(-1)
	}

	return (
		<React.Fragment>
			<Grid
				container
				spacing={0}
				alignContent='flex-start'
				alignItems='flex-start'
				style={{ textAlign: 'center', padding: '50px 0 20px 0' }}
			>
				<Grid item md={3} xs={12}>
					Source Definition : {map.sourceType}
				</Grid>
				<Grid item md={2} xs={12} />
				<Grid item md={3} xs={12}>
					Target Definition : {map.targetType}
				</Grid>
			</Grid>
			{map.targetFields && (
				<Grid container spacing={0} alignContent='flex-start' alignItems='flex-start'>
					<Grid item md={3} xs={12} style={{ border: '1px solid lightGray' }}>
						{/* <FieldSet label='Source Definition' border> */}
						{map.sourceFields.map((field, index) => {
							return (
								<SourceItem
									key={index}
									item={field}
									handleDrop={handleDrop}
									editMatch={props.saveMap ? true : undefined}
								/>
							)
						})}
						{/* </FieldSet> */}
					</Grid>
					<Grid item md={2} xs={12}>
						<canvas ref={canvas} style={{ backgroundColor: 'white', width: '100%' }} />
					</Grid>
					<Grid item md={3} xs={12} style={{ border: '1px solid lightGray' }}>
						{/* <FieldSet label='Target Definition' border> */}
						{map.targetFields.map((field, index) => {
							return (
								<TargetItem
									key={index}
									node={field}
									ind={index}
									setTrg={setTrg}
									// removeMatch={props.saveMap ? removeMatch : undefined}
									editMatch={props.saveMap ? editMatch : undefined}
								/>
							)
						})}
						{/* </FieldSet> */}
					</Grid>
				</Grid>
			)}
			<br />
			<br />
			<Grid container spacing={0} alignContent='flex-start' alignItems='flex-start' style={{ padding: 50 }}>
				<Grid item md={7} xs={12} style={{ textAlign: 'center' }}>
					{props.saveMap && (
						<Button
							variant='contained'
							color='primary'
							onClick={() => (window.location.href = '/map/' + map.project + '/' + map.id)}
						>
							Reset
						</Button>
					)}
					&nbsp;&nbsp;
					{props.saveMap && (
						<Button variant='contained' color='primary' onClick={() => props.saveMap(map)}>
							Continue
						</Button>
					)}{' '}
					{props.editMap && (
						<Button variant='contained' color='primary' onClick={() => props.editMap(map)}>
							Edit Map
						</Button>
					)}
				</Grid>
			</Grid>
			{src > -1 &&
			map &&
			trg > -1 && (
				<FunctionTextBox
					map={map}
					functions={props.functions}
					src={map.sourceFields[src]}
					trg={map.targetFields[trg]}
					onCancel={() => setSrc(-1)}
					onChange={updateMapFunction}
					containerStyle={{ height: 200 }}
				/>
			)}
		</React.Fragment>
	)
}

export default DragDropContext(HTML5Backend)(MapDesign)
