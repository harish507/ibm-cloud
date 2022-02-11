import express from 'express'
import mongodb from './mongodb'
import ApiResult from './ApiResult'
import FormatService from './FormatService'
import PublishService from './PublishService'
import IbmMqService from './IbmMqService'
import TestingService from './TestingService'
import AppConfigService from './AppConfigService'
import Axios from 'axios'
import WebPortalService from './WebPortalService'
import SubscriptionService from './SubscriptionService'

import models from './mongodb/models'
import config from './config.json'

const Mongo = express.Router()

Mongo.get('/', (req, res) => {
	res.send('/gateway api test')
})
Mongo.get('/routeTypes', (req, res) => {
	mongodb.getRouteTypes((err, result) => ApiResult(res, err, result))
})

Mongo.get('/exportDb', (req, res) => {
	let pros = []
	Object.keys(models).forEach((mod) => {
		pros.push(
			new Promise((resolve, reject) => {
				mongodb.get(mod, (err, info) => {
					if (err) {
						resolve(err)
					} else {
						Axios.post(
							config.services.publish + '/file?file=db/' + mod + '.json',
							{ info: JSON.stringify(info) },
							{
								headers: { 'Content-Type': 'application/json' }
							}
						)
							.then((result) => {
								if (result.data && result.data.Success) {
									resolve(mod + ' : ' + result.data.Result)
								} else {
									resolve(result.data.Message)
								}
							})
							.catch((err) => {
								resolve(err)
							})
					}
				})
			})
		)
	})
	Promise.all(pros)
		.then((results) => {
			res.status(200).json(results)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
})
Mongo.get('/importDb', (req, res) => {
	let pros = []
	Object.keys(models).forEach((mod) => {
		pros.push(
			new Promise((resolve, reject) => {
				PublishService.getFile('db/' + mod + '.json')
					.then((content) => {
						mongodb.delete(mod, (err, info) => {
							if (err) {
								resolve(err)
							} else {
								mongodb.post(mod, JSON.parse(content), (err, result) => {
									if (err) {
										resolve(mod + ' : ' + err)
									} else {
										resolve(mod + ' : ' + result)
									}
								})
							}
						})
					})
					.catch((error) => {
						resolve(mod + ' : ' + error)
					})
			})
		)
	})
	Promise.all(pros)
		.then((results) => {
			res.status(200).json(results)
		})
		.catch((err) => {
			res.status(500).json(err)
		})
})

Mongo.get('/db/:collection', (req, res) => {
	mongodb.get(req.params.collection, (err, result) => {
		if (err) {
			res.status(500).json(err)
		} else {
			res.status(200).json(result)
		}
	})
})
Mongo.post('/db/:collection', (req, res) => {
	mongodb.post(req.params.collection, req.body, (err, result) => {
		if (err) {
			res.status(500).json(err)
		} else {
			res.status(200).json(result)
		}
	})
})
Mongo.delete('/db/:collection', (req, res) => {
	mongodb.delete(req.params.collection, (err, result) => {
		if (err) {
			res.status(500).json(err)
		} else {
			res.status(200).json(result)
		}
	})
})

Mongo.get('/masters', (req, res) => {
	mongodb.getMasters((err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			var masters = {}
			result.forEach((master) => {
				masters[master.type] = master.list
			})
			ApiResult(res, err, masters)
		}
	})
})
Mongo.get('/masters/all', (req, res) => {
	getAllMasters(res)
})
const getAllMasters = (res) => {
	mongodb.getMasters((err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			var masters = {}
			result.forEach((master) => {
				masters[master.type] = master
			})
			ApiResult(res, err, masters)
		}
	})
}
Mongo.get('/masters/:type', (req, res) => {
	mongodb.getMaster(req.params.type, (err, result) => ApiResult(res, err, result))
})
Mongo.put('/masters/:id', (req, res) => {
	mongodb.updateMaster(req.params.id, req.body, (err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			ApiResult(res, null, true)
			//mongodb.getPaletteById(req.body.typeId, (err,result) => ApiResult(res,err,result.length ? result[0]: null) )
		}
	})
})

