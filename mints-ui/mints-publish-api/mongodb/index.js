import mongoose from 'mongoose'
import PublishConfig from './models/PublishConfig'
import MapsPropsConfig from './models/MapsPropsConfig'
import PropertiesReader from 'properties-reader'

import { MongoDB, propertiesFile,constants } from '../config.json'

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
	// CONFIG DETAILS
	getConfig: (version, environment, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				PublishConfig.find({ version, environment })
					.exec()
					.then((docs) => cb(null, docs.length > 0 ? docs[0] : null))
					.catch((error) => cb(error))
			}
		})
	},
	saveConfig: (req, cb) => {
		connect((err) => {
			if (err) {
				cb(crr)
			} else {
				const reg = new PublishConfig({
					_id: new mongoose.Types.ObjectId(),
					version: req.version,
					environment: req.environment,
					configuration: req.configuration
				})
				reg.save().then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	},
	updateConfig: (_id, updObj, cb) => {
		connect((err) => {
			if (err) {
				cb(crr)
			} else {
				PublishConfig.updateOne({ _id }, { $set: updObj })
					.then((result) => cb(null, result))
					.catch((err) => cb(err))
			}
		})
	},
	getVersionConfig: (version, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				PublishConfig.find({ version })
					.exec()
					.then((docs) => cb(null, docs.length > 0 ? docs : null))
					.catch((error) => cb(error))
			}
		})
	},
	getMapsPropsConfig: (version, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				MapsPropsConfig.find({ version })
					.exec()
					.then((docs) => cb(null, docs.length > 0 ? docs : null))
					.catch((error) => cb(error))
			}
		})
	}
}

module.exports = MongoService
