import Axios from 'axios'
import https from 'https'
import mongodb from './mongodb'

const instance = Axios.create({
	httpsAgent: new https.Agent({
		rejectUnauthorized: false
	})
})

const headers = {
	'ibm-mq-rest-csrf-token': 'value',
	'Content-Type': 'application/json'
}

const IbmMqService = {
	getVersionConfig: (version) => {
		return new Promise((resolve, reject) => {
			mongodb.getIbmMqConfig(version, (err, result) => {
				if (err) {
					reject(err)
				} else {
					resolve(result)
				}
			})
		})
	},
	setVersionConfig: (data) => {
		return new Promise((resolve, reject) => {
			if (data._id) {
				mongodb.updateIbmMqConfig(data._id, data, (err, result) => {
					if (err) {
						reject(err)
					} else {
						resolve(result)
					}
				})
			} else {
				mongodb.saveIbmMqConfig(data, (err, result) => {
					if (err) {
						reject(err)
					} else {
						resolve(result)
					}
				})
			}
		})
	},
	verifyQueue: (version, manager, name) => {
		return new Promise((resolve, reject) => {
			mongodb.getIbmMqConfig(version, (err, result) => {
				if (err) {
					reject(err)
				} else {
					let config = result.configuration
					instance
						.get(
							config.url +
								config.path +
								'/qmgr/' +
								(manager ? manager : config.queueManager) +
								'/queue/' +
								name,
							{
								headers,
								auth: {
									username: config.username,
									password: config.password
								}
							}
						)
						.then((output) => {
							console.log('QUEUE GET: ', output.data)
							resolve(output.data.queue)
						})
						.catch((error) => {
							if (error.response && error.response.status && error.response.status === 404) {
								console.log('QUEUE NOT EXISTS: ' + name)
								resolve([])
							} else {
								console.log('QUEUE ERROR', error)
								if (error.response) {
									reject(error.response.status + ' ' + error.response.statusText)
								} else {
									reject(error)
								}
							}
						})
				}
			})
		})
	},
	createQueue: (version, manager, name) => {
		return new Promise((resolve, reject) => {
			mongodb.getIbmMqConfig(version, (err, result) => {
				if (err) {
					reject(err)
				} else {
					let config = result.configuration
					instance
						.post(
							config.url + config.path + '/qmgr/' + (manager ? manager : config.queueManager) + '/queue',
							{ name },
							{
								headers,
								auth: {
									username: config.username,
									password: config.password
								}
							}
						)
						.then((result) => {
							console.log('QUEUE CREATED: ' + name)
							resolve(result.data)
						})
						.catch((error) => {
							console.log('QUEUE ERROR', error)
							if (error.response) {
								reject(error.response.status + ' ' + error.response.statusText)
							} else {
								reject(error)
							}
						})
				}
			})
		})
	},
	deleteQueue: (version, manager, name) => {
		return new Promise((resolve, reject) => {
			mongodb.getIbmMqConfig(version, (err, result) => {
				if (err) {
					reject(err)
				} else {
					//console.log(result)
					let config = result.configuration
					instance
						.delete(
							config.url +
								config.path +
								'/qmgr/' +
								(manager ? manager : config.queueManager) +
								'/queue/' +
								name +
								'?purge',
							{
								headers,
								auth: {
									username: config.username,
									password: config.password
								}
							}
						)
						.then((result) => {
							console.log('QUEUE DELETED: ' + name)
							resolve(result.data)
						})
						.catch((error) => {
							console.log('QUEUE ERROR', error)
							if (error.response) {
								reject(error.response.status + ' ' + error.response.statusText)
							} else {
								reject(error)
							}
						})
				}
			})
		})
	}
}
module.exports = IbmMqService