Mongo.get('/defaults', (req, res) => {
	mongodb.getDefaults((err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			var defaults = {}
			result.forEach((data) => (defaults[data.environment] = { ...data.defaultValues, _id: data._id }))
			ApiResult(res, err, defaults)
		}
	})
})
Mongo.get('/defaults/:env', (req, res) => {
	mongodb.getDefaultsByEnv(req.params.env, (err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			if (result && result.length === 1) {
				ApiResult(res, err, { ...result[0].defaultValues, _id: result[0]._id })
			} else {
				ApiResult(res, { message: 'No defaults specified for ' + req.params.env })
			}
		}
	})
})
Mongo.put('/defaults/:id', (req, res) => {
	mongodb.updateDefaults(req.params.id, req.body, (err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			ApiResult(res, null, true)
			//mongodb.getPaletteById(req.body.typeId, (err,result) => ApiResult(res,err,result.length ? result[0]: null) )
		}
	})
})

Mongo.get('/applications', (req, res) => {
	Promise.all([ PublishService.getFile('./properties/Properties.properties'), AppConfigService.getApplications() ])
		.then(([ content, apps ]) => {
			//console.log(content, apps)
			var def = { name: 'Default', connection: 'Default' }
			content.split('\r\n').forEach((con) => {
				var [ key, value ] = con.split('=')
				if (key === 'MQ.Creds') def.type = value.substring(0, 3).toUpperCase()
				if (key === 'MQConnection.Host') def.wmqHost = value
				if (key === 'MQConnection.QMGR') def.wmqQueMgr = value
				if (key === 'MQConnection.Channel') def.wmqChannel = value
				if (key === 'MQConnection.Port') def.wmqPort = value
				if (key === 'AMQConnection.url') def.amqUrl = value
			})
			apps.Default = def
			ApiResult(res, null, apps)
		})
		.catch((error) => {
			ApiResult(res, error)
		})
})

Mongo.get('/services', (req, res) => {
	mongodb.getServices((err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			if (result && result.length > 0) {
				// ApiResult(res,err,result)
				ApiResult(res, err, {
					format: result.filter((s) => s.type === 'format'),
					publish: result.filter((s) => s.type === 'publish'),
					ibmMq: result.filter((s) => s.type === 'ibmMq'),
					designer: result.filter((s) => s.type === 'designer'),
					testing: result.filter((s) => s.type === 'testing')
				})
			} else {
				ApiResult(res, { message: 'No services specified.' })
			}
		}
	})
})
Mongo.post('/services', (req, res) => {
	let error = null
	let updates = []
	req.body.forEach((service) => {
		const id = service._id
		let item = { ...service }
		delete item._id
		updates.push(
			new Promise((resolve, reject) => {
				mongodb.updateService(id, item, (err, result) => {
					if (err) {
						error = err
					} else {
						if (result) {
							//console.log(result)
							resolve(result)
						} else {
							error = { message: 'Failed to update a service.' }
						}
						reject(error)
					}
				})
			})
		)
	})
	Promise.all(updates)
		.then((_results) => {
			//console.log('done')
			ApiResult(res, error, true)
		})
		.catch((err) => ApiResult(res, err))
})
Mongo.get('/services/active', (req, res) => {
	mongodb.getServices((err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			if (result && result.length > 0) {
				// ApiResult(res,err,result)
				ApiResult(res, err, {
					format: result.filter((s) => s.type === 'format' && s.active === true),
					publish: result.filter((s) => s.type === 'publish' && s.active === true)
				})
			} else {
				ApiResult(res, { message: 'No services specified.' })
			}
		}
	})
})
Mongo.get('/publishConfig/:version', (req, res) => {
	mongodb.getMaster('environments', (err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			let config = {}
			result.forEach((env) => (config[env] = {}))
			PublishService.getVersionConfig(req.params.version)
				.then((infos) => {
					infos.forEach((info) => (config[info.environment] = info))
					ApiResult(res, null, config)
				})
				.catch((error) => {
					ApiResult(res, error)
				})
		}
	})
})
Mongo.post('/publishConfig', (req, res) => {
	PublishService.setVersionConfig(req.body)
		.then((result) => {
			ApiResult(res, null, result)
		})
		.catch((error) => {
			ApiResult(res, error)
		})
})
Mongo.get('/formatConfig/:version', (req, res) => {
	FormatService.getVersionConfig(req.params.version)
		.then((config) => {
			ApiResult(res, null, config)
		})
		.catch((error) => {
			ApiResult(res, error)
		})
})
Mongo.post('/formatConfig', (req, res) => {
	FormatService.setVersionConfig(req.body)
		.then((result) => {
			ApiResult(res, null, result)
		})
		.catch((error) => {
			ApiResult(res, error)
		})
})

