import express from 'express'
import mongodb from './mongodb'
import ApiResult from './ApiResult'
import _ from 'lodash'

const Mongo = express.Router()

Mongo.get('/', (req, res) => {
	ApiResult(res, null, '/Format api test')
})

Mongo.get('/:version', (req, res) => {
	mongodb.getPalettes((err, list) => {
		if (err) {
			ApiResult(res, err)
		} else {
			if (list && list.length > 0) {
				let palettes = {}
				list.forEach(
					(i) => (palettes[i._id] = { id: i._id, name: i.name, group: i.group, version: req.params.version })
				)
				mongodb.getConfig(req.params.version, (err, info) => {
					if (err) {
						ApiResult(res, err)
					} else {
						if (info) {
							info.forEach((i) => (palettes[i.palette._id].info = i))
							ApiResult(res, null, palettes)
						} else {
							ApiResult(res, 'Failed to get info for given version')
						}
					}
				})
			} else {
				ApiResult(res, 'Failed to get info for given version')
			}
		}
	})
})

Mongo.put('/config/:version/:id', (req, res) => {
	mongodb.updateConfig(req.params.id, req.body, (err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			mongodb.getConfigByID(req.params.id, (error, result) => ApiResult(res, err, result))
		}
	})
})
Mongo.post('/config/:version', (req, res) => {
	mongodb.saveConfig(req.body, (err, result) => ApiResult(res, err, result))
})

function getJsonValueByPath (path, obj) {
	return path.split('.').reduce(function (prev, curr) {
		return prev ? prev[curr] : null
	}, obj)
}

