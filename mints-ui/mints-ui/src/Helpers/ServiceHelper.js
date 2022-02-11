import React from 'react'
import axios from 'axios'
import https from 'https'

const instance = axios.create({
	httpsAgent: new https.Agent({
		rejectUnauthorized: false
	})
})
const headers = { 'Content-Type': 'application/json' }

const api = '/api'
//const api = 'http://localhost:8000'

export default class ServiceHelper extends React.Component {
	state = {
		loading: false,
		error: null,
		payload: null
	}

	validateAndRespond = (res) => {
		// setTimeout(() => {
		if (res && res.Success) {
			this.setState({ loading: false, payload: res.Result, error: null })
		} else {
			this.setState({ loading: false, payload: res.Result, error: res.Message })
		}
		// }, 10)
	}

	componentDidMount () {
		const { method, path, input, optHeaders } = this.props
		this.setState({ loading: true })
		if (!method || method === 'get') {
			instance({ method: 'get', url: `${api}/${path}`, timeout: 30000, params: input })
				.then((response) => {
					this.validateAndRespond(response.data)
				})
				.catch((error) => {
					this.setState({ loading: false, payload: null, error: error })
				})
		}
		if (method === 'post') {
			//console.log(optHeaders)
			//console.log(input)
			instance
				.post(`${api}/${path}`, input, { headers: optHeaders ? optHeaders : headers })
				.then((response) => {
					this.validateAndRespond(response.data)
				})
				.catch((error) => {
					this.setState({ loading: false, payload: null, error: error })
				})
		}
		if (method === 'put') {
			instance
				.put(`${api}/${path}`, input, { headers: headers })
				.then((response) => {
					this.validateAndRespond(response.data)
				})
				.catch((error) => {
					this.setState({ loading: false, payload: null, error: error })
				})
		}
		if (method === 'delete') {
			instance
				.delete(`${api}/${path}`, null, { headers: headers })
				.then((response) => {
					this.validateAndRespond(response.data)
				})
				.catch((error) => {
					this.setState({ loading: false, payload: null, error: error })
				})
		}
	}

	render () {
		return this.props.render(this.state)
	}
}
