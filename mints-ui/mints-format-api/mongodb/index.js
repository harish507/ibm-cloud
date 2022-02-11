import mongoose from 'mongoose'
import Master from './models/Master'
import Defaults from './models/Defaults'
import Palette from './models/Palette'
import AppConfig from './models/AppConfig'
import FormatConfig from './models/FormatConfig'
import PropertiesReader from 'properties-reader'

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
	//  TEXT REPLACEMENTS
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

	//  APPLICATION CONFIGURATION
	getAppConfig: (cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				AppConfig.find().exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	getAppConfigByName: (name, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				AppConfig.findOne({ name }).exec().then((doc) => cb(null, doc)).catch((error) => cb(error))
			}
		})
	},

	//  GET ALL PALETTES
	getPalettes: (cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Palette.find().exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},

	// CONFIG DETAILS
	getConfig: (version, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				FormatConfig.find({ version })
					.populate({ path: 'palette', model: 'Palette' })
					.exec()
					.then((docs) => cb(null, docs))
					.catch((error) => cb(error))
			}
		})
	},
	getConfigByID: (_id, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				FormatConfig.find({ _id })
					.populate({ path: 'palette', model: 'Palette' })
					.exec()
					.then((docs) => cb(null, docs[0]))
					.catch((error) => cb(error))
			}
		})
	},
	saveConfig: (req, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				const reg = new FormatConfig({
					_id: new mongoose.Types.ObjectId(),
					version: req.version,
					palette: req.palette,
					inputs: req.inputs ? req.inputs : {},
					outputs: req.outputs ? req.outputs : [],
					xml: req.xml ? req.xml : {}
				})
				reg.save().then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	},
	updateConfig: (_id, updObj, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				FormatConfig.updateOne({ _id }, { $set: updObj })
					.then((result) => cb(null, result))
					.catch((err) => cb(err))
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
	}
}

module.exports = MongoService
