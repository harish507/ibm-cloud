import express from 'express'
import ApiResult from './ApiResult'
import mongodb from './mongodb'
import axios from 'axios'
import path from 'path'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import fs from 'fs'

const route = express.Router()

route.get('/', (req, res) => {
	ApiResult(res, null, 'Welcome to API')
})
route.get('/test', (req, res) => {
	ApiResult(res, null, 'TEST')
})
route.get('/masters', (req, res) => {
	mongodb.getMasters((err, result) => ApiResult(res, err, result))
})

route.get('/records/all', (req, res) => {
	mongodb.getAllRecords((err, result) => ApiResult(res, err, result))
})
route.get('/records/:cluster/:pattern/:messageSize/:loadSize/:podSize/:consumer', (req, res) => {
	mongodb.getRecords({ ...req.params }, (err, result) => ApiResult(res, err, result))
})
route.post('/records', (req, res) => {
	mongodb.saveRecord(req.body, (err, result) => ApiResult(res, err, result))
})

route.post('/report', (req, res) => {
	//ApiResult(res, null, req.body)
	mongodb.getRecords(
		{
			cluster: req.body.cluster,
			messageSize: req.body.avgSize,
			loaSize: req.body.avgVolume
		},
		(err, result) => ApiResult(res, err, result)
	)
})

route.get('/url', (req, res) => {
	axios.get(req.query.url).then((result) => ApiResult(res, null, result.data)).catch((error) => ApiResult(res, error))
})
route.post('/url', (req, res) => {
	axios
		.post(req.query.url, req.body)
		.then((result) => ApiResult(res, null, result.data))
		.catch((error) => ApiResult(res, error))
})
route.put('/url', (req, res) => {
	axios
		.get(req.query.url, req.body)
		.then((result) => ApiResult(res, null, result.data))
		.catch((error) => ApiResult(res, error))
})
route.delete('/url', (req, res) => {
	axios.get(req.query.url).then((result) => ApiResult(res, null, result.data)).catch((error) => ApiResult(res, error))
})
const fileEncrypt = (value) => {
	const inputVal = {
		organization: value.organization,
		name: value.name,
		email: value.email,
		password: value.password
	}
	const algorithm = 'aes-256-cbc'
	const initVector = crypto.randomBytes(16)
	const message = JSON.stringify(inputVal)
	const securityKey = crypto.scryptSync('encryptOrgDetails', 'salt', 32)
	const cipher = crypto.createCipheriv(algorithm, securityKey, initVector)
	let encryptedData = cipher.update(message, 'utf8', 'hex') + cipher.final('hex')
	//console.log('Encrypted message: ' + encryptedData)
	try {
		let filepath = path.join(__dirname + '/data/')
		if (fs.existsSync(filepath)) {
			fs.writeFileSync(filepath + '_encrypt.txt', encryptedData)
		}
	} catch (error) {
		console.log(error)
	}
}
route.get('/orgDetails', (req, res) => {
	mongodb.getOrgDetails((err, result) => ApiResult(res, err, result))
})
route.post('/verifyActivation', (req, res) => {})

route.post('/register', (req, res) => {
	mongodb.register(req.body, (err, result) => {
		//fileEncrypt(result)
		ApiResult(res, err, result)
	})
})
route.post('/activation', (req, res) => {})

route.post('/login', (req, res) => {
	mongodb.getOrgDetails((err, result) => {
		if (result[0].email !== req.body.email) {
			ApiResult(res, err, 'Invalid email')
		} else if (result[0].password) {
			bcrypt.compare(req.body.password, result[0].password, (err, response) => {
				if (response === true) {
					ApiResult(res, err, response)
				} else {
					ApiResult(res, err, 'Invalid password')
				}
			})
		} else {
			ApiResult(res, err, 'Enter Valid Details')
		}
	})
})
module.exports = route
