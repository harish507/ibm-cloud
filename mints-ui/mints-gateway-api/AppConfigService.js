import mongo from './mongodb'

const AppConfigService = {
	getApplications: () => {
		return new Promise((resolve, reject) => {
			mongo.getMaster('applications', (err, apps) => {
				if (err) {
					reject(err)
				} else {
					var result = {}
					apps.forEach((app) => (result[app] = { name: app, type: 'Default' }))
					mongo.getAppConfigs((err, config) => {
						if (err) {
							reject(err)
						} else {
							config.forEach((con) => (result[con.name] = con))
							resolve(result)
						}
					})
				}
			})
		})
	},
	saveApplication: (obj) => {
		return new Promise((resolve, reject) => {
			if (obj._id) {
				mongo.updateAppConfig(obj._id, obj, (err, config) => {
					if (err) {
						reject(err)
					} else {
						resolve(config)
					}
				})
			} else {
				mongo.saveAppConfig(obj, (err, config) => {
					if (err) {
						reject(err)
					} else {
						resolve(config)
					}
				})
			}
		})
	},
	deleteApplication: (obj) => {
		return new Promise((resolve, reject) => {
			mongo.deleteAppConfig(obj, (err, config) => {
				if (err) {
					reject(err)
				} else {
					resolve(config)
				}
			})
		})
	}
}

module.exports = AppConfigService