const verifyAndCreateQueues = (version, tmp) => {
	console.log('VERIFY & CREATE QUEUES')
	tmp.palettes.forEach((palette) => {
		palette.properties.forEach((prop) => {
			if (prop.type === 'queue' || prop.key === 'InletQueue' || prop.key === 'OutletQueue') {
				console.log('verify: ' + prop.value)
				IbmMqService.verifyQueue(version, null, prop.value)
					.then((result) => {
						if (result.length > 0) {
							//console.log(prop.value + ' exists')
						} else {
							//console.log(prop.value + ' not exists')
							IbmMqService.createQueue(version, null, prop.value)
								.then((result) => {
									// console.log(prop.value + ' ' + result)
								})
								.catch((error) => {
									//console.log(prop.value + ' ' + error)
									throw error
								})
						}
					})
					.catch((error) => {
						console.log(error)
					})
			}
		})
	})
}
Mongo.post('/buildAndDeploy', (req, res) => {
	// ApiResult(res,null,req.body)
	FormatService.format(req.body.format.version, req.body.details, req.body.template)
		.then((formattedData) => {
			//updateContextFile(req.body.template, req.body.details)
			//ApiResult(res, formattedData)

			verifyAndCreateQueues(req.body.format.version, req.body.template)
			PublishService.publish(
				req.body.publish.version,
				req.body.details.environment,
				req.body.details.id,
				formattedData
			)
				.then((status) => {
					ApiResult(res, null, status)
				})
				.catch((error) => {
					ApiResult(res, error)
				})
		})
		.catch((error) => {
			console.log(error)
			ApiResult(res, error)
		})
})
Mongo.post('/UnDeployAndDelete', (req, res) => {
	//ApiResult(res,null,req.body)
	FormatService.delete(req.body.format.version, req.body.details, req.body.template)
		.then((formattedData) => {
			//ApiResult(res,null, formattedData)
			if (formattedData.length > 0) {
				PublishService.unPublish(
					req.body.publish.version,
					req.body.details.environment,
					req.body.details.id,
					formattedData
				)
					.then((status) => {
						//ApiResult(res,null, status)
						deleteIntegration(res, req.body.details)
					})
					.catch((error) => {
						ApiResult(res, error)
					})
			} else {
				deleteIntegration(res, req.body.details)
			}
		})
		.catch((error) => {
			console.log(error)
			ApiResult(res, error)
		})
})

const getIntegration = (id) => {
	return new Promise((resolve, reject) => {
		Axios.get(config.services.integrations + '/' + id, null, {
			headers: { 'Content-Type': 'application/json' }
		})
			.then((result) => {
				if (result.data && result.data.Success) {
					resolve(result.data.Result)
				} else {
					reject(result.data.Message)
				}
			})
			.catch((err) => {
				reject(err)
			})
	})
}
const deleteIntegration = (res, details) => {
	Axios.delete(config.services.integrations + '/' + details._id, null, {
		headers: { 'Content-Type': 'application/json' }
	})
		.then((result) => {
			if (result.data && result.data.Success) {
				ApiResult(res, null, `Integration ${details.id} deleted successfully.`)
			} else {
				ApiResult(res, result.data.Message)
			}
		})
		.catch((err) => {
			ApiResult(res, err)
		})
}

Mongo.get('/ibmMqConfig/:version', (req, res) => {
	IbmMqService.getVersionConfig(req.params.version)
		.then((infos) => {
			ApiResult(res, null, infos)
		})
		.catch((error) => {
			ApiResult(res, error)
		})
})
Mongo.post('/ibmMqConfig', (req, res) => {
	IbmMqService.setVersionConfig(req.body)
		.then((status) => {
			ApiResult(res, null, status)
		})
		.catch((error) => {
			ApiResult(res, error)
		})
})

