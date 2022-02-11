import React from 'react'
import TextBox from '../../Controls/TextBox'
import DropDown from '../../Controls/DropDown'
import { Grid } from '@material-ui/core'
import ObjectEntryControl from '../../Controls/ObjectEntryControl'

export default function BasicInfo (props) {
	const handleChange = (key, value) => {
		let details = props.details
		details[key] = value
		props.handleChange(details)
	}
	return (
		<Grid container spacing={1} alignContent='flex-start' alignItems='flex-start' style={{ padding: 20 }}>
			<Grid item md={4} sm={6} xs={12}>
				<TextBox
					label='Name'
					value={props.details.name}
					autoFocus={true}
					onChange={(e) => handleChange('name', e.target.value)}
					error={props.validate && props.details.name === ''}
				/>
			</Grid>
			<Grid item md={8} sm={6} xs={12}>
				<TextBox
					multiline
					label='Description'
					value={props.details.description}
					onChange={(e) => handleChange('description', e.target.value)}
					error={props.validate && props.details.description === ''}
				/>
			</Grid>
			<Grid item md={4} sm={6} xs={12}>
				<DropDown
					label='Source'
					items={props.masters.applications}
					value={props.details.source}
					onChange={(val) => handleChange('source', val)}
					error={props.validate && props.details.source === ''}
				/>
			</Grid>
			<Grid item md={4} sm={6} xs={12}>
				<DropDown
					label='Destination'
					items={props.masters.applications}
					value={props.details.target}
					onChange={(val) => handleChange('target', val)}
					error={props.validate && props.details.target === ''}
				/>
			</Grid>
			<Grid item md={4} sm={6} xs={12}>
				<ObjectEntryControl
					label='Keys'
					value={props.details.keys ? props.details.keys : {}}
					onChange={(val) => handleChange('keys', val)}
				/>
			</Grid>
			{/* <Grid item md={3} sm={6} xs={12}>
				<DropDown
					label='Country'
					value={props.details.country}
					items={props.masters.countries}
					onChange={(val) => handleChange('country', val)}
					error={props.validate && props.details.country === ''}
				/>
			</Grid>
			<Grid item md={3} sm={6} xs={12}>
				<DropDown
					label='Instance'
					value={props.details.instance}
					items={props.masters.instances}
					onChange={(val) => handleChange('instance', val)}
					error={props.validate && props.details.instance === ''}
				/>
			</Grid> */}
			<Grid item md={4} sm={6} xs={12}>
				<TextBox
					label='Min Volume'
					type='number'
					value={props.details.minVolume}
					onChange={(e) => handleChange('minVolume', e.target.value)}
					error={props.validate && props.details.minVolume === ''}
				/>
			</Grid>
			<Grid item md={4} sm={6} xs={12}>
				<TextBox
					label='Avg Volume'
					type='number'
					value={props.details.avgVolume}
					onChange={(e) => handleChange('avgVolume', e.target.value)}
					error={props.validate && props.details.avgVolume === ''}
				/>
			</Grid>
			<Grid item md={4} sm={6} xs={12}>
				<TextBox
					label='Max Volume'
					type='number'
					value={props.details.maxVolume}
					onChange={(e) => handleChange('maxVolume', e.target.value)}
					error={props.validate && props.details.maxVolume === ''}
				/>
			</Grid>
		</Grid>
	)
}
