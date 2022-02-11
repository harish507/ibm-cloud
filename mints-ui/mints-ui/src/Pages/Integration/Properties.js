/* eslint no-eval: 0 */
import React from 'react'
import TextBox from '../../Controls/TextBox'
import RadioSelection from '../../Controls/RadioSelection'
import ObjectEntryControl from '../../Controls/ObjectEntryControl'
import ObjectListSelection from '../../Controls/ObjectListSelection'
// import DropDown from '../../Controls/DropDown'
import { Grid } from '@material-ui/core'
// import TypeAssistDropDown from '../../Controls/TypeAssistDropDown'

export default function Properties (props) {
	const handleChange = (rIndex, pIndex, value) => {
		let template = props.template
		template.palettes[rIndex].properties[pIndex].value = value
		props.handleChange(template)
	}

	const checkCondition = (prop) => {
		let exists = false,
			matched = false
		if (prop.cKey && prop.cKey !== '') {
			//alert(prop.key)
			exists = true
			props.template.palettes.forEach((r) => {
				r.properties.forEach((p) => {
					if (p.key === prop.cKey) {
						//alert(p.value)
						if (p.value !== undefined && p.value !== null) {
							//alert(p.value + prop.cOpr + prop.cValue)
							// alert(typeof p.value)
							// alert(typeof p.value === 'string')
							if (typeof p.value === 'string') {
								matched = p.value === prop.cValue ? true : false
							} else {
								matched = eval(p.value + prop.cOpr + prop.cValue)
							}
						}
					}
				})
			})
		}
		return !exists || (exists && matched)
	}
	const selectControl = (prop, rIndex, pIndex) => {
		switch (prop.type) {
			case 'text':
				return (
					<TextBox
						key={pIndex}
						label={prop.label}
						value={prop.value}
						onChange={(e) => handleChange(rIndex, pIndex, e.target.value)}
					/>
				)
			case 'password':
				return (
					<TextBox
						key={pIndex}
						type='password'
						label={prop.label}
						value={prop.value}
						onChange={(e) => handleChange(rIndex, pIndex, e.target.value)}
					/>
				)
			case 'queue':
				return (
					<TextBox
						key={pIndex}
						label={prop.label}
						value={prop.value}
						onChange={(e) => handleChange(rIndex, pIndex, e.target.value)}
					/>
				)
			case 'Kafka':
				return (
					<TextBox
						key={pIndex}
						label={prop.label}
						value={prop.value}
						onChange={(e) => handleChange(rIndex, pIndex, e.target.value)}
					/>
				)
			case 'choose':
				// alert(prop.source)
				// alert(JSON.stringify(props.masters[prop.source]))
				return (
					<RadioSelection
						key={pIndex}
						items={props.masters[prop.source]}
						label={prop.label}
						value={prop.value}
						onChange={(e) => handleChange(rIndex, pIndex, e.target.value)}
					/>
				)
			case 'list':
				return (
					<RadioSelection
						key={pIndex}
						items={[ ...prop.source ]}
						label={prop.label}
						value={prop.value}
						onChange={(e) => handleChange(rIndex, pIndex, e.target.value)}
					/>
				)
			case 'boolean':
				return (
					<RadioSelection
						key={pIndex}
						items={[ 'Yes', 'No' ]}
						label={prop.label}
						value={prop.value ? 'Yes' : 'No'}
						onChange={(e) => handleChange(rIndex, pIndex, e.target.value === 'Yes' ? true : false)}
					/>
				)
			case 'object':
				return (
					<ObjectEntryControl
						key={pIndex}
						label={prop.label}
						value={prop.value ? JSON.parse(prop.value) : {}}
						onChange={(val) => handleChange(rIndex, pIndex, JSON.stringify(val))}
					/>
				)
			case 'ObjectList':
				return (
					<ObjectListSelection
						key={pIndex}
						label={prop.label}
						source={props.userExits}
						value={prop.value && prop.value !== '' ? JSON.parse(prop.value) : []}
						onChange={(val) => handleChange(rIndex, pIndex, JSON.stringify(val))}
					/>
				)
			default:
				return <div key={pIndex}> No control for {prop.type}</div>
		}
	}

	//if (props.template && props.template.palettes)

	let { palettes } = props.template
	return (
		<React.Fragment>
			{palettes &&
			palettes.length > 0 && (
				<Grid container spacing={1} alignContent='flex-start' alignItems='flex-start'>
					{palettes.map((route, rIndex) => {
						return (
							<React.Fragment key={rIndex}>
								{/* {JSON.stringify(route)} */}
								{route.properties.map((prop, pIndex) => {
									if (props.template.hideProps[prop.key] !== undefined) {
										return null
									} else {
										return checkCondition(prop) ? (
											<Grid item md={4} sm={12} xs={12}>
												{selectControl(prop, rIndex, pIndex)}{' '}
											</Grid>
										) : null
									}
								})}
							</React.Fragment>
						)
					})}
				</Grid>
			)}
		</React.Fragment>
	)
}