Mongo.post('/format', (req, res) => {
	//ApiResult(res,null,req.body.version)
	let { version, details, template } = req.body
	let sourceAppConfig = null
	let targetAppConfig = null
	mongodb.getAppConfigByName(details.source, (err, obj) => (sourceAppConfig = obj._doc))
	mongodb.getAppConfigByName(details.target, (err, obj) => (targetAppConfig = obj._doc))

	mongodb.getConfig(version, (err, formatConfig) => {
		if (err) {
			ApiResult(res, err)
		} else {
			mongodb.getDefaultsByEnv(details.environment, (err, defaults) => {
				if (err) {
					ApiResult(res, err)
				} else {
					if (!defaults || defaults.length === 0) {
						ApiResult(res, 'Default properties not configured for this environment.')
					} else {
						let source = {
							InletEncoding: '',
							OutletEncoding: '',
							SourceAppConnKey: _.startCase(_.camelCase(_.toLower(details.source))).replace(
								new RegExp(' ', 'g'),
								''
							),
							TargetAppConnKey: _.startCase(_.camelCase(_.toLower(details.target))).replace(
								new RegExp(' ', 'g'),
								''
							),
							...defaults[0].defaultValues
						}

						mongodb.getMaster('textReplacements', (err, formatters) => {
							if (err) {
								ApiResult(res, err)
							} else {
								//console.log(formatters)
								if (formatConfig && formatConfig.length > 0) {
									let output = []
									let tags = {
										from: [],
										trans: [],
										to: []
									}
									try {
										template.palettes.forEach((route) => {
											route.properties.forEach((prop) => {
												var formatter = formatters.filter((f) => f.type === prop.type)
												if (formatter && formatter.length > 0) {
													source[prop.key] =
														formatter[0].prefix + prop.value + formatter[0].postfix
												} else {
													//if (prop.type === 'queue') {
													source[prop.key] = prop.value
												}
											})
											//console.log(route._id)
											//console.log(formatConfig[0].palette._id.equals(route._id))
											let target = formatConfig.filter((p) => p.palette._id.equals(route._id))
											//console.log(target)
											if (target && target.length > 0) {
												let pXml = target[0].xml
												//console.log(pXml)
												Object.keys(target[0].inputs).forEach((targetKey) => {
													//console.log(target[0].inputs[targetKey].type)
													if (target[0].inputs[targetKey].type === 'boolean') {
														//console.log(source[targetKey])
														source[targetKey] =
															source[targetKey] === true
																? target[0].inputs[targetKey].options['true']
																: target[0].inputs[targetKey].options['false']
													}
													if (target[0].inputs[targetKey].type === 'choose') {
														source[targetKey] =
															target[0].inputs[targetKey].options[source[targetKey]] !==
															undefined
																? target[0].inputs[targetKey].options[source[targetKey]]
																: source[targetKey]
													}
													if (target[0].inputs[targetKey].type === 'format') {
														source[targetKey] =
															source[targetKey] !== ''
																? target[0].inputs[targetKey].format.replace(
																		'[' + targetKey + ']',
																		source[targetKey]
																	)
																: ''
													}
													if (target[0].inputs[targetKey].type === 'appConfig') {
														//console.log(source[target[0].inputs[targetKey].key])
														let cfg = getJsonValueByPath(
															target[0].inputs[targetKey].path,
															source[target[0].inputs[targetKey].key] === 'Source'
																? sourceAppConfig
																: targetAppConfig
														)
														source[targetKey] = cfg ? cfg : ''
													}
													if (target[0].inputs[targetKey].type === 'object') {
														if (source[targetKey] !== '' && source[targetKey] !== '{}') {
															let obj = JSON.parse(source[targetKey])
															let objStr = ''
															Object.keys(obj).forEach((k) => {
																objStr += target[0].inputs[targetKey].format
																	.replace('[ObjKey]', k)
																	.replace('[ObjValue]', obj[k])
															})
															source[targetKey] = objStr
														} else {
															source[targetKey] = ''
														}
													}
													if (target[0].inputs[targetKey].type === 'objectList') {
														if (source[targetKey] !== '' && source[targetKey] !== '{}') {
															let obj = JSON.parse(source[targetKey])
															let objStr = ''
															var objKey = []
															var objVal = []
															obj.forEach((exit) => {
																objKey.push(exit.name)
																objVal.push(
																	exit.properties.map((x) => x.value).join('|')
																)
															})
															if (objKey.length > 0) {
																objStr = target[0].inputs[targetKey].format
																	.replace('[ObjKey]', objKey.join('~'))
																	.replace('[ObjValue]', objVal.join('~'))
															} else {
																objStr = ''
															}
															source[targetKey] = objStr
														} else {
															source[targetKey] = ''
														}
													}
													if (pXml) {
														//tags[pXml.tag].push['']
														pXml.value = replaceAll(
															pXml.value,
															'[' + targetKey + ']',
															source[targetKey]
														)
													}
												})

												if (pXml) {
													pXml.value = replaceAll(pXml.value, '?"', '"')
													pXml.value = replaceAll(pXml.value, '?&amp;', '?')
													pXml.value = replaceAll(pXml.value, '&amp;"', '"')
													pXml.value = replaceAll(pXml.value, '&amp;&amp;', '&amp;')
													//console.log(pXml.tag)
													tags[pXml.tag].push(pXml.value)
												}
												if (target[0].outputs.length === 0) {
													target[0].outputs.push({
														file: '[INTID].xml',
														data:
															'<route id="[INTID]">[from][InletEncoding][trans][OutletEncoding][to]</route>'
													})
												}

												target[0].outputs.forEach((out) => {
													//console.log(out)

													Object.keys(tags).forEach((t) => {
														let tagXml = ''
														tags[t].forEach((x) => {
															tagXml += x
														})
														out.data = replaceAll(out.data, '[' + t + ']', tagXml)
													})
													out.file = replaceAll(out.file, '[INTID]', details.id)
													Object.keys(source).forEach((key) => {
														out.data = replaceAll(
															out.data,
															'[' + key + ']',
															source[key] ? source[key] : ''
														)
													})
													out.data = replaceAll(out.data, '[INTID]', details.id)
													out.data = replaceAll(out.data, '[ENV]', details.environment)

													out.data = formatXml(
														`<?xml version="1.0" encoding="UTF-8"?><routes xmlns="http://camel.apache.org/schema/spring">${out.data}</routes>`
													)
													output.push(out)
												})
											} else {
												throw { message: 'Palette not configured for this version' }
											}
										})
										// console.log(source)
										// console.log(tags)
										//console.log('output', output)
										ApiResult(res, null, output)
									} catch (error) {
										console.log(error)
										ApiResult(res, {
											message: error.message ? error.message : 'Error formatting integration.'
										})
									}
								} else {
									ApiResult(res, { message: 'Error fetching format configuration.' })
								}
							}
						})
					}
				}
			})
		}
	})
})

