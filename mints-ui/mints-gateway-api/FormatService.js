//import express from 'express'
import Axios from 'axios'
//import ApiResult from './ApiResult'

import config from './config.json'

//const router = express.Router();

const FormatService = {
	getVersionConfig: (version) => {
		return new Promise((resolve, reject) => {
			Axios.get(config.services.format + '/' + version, null, {
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
					reject({ message: 'Failed to process your request with format service' })
				})
		})
	},
	setVersionConfig: (data) => {
		return new Promise((resolve, reject) => {
			if (data._id) {
				Axios.put(config.services.format + '/config/' + data.version + '/' + data._id, data, {
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
						reject({ message: 'Failed to process your request with format service' })
					})
			} else {
				Axios.post(config.services.format + '/config/' + data.version, data, {
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
						reject({ message: 'Failed to process your request with format service' })
					})
			}
		})
	},
	format: (version, details, template) => {
		return new Promise((resolve, reject) => {
			Axios.post(
				config.services.format + '/format',
				{ version, details, template },
				{ headers: { 'Content-Type': 'application/json' } }
			)
				.then((result) => {
					if (result.data && result.data.Success) {
						resolve(result.data.Result)
					} else {
						reject(result.data.Message)
					}
				})
				.catch((err) => {
					console.log(err)
					reject({ message: 'Failed to process your request with Format service' })
				})
		})
	},
	delete: (version, details, template) => {
		return new Promise((resolve, reject) => {
			Axios.post(
				config.services.format + '/delete',
				{ version, details, template },
				{ headers: { 'Content-Type': 'application/json' } }
			)
				.then((result) => {
					if (result.data && result.data.Success) {
						resolve(result.data.Result)
					} else {
						reject(result.data.Message)
					}
				})
				.catch((err) => {
					console.log(err)
					reject({ message: 'Failed to process your request with Format service' })
				})
		})
	}
}

module.exports = FormatService
