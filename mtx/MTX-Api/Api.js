import express from 'express'
import ApiResult from './ApiResult'
import path from 'path'
import axios from 'axios'

import { options } from './config.json'

const fs = require('fs')

const route = express.Router()

const log = (message) => {
	//console.log('[' + new Date().toUTCString() + '] ' + message)
	console.log(message)
}

const formatName = (name) => {
	return name.trim().replace(new RegExp(' ', 'g'), '_') //.replace(new RegExp('.','g'),'_')
}
const fullPath = (name) => {
	return path.join(options.sharedPath, 'mtx_maps', name)
}
const projectDir = (project) => {
	let dir = fullPath(formatName(project))
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir)
	}
	return dir + '/'
}

route.get('/', (req, res) => {
	ApiResult(res, null, 'Welcome to MTX API')
})

route.get('/maps', (req, res) => {
	try {
		ApiResult(res, null, JSON.parse(fs.readFileSync(fullPath('maps.list'))))
	} catch (err) {
		ApiResult(res, err)
	}
})
route.get('/functions', (req, res) => {
	try {
		ApiResult(res, null, JSON.parse(fs.readFileSync(fullPath('functions.list'))))
	} catch (err) {
		ApiResult(res, err)
	}
})

route.post('/mapDetails', (req, res) => {
	//log(req.files.sourceFile)
	//log(req.files.targetFile)
	//log(req.body.info)
	var info = JSON.parse(req.body.info)
	if (!info.id || info.id === '') {
		var list = JSON.parse(fs.readFileSync(fullPath('maps.list')))
		if (list.filter((x) => x.name === formatName(info.name) + '.xml').length > 0) {
			ApiResult(res, 'A map with same name ' + info.name + ' already exists.')
			return
		}
	}
	try {
		//log(req.files.sourceFile.name)
		let mPath = projectDir(info.project)
		let sFile = formatName(req.files.sourceFile.name)
		let tFile = formatName(req.files.targetFile.name)
		fs.writeFileSync(mPath + sFile, req.files.sourceFile.data)
		fs.writeFileSync(mPath + tFile, req.files.targetFile.data)
		Promise.all([
			info.sourceType === 'XML' ? xsdToList(mPath + sFile) : jsonToList(mPath + sFile),
			info.targetType === 'XML' ? xsdToList(mPath + tFile) : jsonToList(mPath + tFile)
		])
			.then((lists) => {
				// var source = [],
				// 	target = []
				//children(source, '', '', Object.values(lists[0])[0]['xs:element'][0], 0)
				//children(target, '', '', Object.values(lists[1])[0]['xs:element'][0], 0)
				//log(source, target)
				ApiResult(res, null, { info, sFile, tFile, source: lists[0], target: lists[1] })
			})
			.catch((err) => ApiResult(res, err))
		//ApiResult(res, null, 'saved files')
	} catch (error) {
		log(error)
		ApiResult(res, 'Failed to process your request')
	}
})

route.get('/map/:project/:id', (req, res) => {
	try {
		let filepath = projectDir(req.params.project) + req.params.id + '.info'
		if (fs.existsSync(filepath)) {
			// let result = { details: JSON.parse(fs.readFileSync(filepath)) }
			// result.xml = fs.readFileSync(mPath + formatName(result.details.name) + '.xml', 'utf-8')
			// result.sFile = fs.readFileSync(mPath + result.details.sFile, 'utf-8')
			// result.tFile = fs.readFileSync(mPath + result.details.tFile, 'utf-8')
			ApiResult(res, null, JSON.parse(fs.readFileSync(filepath)))
		} else {
			ApiResult(res, 'Map not found')
		}
	} catch (error) {
		log(error)
		ApiResult(res, 'Failed to process your request')
	}
})
route.get('/file/:project/:id', (req, res) => {
	try {
		let filepath = projectDir(req.params.project) + req.params.id
		if (fs.existsSync(filepath)) {
			ApiResult(res, null, fs.readFileSync(filepath, { encoding: 'utf8' }))
		} else {
			ApiResult(res, 'File not found')
		}
	} catch (error) {
		log(error)
		ApiResult(res, 'Failed to process your request')
	}
})

const getClassName = (name) => {
	return name[0].toUpperCase() + name.substr(1, name.length - 1)
}

