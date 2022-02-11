//import express from 'express'
import Axios from 'axios'
//import ApiResult from './ApiResult'

import config from './config.json'

const WebPortalService = {
	getOrganizationDetails:()=>{
		return new Promise((resolve, reject) => {
			Axios.get(config.services.webPortal + '/orgDetails')
				.then((result) => {
					if (result.data && result.data.Success) {
						resolve(result.data.Result)
					} else {
						reject(result.data.Message)
					}
				})
				.catch((err) => {
					console.log(err);
					reject({ message: 'Failed to get Organization Details' })
				})
		})
	},
	verifyActivationKey: (key) => {
		return new Promise((resolve, reject) => {
			Axios.get(config.services.webPortal + '/verifyActivation')
				.then((result) => {
					if (result.data && result.data.Success) {
						resolve(result.data.Result)
					} else {
						reject(result.data.Message)
					}
				})
				.catch((err) => {
					reject({ message: 'Failed to verify the Activation code ' })
				})
		})
	},
	register: (data) => {
		return new Promise((resolve, reject) => {
			Axios.post(config.services.webPortal + '/register', data, {
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
					reject({ message: 'Failed to register the Organization details' })
				})
		})
	},
	activate: () => {
		return new Promise((resolve, reject) => {
			Axios.post(config.services.webPortal + '/activate', data, {
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
					reject({ message: 'Failed to activate the Organization details' })
				})
		})
	},
	login: (input) => {
		return new Promise((resolve, reject) => {
			Axios.post(config.services.webPortal + '/login', input, {
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
					reject({ message: 'Invalid Credentials' })
				})
		})
	}

}
module.exports = WebPortalService
