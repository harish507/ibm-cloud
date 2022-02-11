import express, { request } from 'express'
import ApiResult from './ApiResult'
import mongodb from './mongodb'
import PublishService from './PublishService'
import AppConfigService from './AppConfigService'
import _ from 'lodash'
import Axios from 'axios'
import config from './config.json'
import fs from 'fs'
import path from 'path'

const Mongo = express.Router()

Mongo.get('/', (req, res) => {
	ApiResult(res, null, 'Welcome to Admin')
})

// MQ PROPERTIES
Mongo.get('/configuration', (req, res) => {
	PublishService.getFile('./properties/Properties.properties')
		.then((content) => {
			ApiResult(res, null, content)
		})
		.catch((error) => {
			ApiResult(res, error)
		})
})
Mongo.post('/configuration', (req, res) => {
	var content = ''
	req.body.properties.forEach((p) => (content += p[0] + '=' + p[1] + '\r\n'))
	PublishService.putFile('./properties/Properties.properties', content)
		.then((result) => {
			ApiResult(res, null, result)
		})
		.catch((error) => {
			console.log(error)
			ApiResult(res, error)
		})
})

// APPLICATION CONNECTIONS
Mongo.get('/applications', (req, res) => {
	AppConfigService.getApplications()
		.then((apps) => {
			ApiResult(res, null, apps)
		})
		.catch((err) => {
			ApiResult(res, err)
		})
})

const updateContextFile = (list) => {
	//console.log('START CAMEL CONTEXT FILE UPDATE')
	PublishService.getFile('resource/camel-context.xml')
		.then((txt) => {
			let start = -1
			//let end = 999999
			var lines = []
			txt.split('\n').forEach((line, ind) => {
				if (line.trim() === `<!-- Application MQ Details Start -->`) start = ind
				//if (line.trim() === `<!-- Application MQ Details End -->`) end = ind
				if (start === -1) {
					lines.push(line)
				}
			})
			//console.log('start : ' + start) //+ ' end : ' + end)
			lines.push(`<!-- Application MQ Details Start -->\n`)
			Object.values(list).forEach((item) => {
				//lines.push(item.name)
				lines.push('<!-- ' + item.name + ' MQ Details Start -->')
				if (item.connection === 'Default') {
					lines.push(
						'<bean id="' +
						_.startCase(_.camelCase(_.toLower(item.name))).replace(new RegExp(' ', 'g'), '') +
						'" class="org.apache.camel.component.jms.JmsComponent"><property name="connectionFactory" ref="${MQ.Creds}" /></bean>'
					)
				} else {
					lines.push(
						'<bean id="' +
						item.connection +
						'" class="org.apache.camel.component.jms.JmsComponent"><property name="connectionFactory" ref="' +
						item.connection +
						'Creds" /></bean>'
					)
					lines.push(
						'<bean id="' +
						item.connection +
						'Creds" class="org.springframework.jms.connection.UserCredentialsConnectionFactoryAdapter"><property name="targetConnectionFactory" ref="' +
						item.connection +
						'Factory" /><property name="username" value="' +
						item.username +
						'" /><property name="password" value="' +
						item.password +
						'" /></bean>'
					)
					if (item.type === 'AMQ') {
						lines.push(
							'<bean id="' +
							item.connection +
							'Factory" class="org.apache.activemq.ActiveMQConnectionFactory"><property name="brokerURL" value="' +
							item.amqUrl +
							'" /></bean>'
						)
					}
					if (item.type === 'WMQ') {
						lines.push(
							'<bean id="' +
							item.connection +
							'Factory" class="com.ibm.mq.jms.MQConnectionFactory"><property name="hostName" value="' +
							item.wmqHost +
							'" /><property name="port" value="' +
							item.wmqPort +
							'" /><property name="queueManager" value="' +
							item.wmqQueMgr +
							'" /><property name="channel" value="' +
							item.wmqChannel +
							'" /><property name="transportType" value="1" /></bean>'
						)
					}
				}
				lines.push('<!-- ' + item.name + ' MQ Details End -->\n')
			})
			lines.push(`<!-- Application MQ Details End -->\n`)
			lines.push('</beans>')
			console.log('CAMEL CONTEXT FILE UPDATE COMPLETE')
			PublishService.putFile('resource/camel-context.xml', lines.join('\n'))
		})
		.catch((err) => {
			console.log('ERROR CAMEL CONTEXT FILE UPDATE')
			console.log(err)
		})
}

Mongo.post('/applications', (req, res) => {

	mongodb.getMasters((err, results) => {
		if (err) {
			ApiResult(res, err)
		} else {
			//console.log(results)
			let apps = results.filter((x) => x.type === 'applications')[0]
			//console.log(apps)
			//console.log({ list: [ ...apps.list, req.body.name ], type: apps.type, format: apps.format })
			let list = [...apps.list]
			if (!list.includes(req.body.name)) list.push(req.body.name)
			mongodb.updateMaster(apps._id, { list: list, type: apps.type, format: apps.format }, (err, result) => {
				if (err) {
					console.log(err)
					ApiResult(res, err)
				} else {
					AppConfigService.saveApplication(req.body)
						.then((result) => {
							if (result) {
								AppConfigService.getApplications()
									.then((apps) => {
										// if (apps & apps.length)
										//updateContextFile(apps)
										ApiResult(res, null, 'Configuration saved successfully.')
										Axios.post(
											config.services.publish + '/pgpFiles',
											req.body, {
											headers: { 'Content-Type': 'application/json' }
										}
										)
									})
									.catch((err) => {
										ApiResult(res, err)
									})
							} else {
								ApiResult(res, 'Failed to update application configuration.')
							}
						})
						.catch((err) => {
							console.log(err)
							ApiResult(res, err)
						})
				}
			})
		}
	})
})


Mongo.delete('/applications/:id', (req, res) => {
	//console.log(req.params.id)
	Axios.post(
		config.services.integrations + '/find',
		{ $or: [{ source: req.params.id }, { target: req.params.id }] },
		{
			headers: { 'Content-Type': 'application/json' }
		}
	)
		.then((result) => {
			if (result.data && result.data.Success) {
				//console.log(result.data.Result)
				if (result.data.Result.length > 0) {
					ApiResult(res, 'Cannot delete this Application, because some integrations are configured with it.')
				} else {
					mongodb.getMasters((err, results) => {
						if (err) {
							ApiResult(res, err)
						} else {
							//console.log(results)
							let apps = results.filter((x) => x.type === 'applications')[0]
							//console.log({ list: [ ...apps.list, req.body.name ], type: apps.type, format: apps.format })
							let list = apps.list.filter((x) => x !== req.params.id)
							mongodb.updateMaster(
								apps._id,
								{ list: [...list], type: apps.type, format: apps.format },
								(err, result) => {
									if (err) {
										console.log(err)
										ApiResult(res, err)
									} else {
										//console.log(result)
										AppConfigService.deleteApplication(req.params.id)
											.then((result) => {
												if (result) {
													AppConfigService.getApplications()
														.then((apps) => {
															// if (apps & apps.length)
															//updateContextFile(apps)
															ApiResult(res, null, 'Configuration deleted successfully.')
														})
														.catch((err) => {
															ApiResult(res, err)
														})
												} else {
													ApiResult(res, 'Failed to delete application configuration.')
												}
											})
											.catch((err) => {
												console.log(err)
												ApiResult(res, err)
											})
									}
								}
							)
						}
					})
				}
			} else {
				ApiResult(res, result.data.Message)
			}
		})
		.catch((err) => {
			ApiResult(res, err)
		})
})

module.exports = Mongo
