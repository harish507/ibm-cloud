import mongoose from 'mongoose'
import Master from './models/Master'
import AppConfig from './models/AppConfig'
import Defaults from './models/Defaults'
import Service from './models/Service'
import IbmMqConfig from './models/IbmMqConfig'
import Organization from './models/Organization'
import PropertiesReader from 'properties-reader'
import Publisher from './models/Publisher'
import Subscriber from './models/Subscriber'
import Subscription from './models/Subscription'
import SubscriptionService from './models/SubscriptionService'
import models from './models'
import { propertiesFile,constants } from '../config.json'

const properties = (key)=>{
	var propertiesList = PropertiesReader(propertiesFile);
	return propertiesList.get(key)	
}
const connect = function (cb) {
	if (!mongoose.connection || mongoose.connection.readyState === 0)
		mongoose.connect(
			properties(constants.MONGODB_URL),
			{ useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false },
			(err) => cb(err)
		)
	else cb(null)
}

const MongoService = {
	// DB COLLECTION ACTIONS
	get: (name, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				if (models[name]) {
					models[name].find().exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
				} else {
					cb('Invalid collection name')
				}
			}
		})
	},
	post: (name, data, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				if (models[name]) {
					models[name].insertMany(data).then((result) => cb(null, result)).catch((error) => cb(error))
				} else {
					cb('Invalid collection name')
				}
			}
		})
	},
	delete: (name, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				if (models[name]) {
					models[name].deleteMany({}).then((result) => cb(null, result)).catch((error) => cb(error))
				} else {
					cb('Invalid collection name')
				}
			}
		})
	},

	//  ENVIRONMENTS, APPLICATIONS, COUNTRIES, INSTANCES
	getMasters: (cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Master.find().exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	getMaster: (key, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Master.find({ type: key })
					.exec()
					.then((docs) => {
						if (docs && docs.length > 0) {
							cb(null, docs[0].list)
						} else {
							cb({ message: 'Master data not available for key ' + key })
						}
					})
					.catch((error) => cb(error))
			}
		})
	},
	updateMaster: (_id, updObj, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Master.updateOne({ _id }, { $set: updObj }).then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	},

	//  APPLICATION CONFIGURATION
	getAppConfigs: (cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				AppConfig.find().exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	saveAppConfig: (req, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				const reg = new AppConfig({
					_id: new mongoose.Types.ObjectId(),
					name: req.name,
					connection: req.connection,
					type: req.type,
					defaultAmq: req.defaultAmq,
					defaultWmq: req.defaultWmq,
					defaultKafka: req.defaultKafka,
					defaultFtp: req.defaultFtp,
					defaultRest: req.defaultRest,
					defaultShare: req.defaultShare,
					defaultPgp: req.defaultPgp,
					defaultEncoding: req.defaultEncoding,
					amq: req.amq,
					wmq: req.wmq,
					kafka: req.kafka,
					ftp: req.ftp,
					rest: req.rest,
					fileShare: req.fileShare,
					pgp: req.pgp
				})
				reg.save().then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	},
	updateAppConfig: (_id, updObj, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				AppConfig.updateOne({ _id }, { $set: updObj })
					.then((result) => cb(null, result))
					.catch((err) => cb(err))
			}
		})
	},
	deleteAppConfig: (name, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				AppConfig.deleteOne({ name }).then((result) => cb(null, result)).catch((error) => cb(error))
			}
		})
	},

	//  ENVIRONMENT BASED DEFAULT VALUES
	getDefaults: (cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Defaults.find().exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	getDefaultsByEnv: (env, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Defaults.find({ environment: env }).exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	updateDefaults: (_id, updObj, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Defaults.updateOne({ _id }, { $set: updObj }).then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	},

	//  SERVICE DETAILS
	getServices: (cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Service.find().exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	getServicesOfType: (type, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Service.find({ type }).exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	saveService: (req, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				const service = new Service({
					_id: new mongoose.Types.ObjectId(),
					type: req.type,
					name: req.name,
					version: req.version,
					active: req.active,
					default: req.default,
					url: req.url
				})
				service
					.save()
					.then((result) => {
						cb(null, result)
					})
					.catch((err) => cb(err))
			}
		})
	},
	updateService: (_id, updObj, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Service.updateOne({ _id }, { $set: updObj }).then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	},
	getIbmMqConfig: (version, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				IbmMqConfig.find({ version })
					.exec()
					.then((docs) => cb(null, docs.length > 0 ? docs[0] : null))
					.catch((error) => cb(error))
			}
		})
	},
	saveIbmMqConfig: (req, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				const reg = new IbmMqConfig({
					_id: new mongoose.Types.ObjectId(),
					version: req.version,
					configuration: req.configuration
				})
				reg.save().then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	},
	updateIbmMqConfig: (_id, updObj, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				IbmMqConfig.updateOne({ _id }, { $set: updObj })
					.then((result) => cb(null, result))
					.catch((err) => cb(err))
			}
		})
	},

	// Publisher
	getPublishers: () => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					Publisher.find()
						.exec()
						.then((docs) => resolve(docs))
						.catch((error) => reject(error))
				}
			})
		})
	},
	getPublisher: (_id) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					Publisher.find({_id})
						.exec()
						.then((docs) => resolve(docs && docs.length > 0 ? docs[0]: null))
						.catch((error) => reject(error))
				}
			})
		})
	},
	savePublisher: (req) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					const reg = new Publisher({
						_id: new mongoose.Types.ObjectId(),
						name: req.name
					})
					reg.save().then((result) => resolve(result)).catch((err) => reject(err))
				}
			})
		})
	},
	updatePublisher: (_id, updObj) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					Publisher.updateOne({ _id }, { $set: updObj })
						.then((result) => resolve(result))
						.catch((err) => reject(err))
				}
			})
		})
	},
	deletePublisher: (_id) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					Publisher.deleteOne({ _id }).then((result) => resolve(result)).catch((error) => reject(error))
				}
			})
		})
	},
	// Subscriber
	getSubscribers: () => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					Subscriber.find()
						.exec()
						.then((docs) => resolve(docs))
						.catch((error) => reject(error))
				}
			})
		})
	},
	getSubscriber: (_id) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					Subscriber.find({_id})
						.exec()
						.then((docs) => resolve(docs && docs.length > 0 ? docs[0]: null))
						.catch((error) => reject(error))
				}
			})
		})
	},
	saveSubscriber: (req) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					const reg = new Subscriber({
						_id: new mongoose.Types.ObjectId(),
						name: req.name
					})
					reg.save().then((result) => resolve(result)).catch((err) => reject(err))
				}
			})
		})
	},
	updateSubscriber: (_id, updObj) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					Subscriber.updateOne({ _id }, { $set: updObj })
						.then((result) => resolve(result))
						.catch((err) => reject(err))
				}
			})
		})
	},
	deleteSubscriber: (_id) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					Subscriber.deleteOne({ _id }).then((result) => resolve(result)).catch((error) => reject(error))
				}
			})
		})
	},
	// SubscriptionService
	getSubscriptionServices: () => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					SubscriptionService.find()
						.populate({ path: 'publisher', model: 'Publisher' })
						.exec()
						.then((docs) => resolve(docs))
						.catch((error) => reject(error))
				}
			})
		})
	},
	getSubscriptionService: (_id) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					SubscriptionService.find({_id})
						.populate({ path: 'publisher', model: 'Publisher' })
						.exec()
						.then((docs) => resolve(docs && docs.length > 0 ? docs[0]: null))
						.catch((error) => reject(error))
				}
			})
		})
	},
	saveSubscriptionService: (req) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					const reg = new SubscriptionService({
						_id: new mongoose.Types.ObjectId(),
						publisher: req.publisher,
						name: req.name,
						description: req.description,
						applications: req.applications,
						properties: req.properties ? req.properties : {},
						documents: req.documents ? req.documents: [],
						endpoint: req.endpoint,
						operation: req.operation,
						policies: req.policies ? req.policies : {},
					})
					reg.save().then((result) => resolve(result)).catch((err) => reject(err))
				}
			})
		})
	},
	updateSubscriptionService: (_id, updObj) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					SubscriptionService.updateOne({ _id }, { $set: updObj })
						.then((result) => resolve(result))
						.catch((err) => reject(err))
				}
			})
		})
	},
	deleteSubscriptionService: (_id) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					SubscriptionService.deleteOne({ _id }).then((result) => resolve(result)).catch((error) => reject(error))
				}
			})
		})
	},
	// Subscription
	getSubscriptions: () => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					Subscription.find()
					.populate({ path: 'subscriber', model: 'Subscriber' })
						.populate({ path: 'service', model: 'SubscriptionService', populate: { path: 'publisher', model: 'Publisher' } })
						.exec()
						.then((docs) => resolve(docs))
						.catch((error) => reject(error))
				}
			})
		})
	},
	getSubscription: (_id) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					Subscription.find({_id})
					.populate({ path: 'subscriber', model: 'Subscriber' })
						.populate({ path: 'service', model: 'SubscriptionService', populate: { path: 'publisher', model: 'Publisher' } })
						.exec()
						.then((docs) => resolve(docs && docs.length > 0 ? docs[0]: null))
						.catch((error) => reject(error))
				}
			})
		})
	},
	saveSubscription: (req) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					const reg = new Subscription({
						_id: new mongoose.Types.ObjectId(),
						subscriber: req.subscriber,
						service: req.service
					})
					reg.save().then((result) => resolve(result)).catch((err) => reject(err))
				}
			})
		})
	},
	updateSubscription: (_id, updObj) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					Subscription.updateOne({ _id }, { $set: updObj })
						.then((result) => resolve(result))
						.catch((err) => reject(err))
				}
			})
		})
	},
	deleteSubscription: (_id) => {
		return new Promise((resolve, reject) => {
			connect((err) => {
				if (err) {
					reject(err)
				} else {
					Subscription.deleteOne({ _id }).then((result) => resolve(result)).catch((error) => reject(error))
				}
			})
		})
	},
	getOrgDetails:(cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Organization.find().exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	register:(req, cb)=>{
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				const organization = new Organization({
					_id: new mongoose.Types.ObjectId(),
					organization : req.organization,
					name: req.name,
					email: req.email,
					password: req.password,
					phone: req.phone,
					active: req.active,
					orgID: req._id,
					role: req.role,
					subscriptions: req.subscriptions? req.subscriptions: []
				})
				organization
					.save()
					.then((result) => {
						cb(null, result)
					})
					.catch((err) => cb(err))
			}
		})
	}
}

module.exports = MongoService