Mongo.get('/ibmMqService/:version/:manager/:queue', (req, res) => {
	IbmMqService.verifyQueue(req.params.version, req.params.manager, req.params.queue)
		.then((status) => {
			ApiResult(res, null, status)
		})
		.catch((error) => {
			ApiResult(res, error)
		})
})
Mongo.post('/ibmMqService/:version/:manager/:queue', (req, res) => {
	IbmMqService.createQueue(req.params.version, req.params.manager, req.params.queue)
		.then((status) => {
			ApiResult(res, null, status)
		})
		.catch((error) => {
			ApiResult(res, error)
		})
})
Mongo.delete('/ibmMqService/:version/:manager/:queue', (req, res) => {
	IbmMqService.deleteQueue(req.params.version, req.params.manager, req.params.queue)
		.then((status) => {
			ApiResult(res, null, status)
		})
		.catch((error) => {
			ApiResult(res, error)
		})
})

Mongo.get('/file', (req, res) => {
	PublishService.getFile(req.query.file)
		.then((content) => {
			ApiResult(res, null, content)
		})
		.catch((error) => {
			ApiResult(res, error)
		})
})
Mongo.get('/files', (req, res) => {
	PublishService.getFiles()
		.then((files) => {
			ApiResult(res, null, files)
		})
		.catch((error) => {
			ApiResult(res, error)
		})
})
Mongo.get('/filesAndFolders', (req, res) => {
	PublishService.getFilesAndFolders(req.query.path)
		.then((info) => {
			ApiResult(res, null, info)
		})
		.catch((error) => {
			ApiResult(res, error)
		})
})
Mongo.post('/files', (req, res) => {
	//console.log(req.files.file)
	//console.log(req.body.info)
	PublishService.postFile(req.body.info, req.files.file.data)
		.then((result) => {
			ApiResult(res, null, result)
		})
		.catch((error) => {
			console.log(error)
			ApiResult(res, error)
		})
})
Mongo.post('/deleteFile', (req, res) => {
	PublishService.deleteFile(req.body)
		.then((result) => {
			ApiResult(res, null, result)
		})
		.catch((error) => {
			console.log(error)
			ApiResult(res, error)
		})
})
Mongo.post('/viewFile', (req, res) => {
	PublishService.viewFile(req.body)
		.then((result) => {
			ApiResult(res, null, result)
		})
		.catch((error) => {
			console.log(error)
			ApiResult(res, error)
		})
})

Mongo.get('/integrationTest/:id', (req, res) => {
	if (req.params.id === undefined) {
		ApiResult(res, 'Please provide a valid integration ID')
	} else {
		getIntegration(req.params.id)
			.then((integration) => {
				if (integration === null) {
					ApiResult(res, 'Please provide a valid integration ID', {})
				} else {
					mongodb.getServices((err, result) => {
						if (err) {
							ApiResult(res, err)
						} else {
							if (result && result.length > 0) {
								ApiResult(res, err, {
									integration,
									services: result.filter((s) => s.type === 'testing')
								})
							} else {
								ApiResult(res, { message: 'No Integration test service configured.' })
							}
						}
					})
				}
			})
			.catch((error) => {
				ApiResult(res, error, {})
			})
	}
})

Mongo.get('/testTemplates/:id', (req, res) => {
	if (req.params.id === undefined) {
		ApiResult(res, 'Please provide a valid integration ID')
	} else {
		getIntegration(req.params.id)
			.then((integration) => {
				if (integration === null) {
					ApiResult(res, 'Please provide a valid integration ID', {})
				} else {
					TestingService.getTemplateDetails(integration.template.id)
						.then((testTemplate) => {
							mongodb.getDefaults((err, defaults) => {
								if (err) {
									ApiResult(res, err)
								} else {
									mongodb.getServicesOfType('testing', (error, services) => {
										ApiResult(res, error, {
											integration,
											testTemplate,
											services,
											defaults: defaults[0].defaultValues
										})
									})
								}
							})
						})
						.catch((error) => {
							ApiResult(res, error, { integration })
							//ApiResult(res, 'No test template available for this integration template.', { integration })
						})
				}
			})
			.catch((error) => {
				ApiResult(res, error, {})
			})
	}
})

