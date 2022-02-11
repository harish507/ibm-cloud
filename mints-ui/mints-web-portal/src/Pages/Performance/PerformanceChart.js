import React from 'react'
import { Chart } from 'react-charts'

export default function PerformanceChart (props) {
	const [ data, setData ] = React.useState(null)

	React.useEffect(() => {
		let tps = [],
			cpu = [],
			dur = []
		props.data.forEach((r) => {
			tps.push({ y: Number(r.loadSize.replace('K', '')), x: r.tps ? r.tps : 0 })
			cpu.push({ y: Number(r.loadSize.replace('K', '')), x: r.cpu ? r.cpu : 0 })
			dur.push({ y: Number(r.loadSize.replace('K', '')), x: r.duration ? r.duration : 0 })
		})
		setData([ { label: 'TPS', data: tps }, { label: 'CPU', data: cpu }, { label: 'Duration', data: dur } ])
	}, [])

	// const data = React.useMemo(
	// 	() => [
	// 		{
	// 			label: 'Series 1',
	// 			data: [ { x: 1, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 30 } ]
	// 		}
	// 		// {
	// 		// 	label: 'Series 2',
	// 		// 	data: [ { x: 1, y: 40 }, { x: 2, y: 50 }, { x: 3, y: 60 } ]
	// 		// },
	// 		// {
	// 		// 	label: 'Series 3',
	// 		// 	data: [ { x: 1, y: 70 }, { x: 2, y: 80 }, { x: 3, y: 90 } ]
	// 		// }
	// 	],
	// 	[]
	// )

	const axes = React.useMemo(
		() => [ { primary: true, type: 'linear', position: 'bottom' }, { type: 'linear', position: 'left' } ],
		[]
	)

	return (
		<div
			style={{
				width: '450px',
				height: '300px'
			}}
		>
			{data && <Chart data={data} axes={axes} />}
			{/* {JSON.stringify(props.data)} */}
		</div>
	)
}
