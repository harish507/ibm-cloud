import express from 'express'
import mongodb from './mongodb'
import ApiResult from './ApiResult'

const Mongo = express.Router()

Mongo.get('/', (req, res) => {
	ApiResult(res, null, '/integrations api test')
})
Mongo.get('/integrations', (req, res) => {
	mongodb.getIntegrations((err, result) => ApiResult(res, err, result))
})
Mongo.get('/nextIntegrationId', (req, res) => {
	getNextIntegrationId().then((result) => ApiResult(res, null, result)).catch((err) => ApiResult(res, err))
})
const getNextIntegrationId = () => {
	return new Promise((resolve, reject) => {
		mongodb.getLastIntegration((err, result) => {
			if (err) {
				reject(err)
			} else {
				let id = 'I0000'
				if (result && result.id) {
					id = result.id
				}
				id = '' + (Number(id.substring(1)) + 1)
				var pad = '0000'
				id = 'I' + pad.substring(0, pad.length - id.length) + id
				resolve(id)
			}
		})
	})
}
Mongo.post('/integrations/find', (req, res) => {
	mongodb.findIntegrations(req.body, (err, result) => ApiResult(res, err, result))
})
Mongo.get('/integrations/:id', (req, res) => {
	mongodb.getIntegrationById(req.params.id, (err, result) => ApiResult(res, err, result.length ? result[0] : null))
})
Mongo.put('/integrations/:id', (req, res) => {
	mongodb.updateIntegration(req.params.id, req.body, (err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			mongodb.getIntegrationById(req.body.id, (err, result) =>
				ApiResult(res, err, result.length ? result[0] : null)
			)
		}
	})
})
Mongo.post('/integrations', (req, res) => {
	getNextIntegrationId()
		.then((result) => {
			req.body.id = result
			mongodb.saveIntegration(req.body, (err, result) => ApiResult(res, err, result))
		})
		.catch((err) => ApiResult(res, err))
})
Mongo.delete('/integrations/:id', (req, res) => {
	mongodb.deleteIntegration(req.params.id, (err, result) => ApiResult(res, err, result))
})
module.exports = Mongo
