//import express from 'express'
import Axios from 'axios'
import FormData from 'form-data'
//import ApiResult from './ApiResult'

import config from './config.json'

//const router = express.Router();

const PublishService = {
	getVersionConfig: (version) => {
		return new Promise((resolve, reject) => {
			Axios.get(config.services.publish + '/' + version, null, {
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
					reject({ message: 'Failed to process your request with publish service' })
				})
		})
	},
	setVersionConfig: (data) => {
		return new Promise((resolve, reject) => {
			if (data._id) {
				Axios.put(
					config.services.publish + '/' + data.version + '/' + data.environment + '/' + data._id,
					data.configuration,
					{
						headers: { 'Content-Type': 'application/json' }
					}
				)
					.then((result) => {
						if (result.data && result.data.Success) {
							resolve(result.data.Result)
						} else {
							reject(result.data.Message)
						}
					})
					.catch((err) => {
						reject({ message: 'Failed to process your request with publish service' })
					})
			} else {
				Axios.post(config.services.publish + '/' + data.version + '/' + data.environment, data.configuration, {
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
						reject({ message: 'Failed to process your request with publish service' })
					})
			}
		})
	},
	publish: (version, environment, id, data) => {
		return new Promise((resolve, reject) => {
			Axios.post(
				config.services.publish + '/publish',
				{ version, environment, id, data },
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
					reject({ message: 'Failed to process your request with publish service' })
				})
		})
	},
	unPublish: (version, environment, id, data) => {
		return new Promise((resolve, reject) => {
			Axios.post(
				config.services.publish + '/unPublish',
				{ version, environment, id, data },
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
					reject({ message: 'Failed to process your request with publish service' })
				})
		})
	},
	getFile: (file) => {
		return new Promise((resolve, reject) => {
			Axios.get(config.services.publish + '/file?file=' + file, null, null)
				.then((result) => {
					if (result.data && result.data.Success) {
						resolve(result.data.Result)
					} else {
						reject(result.data.Message)
					}
				})
				.catch((err) => {
					console.log(err)
					reject({ message: 'Failed to process your request with file service' })
				})
		})
	},
	putFile: (file, info) => {
		return new Promise((resolve, reject) => {
			Axios.post(config.services.publish + '/file?file=' + file, { info }, null)
				.then((result) => {
					if (result.data && result.data.Success) {
						resolve(result.data.Result)
					} else {
						reject(result.data.Message)
					}
				})
				.catch((err) => {
					console.log(err)
					reject({ message: 'Failed to process your request with file service' })
				})
		})
	},
	getFiles: () => {
		return new Promise((resolve, reject) => {
			Axios.get(config.services.publish + '/files', null, { headers: { 'Content-Type': 'application/json' } })
				.then((result) => {
					if (result.data && result.data.Success) {
						resolve(result.data.Result)
					} else {
						reject(result.data.Message)
					}
				})
				.catch((err) => {
					console.log(err)
					reject({ message: 'Failed to process your request with file service' })
				})
		})
	},
	getFilesAndFolders: (path) => {
		return new Promise((resolve, reject) => {
			Axios.get(config.services.publish + '/filesAndFolders?path=' + path, null, {
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
					console.log(err)
					reject({ message: 'Failed to process your request with file service' })
				})
		})
	},
	postFile: (info, file) => {
		return new Promise((resolve, reject) => {
			let formData = new FormData()
			formData.append('file', file)
			formData.append('info', info)
			Axios.post(config.services.publish + '/files', formData, {
				headers: formData.getHeaders()
			})
				.then((result) => {
					if (result.data && result.data.Success) {
						resolve(result.data.Result)
					} else {
						reject(result.data.Message)
					}
				})
				.catch((err) => {
					console.log(err)
					reject({ message: 'Failed to process your request with file service' })
				})
		})
	},
	deleteFile: (info) => {
		return new Promise((resolve, reject) => {
			Axios.post(config.services.publish + '/deleteFile', info, {
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
					console.log(err)
					reject({ message: 'Failed to process your request with file service' })
				})
		})
	},
	viewFile: (info) => {
		return new Promise((resolve, reject) => {
			Axios.post(config.services.publish + '/viewFile', info, {
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
					console.log(err)
					reject({ message: 'Failed to process your request with file service' })
				})
		})
	},
	editFile:(info)=>{
		return new Promise((resolve, reject) => {
			Axios.post(config.services.publish + '/editFile', info, {
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
					console.log(err)
					reject({ message: 'Failed to process your request with file service' })
				})
		})	
	},
	createFolder: (info)=>{
		return new Promise((resolve, reject) => {
			Axios.post(config.services.publish + '/createFolder', info, {
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
					console.log(err)
					reject({ message: 'Failed to process your request with file service' })
				})
		})
	},
	deleteFolder:(info)=>{
		return new Promise((resolve, reject) => {
			Axios.post(config.services.publish + '/deleteFolder', info, {
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
					console.log(err)
					reject({ message: 'Failed to process your request with file service' })
				})
		})	
	}
}


module.exports = PublishService
