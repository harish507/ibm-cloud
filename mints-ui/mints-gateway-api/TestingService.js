import Axios from 'axios'

import config from './config.json'

const TestingService = {
	getTemplateDetails: (id) => {
		return new Promise((resolve, reject) => {
			Axios.get(config.services.publish + '/file?file=testTemplates/' + id + '.feature', null, {
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
					reject({ message: 'Failed to process your request with publish service' })
				})
		})
	},
	formatTestCase: (testCase) => {
		return new Promise((resolve, reject) => {
			try {
				let info = 'Feature: ' + testCase.info.feature + '\n'
				info += '\n\tBackground:\n'
				testCase.info.background.forEach((line) => (info += '\t\t' + line.value + '\n'))
				testCase.info.scenarios.forEach((scenario) => {
					if (scenario.examples.length > 1) {
						info += '\n\tScenario Outline: ' + scenario.name + ' REF: ' + testCase.id + '\n'
					} else {
						info += '\n\tScenario: ' + scenario.name + ' REF: ' + testCase.id + '\n'
					}
					scenario.rules.forEach((rule) => (info += '\t\t' + rule.value + '\n'))
					if (scenario.examples.length > 1) {
						info += '\n\t\tExamples:'
						scenario.examples.forEach((ex) => {
							info += '\n\t\t\t|'
							ex.forEach((example) => (info += example.replace(new RegExp('@', 'g'), '') + '\t|'))
						})
						info += '\n'
					}
				})
				resolve(info)
			} catch (error) {
				reject(error)
			}
		})
	},
	saveTestCase: (id, info) => {
		return new Promise((resolve, reject) => {
			Axios.post(
				config.services.publish + '/file?file=testCases/' + id + '.feature',
				{ info },
				{ headers: { 'Content-Type': 'application/json' } }
			)
				.then((result) => {
					if (result.data && result.data.Success) {
						resolve('Test case file saved for reference id : ' + id)
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
	saveTestInputFile: (id, info) => {
		//console.log(info)
		return new Promise((resolve, reject) => {
			Axios.post(config.services.publish + '/file?file=testCases/' + info.name, { info: info.data.toString() })
				.then((result) => {
					if (result.data && result.data.Success) {
						resolve('Test input file saved for reference id : ' + id)
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
	deleteTestFile: (filename) => {
		//console.log(info)
		return new Promise((resolve, reject) => {
			Axios.post(config.services.publish + '/deleteFile', { path: '/testCases', filename })
				.then((result) => {
					if (result.data && result.data.Success) {
						resolve('Test files deleted')
					} else {
						reject(result.data.Message)
					}
				})
				.catch((err) => {
					console.log(err)
					reject({ message: 'Failed to process your request with publish service' })
				})
		})
	}
}

module.exports = TestingService