const deleteTestCase = (id, files) => {
	let tasks = [ TestingService.deleteTestFile(id + '.feature') ]
	Object.values(files).forEach((file) => {
		tasks.push(TestingService.deleteTestFile(file.name))
	})

	setTimeout(() => {
		Promise.all(tasks)
			.then((messages) => {
				console.log(messages)
			})
			.catch((err) => console.log(err))
	}, 1000)
}

Mongo.post('/testCase', (req, res) => {
	if (req.body === null) {
		ApiResult(res, 'Please provide a valid test case info')
	} else {
		var body = JSON.parse(req.body.info)
		//console.log(body)
		//console.log(Object.values(req.files).length)
		let target = { id: Date.now(), info: body.target }
		//ApiResult(res, null, target)
		TestingService.formatTestCase(target)
			.then((info) => {
				let tasks = [ TestingService.saveTestCase(target.id, info) ]
				Object.values(req.files).forEach((file) => {
					tasks.push(TestingService.saveTestInputFile(target.id, file))
				})
				//console.log(tasks.length)
				Promise.all(tasks)
					.then((messages) => {
						//console.log(body.service.url.replace('<ID>', target.id))
						//ApiResult(res, null, { message: messages[0] })

						Axios.get(body.service.url.replace('<ID>', target.id))
							.then((response) => {
								let report = '<html><body><table id="report-summary">'
								report += response.data.split('<table id="report-summary">')[1]
								ApiResult(res, null, { message: messages[0], response: report })
								deleteTestCase(target.id, req.files)
							})
							.catch((err) => {
								deleteTestCase(target.id, req.files)
								console.log(err)
								ApiResult(res, { message: 'Test execution failed with error \n' + err })
							})

						// Axios.get(config.services.publish + '/file?file=./reports/citrus-test-results.html')
						// 	.then((response) => {
						// 		let report = '<html><body><table id="report-summary">'
						// 		//response.data.Result.split('<div id="report-content">')[0]
						// 		//report += '<div id="report-content"><table id="report-summary">'
						// 		report += response.data.Result.split('<table id="report-summary">')[1]
						// 		ApiResult(res, null, { message: messages[0], response: report })
						// 	})
						// 	.catch((err) => {
						// 		console.log(err)
						// 		ApiResult(res, { message: 'Test execution failed with error \n' + err })
						// 	})
					})
					.catch((err) => {
						ApiResult(res, err)
					})
			})
			.catch((error) => {
				ApiResult(res, error)
			})
	}
})
//Service Api
Mongo.get('/allServices', (req, res) => {
	mongodb.getServices((err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			if (result && result.length > 0) {
				ApiResult(res, err, result)
			} else {
				ApiResult(res, { message: 'No services specified.' })
			}
		}
	})
})
Mongo.post('/allServices', (req, res) => {
	mongodb.saveService(req.body, (err, result) => ApiResult(res, err, result))
})
Mongo.put('/allServices/:id', (req, res) => {
	mongodb.updateService(req.params.id, req.body, (err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			ApiResult(res, null, true)
		}
	})
})

