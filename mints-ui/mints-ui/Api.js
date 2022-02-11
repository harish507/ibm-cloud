const express = require('express')
const Axios = require('axios')
const FormData = require('form-data')

const Api = express.Router()

const service = 'http://mints-gateway-api-service:8000'
//const service = 'http://192.168.29.142:8000'

Api.get('/*', (req, res) => {
	let path = req.originalUrl.substring(4)
	console.log('[GET] ' + path)
	Axios.get(service + path, null, {
		headers: { 'Content-Type': 'application/json' }
	})
		.then((result) => {
			res.status(200).json(result.data)
		})
		.catch((err) => {
			console.log(err)
			res.status(500).send(err)
		})
})
Api.post('/*', (req, res) => {
	let path = req.originalUrl.substring(4)
	console.log('[POST] ' + path)
	//console.log(req.headers['content-type'])
	let formData = req.body
	if (req.files && Object.keys(req.files).length > 0) {
		formData = new FormData()
		Object.keys(req.files).forEach((key) => {
			formData.append(key, req.files[key].data, req.files[key].name)
		})
		Object.keys(req.body).forEach((key) => {
			formData.append(key, req.body[key])
		})
	}
	Axios.post(service + path, formData, {
		headers: formData.getHeaders ? formData.getHeaders() : { 'content-type': 'application/json' }
	})
		.then((result) => {
			res.status(200).json(result.data)
		})
		.catch((err) => {
			console.log(err)
			res.status(500).send(err)
		})
})
Api.put('/*', (req, res) => {
	let path = req.originalUrl.substring(4)
	console.log('[PUT] ' + path)
	Axios.put(service + path, req.body, {
		headers: { 'Content-Type': 'application/json' }
	})
		.then((result) => {
			res.status(200).json(result.data)
		})
		.catch((err) => {
			console.log(err)
			res.status(500).send(err)
		})
})
Api.delete('/*', (req, res) => {
	let path = req.originalUrl.substring(4)
	console.log('[DELETE] ' + path)
	Axios.delete(service + path, null, {
		headers: { 'Content-Type': 'application/json' }
	})
		.then((result) => {
			res.status(200).json(result.data)
		})
		.catch((err) => {
			console.log(err)
			res.status(500).send(err)
		})
})

module.exports = Api
