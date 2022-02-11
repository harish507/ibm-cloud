import axios from 'axios'
import https from 'https'

const instance = axios.create({
	httpsAgent: new https.Agent({
		rejectUnauthorized: false
	})
})

const api = '/api'
//const api = 'http://localhost:8000'

const commonHeader = {
	headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } // Authorization: `Bearer ${localStorage.getItem('token')}`
}
const fileUploadHeader = {
	headers: { 'Content-type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*' } //  Authorization: `Bearer ${localStorage.getItem('token')}`
}

const service = {
	headers: {commonHeader, fileUploadHeader },
	get: (path) => {
		return new Promise((resolve, reject) => {
			instance
				.get(`${api}/${path}`, commonHeader)
				.then((response) => {
					if (response && response.data) {
						resolve(response.data)
					} else {
						reject(response.Message)
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	post: (path, input, header) => {
		return new Promise((resolve, reject) => {
			instance
				.post(`${api}/${path}`, input, header)
				.then((response) => {
					if (response && response.data) {
						resolve(response.data)
					} else {
						reject(response.Message)
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	put: (path, input, header) => {
		return new Promise((resolve, reject) => {
			instance
				.put(`${api}/${path}`, input, header)
				.then((response) => {
					if (response && response.data) {
						resolve(response.data)
					} else {
						reject(response.Message)
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	delete: (path) => {
		return new Promise((resolve, reject) => {
			instance
				.delete(`${api}/${path}`, commonHeader)
				.then((response) => {
					if (response && response.data) {
						resolve(response.data)
					} else {
						reject(response.Message)
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	getUrl: (path) => {
		return new Promise((resolve, reject) => {
			instance
				.get(`${path}`, commonHeader)
				.then((response) => {
					if (response && response.data) {
						resolve(response.data)
					} else {
						reject(response.Message)
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	postUrl: (path, input, header) => {
		return new Promise((resolve, reject) => {
			instance
				.post(`${path}`, input, header)
				.then((response) => {
					if (response && response.data) {
						resolve(response.data)
					} else {
						reject(response.Message)
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	putUrl: (path, input, header) => {
		return new Promise((resolve, reject) => {
			instance
				.put(`${path}`, input, header)
				.then((response) => {
					if (response && response.data) {
						resolve(response.data)
					} else {
						reject(response.Message)
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
	},
	deleteUrl: (path) => {
		return new Promise((resolve, reject) => {
			instance
				.delete(`${path}`, commonHeader)
				.then((response) => {
					if (response && response.data) {
						resolve(response.data)
					} else {
						reject(response.Message)
					}
				})
				.catch((error) => {
					reject(error)
				})
		})
	}
}

export default service