Mongo.get('/userExits', (req, res) => {
	PublishService.viewFile({ path: '/properties', filename: 'UserExits.json' })
		.then((result) => {
			ApiResult(res, null, JSON.parse(result))
		})
		.catch((error) => {
			console.log(error)
			ApiResult(res, error)
		})
})
Mongo.post('/editFile', (req, res) => {
	PublishService.editFile(req.body)
		.then((result) => {
			ApiResult(res, null, result)
		})
		.catch((error) => {
			console.log(error)
			ApiResult(res, error)
		})
})
Mongo.post('/createFolder', (req, res) => {
	PublishService.createFolder(req.body)
		.then((result) => {
			ApiResult(res, null, result)
		})
		.catch((error) => {
			console.log(error)
			ApiResult(res, error)
		})
})
Mongo.post('/deleteFolder', (req, res) => {
	PublishService.deleteFolder(req.body)
		.then((result) => {
			ApiResult(res, null, result)
		})
		.catch((error) => {
			console.log(error)
			ApiResult(res, error)
		})
})
Mongo.get('/orgDetails', (req, res) => {
	WebPortalService.getOrganizationDetails()
	.then((result) => {
		ApiResult(res, null, result)
	})
	.catch((error) => {
		console.log(error)
		ApiResult(res, error)
	})
})
Mongo.post('/verifyActivation', (req, res) => {
	WebPortalService.verifyActivationKey(req.body)
	.then((result) => {
		ApiResult(res, null, result)
	})
	.catch((error) => {
		console.log(error)
		ApiResult(res, error)
	})
})
Mongo.post('/register', (req, res) => {
	WebPortalService.register(req.body)
		.then((result) => {
			mongodb.register(result, (err, result) =>
			 ApiResult(res, err, result))})
		.catch((error) => {
			console.log(error)
			ApiResult(res, error)
		})
})
Mongo.post('/activate', (req, res) => {
	WebPortalService.activate(req.body)
		.then((result) => {
			ApiResult(res, null, result)
		})
		.catch((error) => {
			console.log(error)
			ApiResult(res, error)
		})
})
Mongo.post('/login', (req, res) => {
	WebPortalService.login(req.body)
		.then((result) => {
			ApiResult(res, null, result)
		})
		.catch((error) => {
			console.log(error)
			ApiResult(res, error)
		})
})
Mongo.get('/subscriptionLists', (req, res) => {
	AppConfigService.getApplications().then(apps => {
		SubscriptionService.getAllLists()
		.then((result) => {
			result.applications = Object.values(apps)
			ApiResult(res, null, result)
		})
	})
	.catch((error) => {
		console.log(error)
		ApiResult(res, error)
	})
})

Mongo.post('/publishers', (req, res) => {
	SubscriptionService.savePublisher(req.body)
	.then((result) => {
		ApiResult(res, null, result)
	})
	.catch((error) => {
		console.log(error)
		ApiResult(res, error)
	})
})
Mongo.put('/publishers/:id', (req, res) => {
	SubscriptionService.updatePublisher(req.params.id,req.body)
	.then((result) => {
		ApiResult(res, null, result)
	})
	.catch((error) => {
		console.log(error)
		ApiResult(res, error)
	})
})
Mongo.delete('/publishers/:id', (req, res) => {
	SubscriptionService.getSubscriptionServices().then((subs) => {
		if (subs.filter(s => s.publisher._id == req.params.id ).length === 0) {
			SubscriptionService.deletePublisher(req.params.id,req.body)
			.then((result) => {
				ApiResult(res, null, result)
			})
			.catch((error) => {
				console.log(error)
				ApiResult(res, error)
			})
		} else {
			ApiResult(res,'Services already exist for Publisher. Please delete them first.')
		}
	})
})

Mongo.post('/subscribers', (req, res) => {
	SubscriptionService.saveSubscriber(req.body)
	.then((result) => {
		ApiResult(res, null, result)
	})
	.catch((error) => {
		console.log(error)
		ApiResult(res, error)
	})
})
Mongo.put('/subscribers/:id', (req, res) => {
	SubscriptionService.updateSubscriber(req.params.id,req.body)
	.then((result) => {
		ApiResult(res, null, result)
	})
	.catch((error) => {
		console.log(error)
		ApiResult(res, error)
	})
})
Mongo.delete('/subscribers/:id', (req, res) => {
	SubscriptionService.getSubscriptions().then((subs) => {
		if (subs.filter(s => s.subscriber._id == req.params.id ).length === 0) {
			SubscriptionService.deleteSubscriber(req.params.id)
			.then((result) => {
				ApiResult(res, null, result)
			})
			.catch((error) => {
				console.log(error)
				ApiResult(res, error)
			})
		} else {
			ApiResult(res,'Subscriptions already exist for Subscriber. Please delete them first.')
		}
	})
})

Mongo.post('/saveSubscriptionService', (req, res) => {
	SubscriptionService.saveSubscriptionService(req.body.info, req.files.file)
	.then((result) => {
		ApiResult(res, null, result)
	})
	.catch((error) => {
		console.log(error)
		ApiResult(res, error)
	})
})

module.exports = Mongo
