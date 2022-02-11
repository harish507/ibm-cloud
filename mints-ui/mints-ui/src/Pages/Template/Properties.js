import React from 'react'
import { Typography, Grid } from '@material-ui/core'
import SwitchControlReverse from '../../Controls/SwitchControlReverse'

export default function Properties (props) {
	const [ items, setItems ] = React.useState(props.hideProps ? props.hideProps : {})
	const [ list, setList ] = React.useState([])

	// const getPropKeyPair = () => {
	//     let list = []
	//     props.nodes.forEach(node => {
	//         node.properties.forEach(prop => {
	//             list.push({label: prop.label,key:prop.key,value: prop.value,hide:items[prop.key ? true: false]})
	//         })
	//     })
	//     return list
	// }
	const changeItemHide = (key) => {
		props.setHideProps({ ...items, [key]: items[key] ? null : true })
	}

	const getListItem = (item, index) => {
		return (
			<Grid key={index} container style={{ marginBottom: 5, paddingLeft: 10, textAlign: 'left' }} spacing={0}>
				<Grid item md={10}>
					<Typography component='span' variant='body2' color='textPrimary'>
						{item.label}
					</Typography>
				</Grid>
				{/* <Grid item md={6}><Typography component="span" variant="body2"
                        color="textPrimary">{item.value}</Typography></Grid> */}
				<Grid item md={2}>
					<SwitchControlReverse
						checked={items[item.key] ? true : false}
						onChange={() => changeItemHide(item.key)}
					/>
				</Grid>
			</Grid>
		)
	}

	React.useEffect(
		() => {
			setItems(props.hideProps)
			//console.log(props.hideProps)
			let list = []
			props.nodes.forEach((node) => {
				node.properties.forEach((prop) => {
					list.push({
						label: prop.label,
						key: prop.key,
						value: prop.value,
						hide: items[prop.key ? true : false]
					})
				})
			})
			setList(list)
		},
		[ props, items ]
	)

	return (
		<React.Fragment>
			<Grid container spacing={0} style={{ marginBottom: 5, paddingLeft: 10, textAlign: 'left' }}>
				<Grid item md={10}>
					<Typography component='span' variant='body2' color='textSecondary'>
						Property
					</Typography>
				</Grid>
				{/* <Grid item md={6}><Typography component="span" variant="body2"
                        color="textSecondary">Default Value</Typography></Grid> */}
				<Grid item md={2}>
					<Typography component='span' variant='body2' color='textSecondary'>
						Hide
					</Typography>
				</Grid>
			</Grid>
			{list.map((item, index) => {
				return getListItem(item, index)
			})}
		</React.Fragment>
	)
}
