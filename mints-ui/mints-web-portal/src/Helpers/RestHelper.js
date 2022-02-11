import axios from 'axios'
import https from 'https'

const instance = axios.create({
	httpsAgent: new https.Agent({
		rejectUnauthorized: false
	})
})

const api = '/api'
//const api = 'http://localhost:7000/api'

const tokenHeader = {
	headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } // Authorization: `Bearer ${localStorage.getItem('token')}`
}
const fileUploadHeader = {
	headers: { 'Content-type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*' } //  Authorization: `Bearer ${localStorage.getItem('token')}`
}

const service = {
	get: (path) => {
		return new Promise((resolve, reject) => {
			instance
				.get(`${api}/${path}`, tokenHeader)
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
	post: (path, input, fileHeader) => {
		return new Promise((resolve, reject) => {
			instance
				.post(`${api}/${path}`, input, fileHeader ? fileUploadHeader : tokenHeader)
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
	put: (path, input, fileHeader) => {
		return new Promise((resolve, reject) => {
			instance
				.put(`${api}/${path}`, input, fileHeader ? fileUploadHeader : tokenHeader)
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
				.delete(`${api}/${path}`, tokenHeader)
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
