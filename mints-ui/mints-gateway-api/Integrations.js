import express from 'express'
import Axios from 'axios'
import ApiResult from './ApiResult'

import config from './config.json'

const Mongo = express.Router()

Mongo.get('/', (req, res) => {
	Axios.get(config.services.integrations)
		.then((result) => {
			if (result.data && result.data.Success) {
				ApiResult(res, null, result.data.Result)
			} else {
				ApiResult(res, result.data.Message)
			}
		})
		.catch((err) => {
			ApiResult(res, err)
		})
})
Mongo.get('/:id', (req, res) => {
	Axios.get(config.services.integrations + '/' + req.params.id)
		.then((result) => {
			if (result.data && result.data.Success) {
				ApiResult(res, null, result.data.Result)
			} else {
				ApiResult(res, result.data.Message)
			}
		})
		.catch((err) => {
			ApiResult(res, err)
		})
})
Mongo.put('/:id', (req, res) => {
	Axios.put(config.services.integrations + '/' + req.params.id, setRouteValues(req.body), {
		headers: { 'Content-Type': 'application/json' }
	})
		.then((result) => {
			if (result.data && result.data.Success) {
				ApiResult(res, null, result.data.Result)
			} else {
				ApiResult(res, result.data.Message)
			}
		})
		.catch((err) => {
			ApiResult(res, err)
		})
})
const setRouteValues = ({ details, template }) => {
	var routes = []
	template.palettes.forEach((route) => {
		let props = {}
		route.properties.forEach((prop) => {
			props[prop.key] = prop.value
		})
		routes.push({ palette: route.palette, properties: props })
	})
	details.routes = routes
	details.template = template
	details.templateId = template.id
	return details
}

Mongo.post('/', (req, res) => {
	Axios.post(config.services.integrations, setRouteValues(req.body), {
		headers: { 'Content-Type': 'application/json' }
	})
		.then((result) => {
			if (result.data && result.data.Success) {
				ApiResult(res, null, result.data.Result)
			} else {
				ApiResult(res, result.data.Message)
			}
		})
		.catch((err) => {
			ApiResult(res, err)
		})
})

module.exports = Mongo
