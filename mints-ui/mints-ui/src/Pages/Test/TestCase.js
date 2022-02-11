import React, { useState } from 'react'
import _ from 'lodash'
import { Grid } from '@material-ui/core'
import FieldSet from '../../Controls/FieldSet'
import EditLine from './EditLine'
import EditTable from './EditTable'

export default function TestCase (props) {
	//const [ lines, setLines ] = useState([])
	const [ source, setSource ] = useState(null)
	const [ target, setTarget ] = useState(null)
	const [ files, setFiles ] = useState([])

	const preview = false

	React.useEffect(
		() => {
			if (source !== null) return
			let list = props.source.split('\n')
			// alert(JSON.stringify(props.details))
			//setLines(list)
			let data = {
				feature: '',
				background: [],
				scenarios: []
			}
			let scenario = null
			let examples = false
			list.forEach((item, ind) => {
				if (item.trim() === '') {
				} else if (_.startsWith(item.trim(), 'Feature:')) {
					data.feature = item.trim().substring(9)
				} else if (_.startsWith(item.trim(), 'Background:')) {
					data.background = []
				} else if (_.startsWith(item.trim(), 'Scenario Outline:')) {
					if (scenario !== null) {
						data.scenarios.push({ ...scenario })
						scenario = null
						examples = false
					}
					scenario = { name: item.trim().substring(18), rules: [], examples: [] }
				} else if (_.startsWith(item.trim(), 'Scenario:')) {
					if (scenario !== null) {
						data.scenarios.push({ ...scenario })
						scenario = null
						examples = false
					}
					scenario = { name: item.trim().substring(10), rules: [], examples: [] }
				} else if (_.startsWith(item.trim(), 'Examples:')) {
					examples = true
				} else {
					if (scenario !== null) {
						if (examples) {
							scenario.examples.push(item.trim())
						} else {
							scenario.rules.push({ text: item.trim(), keys: [] })
						}
					} else {
						data.background.push({ text: item.trim(), keys: [] })
					}
				}
			})
			if (scenario !== null) {
				data.scenarios.push({ ...scenario })
				scenario = null
				examples = false
			}
			setSource({ ...data })
			setTarget({ ...data, scenarios: [ ...data.scenarios ] })
		},
		[ props, props.source, source ]
	)

	const updateBackground = (ind, data) => {
		let newTarget = { ...target }
		newTarget.background[ind].value = data
		setTarget(newTarget)
		props.update(newTarget)
	}
	const updateRule = (ind, rind, data) => {
		let newTarget = { ...target }
		newTarget.scenarios[ind].rules[rind].value = data
		setTarget(newTarget)
		props.update(newTarget)
	}
	const updateExamples = (ind, data) => {
		let newTarget = { ...target }
		newTarget.scenarios[ind].examples = data
		//alert(JSON.stringify(newTarget, null, 4))
		setTarget(newTarget)
		props.update(newTarget)
	}

	const addFiles = (inFiles) => {
		//alert(inFiles[0])
		props.updateFiles([ ...files, ...inFiles ])
		setFiles([ ...files, ...inFiles ])
	}

	return (
		<div style={{ paddingLeft: 30 }}>
			{source && (
				<Grid container spacing={2}>
					<Grid item md={1} sm={6}>
						Feature
					</Grid>
					<Grid item md={11} sm={6}>
						{source.feature}
					</Grid>

					<Grid item md={1} sm={6}>
						<div>Background</div>
					</Grid>
					<Grid item md={11} sm={6}>
						{source.background.map((item, ind) => {
							return (
								<Grid key={ind} container spacing={1}>
									<Grid item md={preview ? 8 : 12} sm={12}>
										<EditLine
											details={props.details}
											key={ind}
											item={target.background[ind]}
											update={(data) => updateBackground(ind, data)}
										>
											{item.text}
										</EditLine>
									</Grid>
									{preview && (
										<Grid item md={4} sm={12}>
											<div style={{ color: 'grey', fontSize: '0.8em' }}>
												{target.background[ind].value}
											</div>
										</Grid>
									)}
								</Grid>
							)
						})}
					</Grid>

					<Grid item md={1} sm={6}>
						<div>Scenarios</div>
					</Grid>
					<Grid item md={11} sm={6}>
						{source.scenarios.map((scenario, ind) => {
							return (
								<FieldSet
									key={ind}
									label={scenario.name}
									style={{ textAlign: 'left', marginBottom: 30 }}
								>
									{scenario.rules.map((r, i) => {
										return (
											<Grid key={i} container spacing={1}>
												<Grid item md={preview ? 8 : 12} sm={12}>
													<EditLine
														details={props.details}
														item={target.scenarios[ind].rules[i]}
														update={(data) => updateRule(ind, i, data)}
													>
														{r.text}
													</EditLine>
												</Grid>
												{preview && (
													<Grid item md={4} sm={12}>
														<div style={{ color: 'grey', fontSize: '0.8em' }}>
															{target.scenarios[ind].rules[i].value}
														</div>
													</Grid>
												)}
											</Grid>
										)
									})}
									{scenario.examples.length > 0 && (
										<Grid container spacing={1}>
											<Grid item md={preview ? 8 : 12} sm={12}>
												<EditTable
													headers={scenario.examples[0]}
													addFiles={addFiles}
													update={(data) => updateExamples(ind, data)}
												/>
											</Grid>
										</Grid>
									)}
								</FieldSet>
							)
						})}
					</Grid>
					<Grid item md={12}>
						{/* <pre>{JSON.stringify(source, null, 4)}</pre> */}
					</Grid>
				</Grid>
			)}
		</div>
	)
}