Mongo.post('/delete', (req, res) => {
	//ApiResult(res,null,req.body.version)
	let { version, details, template } = req.body
	mongodb.getConfig(version, (err, formatConfig) => {
		if (err) {
			ApiResult(res, err)
		} else {
			if (formatConfig && formatConfig.length > 0) {
				let output = []
				try {
					template.palettes.forEach((route) => {
						let target = formatConfig.filter((p) => p.palette._id.equals(route._id))
						//console.log(target)
						if (target && target.length > 0) {
							target[0].outputs.forEach((out) => {
								let file = replaceAll(out.file, '[INTID]', details.id)
								if (!output.includes(file)) {
									output.push(file)
								}
							})
						} else {
							//throw {message: "Palette not configured for this version"}
						}
					})
					ApiResult(res, null, output)
				} catch (error) {
					console.log(error)
					ApiResult(res, { message: error.message ? error.message : 'Error formatting integration.' })
				}
			} else {
				ApiResult(res, { message: 'Error fetching format configuration.' })
			}
		}
	})
})

const replaceAll = (source, inText, outText) => {
	inText = inText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	return source.replace(new RegExp(inText, 'g'), outText)
}

const formatXml = function (xml) {
	var reg = /(>)\s*(<)(\/*)/g // updated Mar 30, 2015
	var wsExp = / *(.*) +\n/g
	var contExp = /(<.+>)(.+\n)/g
	xml = xml.replace(reg, '$1\n$2$3').replace(wsExp, '$1\n').replace(contExp, '$1\n$2')
	//var pad = 0;
	var formatted = ''
	var lines = xml.split('\n')
	var indent = 0
	var lastType = 'other'
	// 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions
	var transitions = {
		'single->single': 0,
		'single->closing': -1,
		'single->opening': 0,
		'single->other': 0,
		'closing->single': 0,
		'closing->closing': -1,
		'closing->opening': 0,
		'closing->other': 0,
		'opening->single': 1,
		'opening->closing': 0,
		'opening->opening': 1,
		'opening->other': 1,
		'other->single': 0,
		'other->closing': -1,
		'other->opening': 0,
		'other->other': 0
	}

	for (var i = 0; i < lines.length; i++) {
		var ln = lines[i]

		// 2017-07-03: handle optional <?xml ... ?> declaration
		if (ln.match(/\s*<\?xml/)) {
			formatted += ln + '\n'
			continue
		}
		// ---
		var single = Boolean(ln.match(/<.+\/>/)) // is this line a single tag? ex. <br />
		var closing = Boolean(ln.match(/<\/.+>/)) // is this a closing tag? ex. </a>
		var opening = Boolean(ln.match(/<[^!].*>/)) // is this even a tag (that's not <!something>)
		var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other'
		var fromTo = lastType + '->' + type
		lastType = type
		var padding = ''

		indent += transitions[fromTo]
		for (var j = 0; j < indent; j++) {
			padding += '\t'
		}
		if (fromTo === 'opening->closing')
			formatted = formatted.substr(0, formatted.length - 1) + ln + '\n' // substr removes line break (\n) from prev loop
		else formatted += padding + ln + '\n'
	}

	return formatted
}

module.exports = Mongo
