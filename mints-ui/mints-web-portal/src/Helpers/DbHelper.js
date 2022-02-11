import RestHelper from './RestHelper'

const DBHelper = {
	getMasters: () => {
		return new Promise((resolve, reject) => {
			RestHelper.get('/masters').then((result) => {
				if (result && result.Success) {
					let masters = {}
					result.Result.forEach((master) => (masters[master.type] = master.list))
					resolve(masters)
				} else {
					reject(result.Message)
				}
			})
		})
	},
	getAllRecords: () => {
		return new Promise((resolve, reject) => {
			RestHelper.get('/records/all').then((result) => {
				if (result && result.Success) {
					resolve(result.Result)
				} else {
					reject(result.Message)
				}
			})
		})
	},
	getRecords: (obj) => {
		return new Promise((resolve, reject) => {
			RestHelper.get(
				`/records/${obj.cluster}/${obj.pattern}/${obj.messageSize}/${obj.loadSize}/${obj.podSize}/${obj.consumer}`
			).then((result) => {
				if (result && result.Success) {
					resolve(result.Result)
				} else {
					reject(result.Message)
				}
			})
		})
	},
	saveRecord: (obj) => {
		return new Promise((resolve, reject) => {
			if (obj._id && obj._id !== '') {
				RestHelper.put('/records/' + obj._id, obj).then((result) => {
					if (result && result.Success) {
						resolve(result.Result)
					} else {
						reject(result.Message)
					}
				})
			} else {
				RestHelper.post('/records', obj).then((result) => {
					if (result && result.Success) {
						resolve(result.Result)
					} else {
						reject(result.Message)
					}
				})
			}
		})
	},
	getReport: (obj) => {
		return new Promise((resolve, reject) => {
			RestHelper.post('/report', obj).then((result) => {
				if (result && result.Success) {
					resolve(result.Result)
				} else {
					reject(result.Message)
				}
			})
		})
	}
}

export default DBHelper