route.post('/map', (req, res) => {
	var info = req.body
	var mPath = projectDir(info.project)
	try {
		let target = mPath + formatName(info.name) + '.xml'
		let xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><jmapper>
		<configuration>
			<inoutformat>${info.sourceType.toLowerCase()}2${info.targetType.toLowerCase()}</inoutformat>
			<inputdefinition>${info.sFile}</inputdefinition>
			<outputdefinition>${info.tFile}</outputdefinition>
		</configuration>
		<AggregateFunctions>`
		info.targetFields.forEach((t) => {
			if (t.function) {
				xml += `<AggregateFunction><AggregateFunctionName>${t.function.name}</AggregateFunctionName>
					<input>${t.function.inputs.map(x => x.split(':')[1]).join(',')}</input>
					${ t.function.inputStatics && t.function.inputStatics.length > 0 
							? '<inputStatic>' + t.function.inputStatics.join(',') + '</inputStatic>' 
							: '<inputStatic></inputStatic>'
					} <output>${t.name}</output></AggregateFunction>`
			}
		})
				xml += `</AggregateFunctions>`
			
				xml += `<class name="output.${getClassName(info.targetFields[0].name)}$${getClassName(info.targetFields[1].name)}">` //${info.className}
					info.targetFields.forEach((t) => {
						if (t.function) 
							xml += `<attribute name="${t.name}"><value name="${t.name}"/></attribute>`
						else if (t.type && t.value && t.value !== '')
							xml += `<attribute name="${t.key}"><value name="${t.value ? t.value : ''}"/></attribute>`
					})
				xml += '</class></jmapper>'
				xml = formatXml(xml)
				fs.writeFileSync(target, xml)
				if (!info.id || info.id === '') {
					info.id = formatName(info.name)
					let list = JSON.parse(fs.readFileSync(fullPath('maps.list')))
					list.push({
						id: info.id,
						name: info.name,
						project: info.project,
						sType: info.sourceType,
						tType: info.targetType,
						sFile: info.sFile,
						tFile: info.tFile
					})
					fs.writeFileSync(fullPath('maps.list'), JSON.stringify(list, null, '\t'))
					log('NEW MAP')
				} else {
					log('UPDATE MAP')
				}
		fs.writeFileSync(mPath + info.id + '.info', JSON.stringify(info, null, '\t'))
		//log(info)
		// Rebuild classes
		var url = options.classUpdate
			.replace('<projectPath>', info.project)
			.replace('<inputDef>', info.sFile)
			.replace('<outputDef>', info.tFile)
			.replace('<isXML>', info.sourceType.toUpperCase())
		log(url)
		var fromServer = axios
			.post(url)
			.then((response) => {
				log(response)
				return response
			})
			.catch((error) => {
				log(error)
				return error
			})
		//log(fromServer)
		ApiResult(res, null, info)
	} catch (error) {
		log(error)
		ApiResult(res, 'Failed to process your request')
	}
})

const xsdToList = (filepath) => {
	return new Promise((resolve, reject) => {
		var xml2js = require('xml2js')

		var parser = new xml2js.Parser()
		fs.readFile(filepath, (err, data) => {
			if (err) {
				reject(err)
			} else {
				parser.parseString(data, (err, result) => {
					if (err) {
						reject(err)
					} else {
						let list = []
						xsdChildren(list, '', '', Object.values(result)[0]['xs:element'][0], 0)
						resolve(list)
					}
				})
			}
		})
	})
}
const xsdChildren = (list, parent, parentUp, node, level) => {
	Object.keys(node).forEach((key) => {
		switch (key) {
			case '$':
				if (level === 0) parentUp += ''
				else if (level === 1) parentUp += node[key].name
				else parentUp += '.' + node[key].name
				list.push({
					ind: list.length,
					parent: parent,
					parentUp: parentUp,
					name: node[key].name,
					type: node[key].type,
					level
				})
				if (level > 1) parent += node[key].name + '.'
				break
			case 'xs:complexType':
				node['xs:complexType'][0]['xs:sequence'][0]['xs:element'].forEach((ele) => {
					xsdChildren(list, parent, parentUp, ele, level + 1)
				})
				break
			default:
				log(key + ' cannot be processed')
				break
		}
	})
}

const jsonToList = (filepath) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, (err, data) => {
			if (err) {
				reject(err)
			} else {
				try {
					let result = JSON.parse(data)
					let list = []
					jsonChildren(list, '', '', result.required[0], result.properties[result.required[0]], 0)
					//log(list)
					resolve(list)
				} catch (error) {
					reject(error)
				}
			}
		})
	})
}
const jsonChildren = (list, parent, parentUp, nodeName, node, level) => {
	if (level === 0) parentUp = nodeName
	else parentUp += '.' + nodeName
	list.push({
		ind: list.length,
		parent: parent,
		parentUp: parentUp,
		name: nodeName,
		type: node.type === 'object' ? null : node.type,
		level
	})
	if (level > 0) parent += nodeName + '.'
	if (node.type === 'object') {
		Object.keys(node.properties).forEach((key) => {
			jsonChildren(list, parent, parentUp, key, node.properties[key], level + 1)
		})
	}
}

route.get('/elements', (req, res) => {
	Promise.all([
		xsdToList(path.join(options.sharedPath, 'mtx_maps', 'request.xsd')),
		xsdToList(path.join(options.sharedPath, 'mtx_maps', 'purchase.xsd'))
	])
		.then((lists) => {
			var source = [],
				target = []
			xsdChildren(source, '', '', Object.values(lists[0])[0]['xs:element'][0], false)
			xsdChildren(target, '', '', Object.values(lists[1])[0]['xs:element'][0], false)
			//log(source, target)
			ApiResult(res, null, { source, target })
		})
		.catch((err) => ApiResult(res, err))
})

// FORMAT XML WITH INDENTS
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

/// file manager
const readFileContent = (res, filename) => {
	try {
		let filepath = path.join(options.sharedPath, 'mtx_maps', filename)
		if (fs.existsSync(filepath)) {
			ApiResult(res, null, fs.readFileSync(filepath, { encoding: 'utf8' }))
		} else {
			ApiResult(res, 'File not available: ' + file)
		}
	} catch (error) {
		ApiResult(res, 'Filed to process your request')
	}
}
const writeFileContent = (res, filename, content) => {
	try {
		let filepath = path.join(options.sharedPath, 'mtx_maps', filename)
		fs.writeFileSync(filepath, content, { encoding: 'utf8' })
		ApiResult(res, null, true)
	} catch (error) {
		ApiResult(res, 'Filed to process your request')
	}
}
const deleteFile = (res, filename) => {
	try {
		if (fs.existsSync(path.join(options.sharedPath, 'mtx_maps', filename))) {
			fs.unlinkSync(path.join(options.sharedPath, 'mtx_maps', filename))
		}
		ApiResult(res, null, true)
	} catch (error) {
		log(error)
		ApiResult(res, error)
	}
}

module.exports = route
