/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from 'react'
import { Button } from '@material-ui/core'

const styles = {
	root: {
		textAlign: 'center',
		display: 'flex',
		flexDirection: 'column',
		width: 900
	},
	canvas: {
		//border: '1px solid #aaa',
		width: 900
		// height: 600
	},
	source: {
		color: '#eee'
	},
	element: {
		color: 'red',
		width: 1
	},
	button: {
		width: 150,
		textAlign: 'center',
		margin: '0 auto'
	}
}
const height = 36.5
const width = 300
const level = 30

export default function MapView ({ map, editMap }) {
	const canvas = useRef()
	let ctx = null

	// initialize the canvas context
	useEffect(() => {
		// dynamically assign the width and height to canvas
		const canvasEle = canvas.current
		canvasEle.width = canvasEle.clientWidth
		canvasEle.height =
			(map.targetFields.length >= map.sourceFields.length ? map.targetFields.length : map.sourceFields.length) *
				36.5 +
			200 //canvasEle.clientHeight

		// get context of the canvas
		ctx = canvasEle.getContext('2d')
	}, [])

	useEffect(() => {
		//alert(JSON.stringify(map.targetFields))
		drawClass(50, 50, map.sourceFields, 'lightYellow')
		drawClass(550, 50, map.targetFields, 'lightGreen')
		map.targetFields.forEach((field) => {
			field.srcInd && drawLine(width + 50, 68 + field.srcInd * height, 550, 68 + field.ind * height)
		})
	}, [])

	const drawClass = (x, y, list, hColor) => {
		ctx.font = 'normal normal normal 16px Arial'
		ctx.strokeStyle = '#999'
		ctx.beginPath()
		ctx.fillStyle = hColor
		ctx.fillRect(x, y, width, height)
		ctx.strokeStyle = '#666'
		//ctx.strokeText(list[0].parent, x + 15, y + (height - 15))
		list.forEach((field, index) => {
			ctx.strokeStyle = '#666'
			ctx.strokeText(field.name, x + field.level * level + 15, y + index * height + (height - 12))
			ctx.strokeStyle = '#ddd'
			ctx.rect(x, y + index * height, width, height)
		})
		ctx.stroke()
	}
	const drawLine = (x1, y1, x2, y2) => {
		ctx.strokeStyle = '#666'
		ctx.beginPath()
		ctx.moveTo(x1, y1)
		ctx.lineTo(x2, y2)
		ctx.stroke()
		ctx.fillStyle = '#666'
		ctx.beginPath()
		ctx.arc(x1, y1, 3, 0, 2 * Math.PI)
		ctx.arc(x2, y2, 3, 0, 2 * Math.PI)
		ctx.fill()
	}

	return (
		<div style={styles.root}>
			<canvas ref={canvas} style={styles.canvas} />
			<Button style={styles.button} variant='contained' color='primary' onClick={() => editMap(map)}>
				Edit Map
			</Button>
		</div>
	)
}
