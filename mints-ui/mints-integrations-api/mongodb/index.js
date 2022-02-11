import mongoose from 'mongoose'
import Integration from './models/Integration'
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
	// INTEGRATION DETAILS
	getIntegrations: (cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Integration.find()
					.populate({ path: 'template', model: 'Template', populate: { path: 'palettes', model: 'Palette' } })
					.sort({ entryDt: -1 })
					.exec()
					.then((docs) => cb(null, docs))
					.catch((error) => cb(error))
			}
		})
	},
	findIntegrations: (filterObj, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				//{$or:[{region: "NA"},{sector:"Some Sector"}]}
				Integration.find(filterObj)
					.populate({ path: 'template', model: 'Template', populate: { path: 'palettes', model: 'Palette' } })
					.sort({ entryDt: -1 })
					.exec()
					.then((docs) => cb(null, docs))
					.catch((error) => cb(error))
			}
		})
	},
	getIntegrationById: (id, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Integration.find({ id: id })
					.populate({ path: 'template', model: 'Template', populate: { path: 'palettes', model: 'Palette' } })
					.exec()
					.then((docs) => cb(null, docs))
					.catch((error) => cb(error))
			}
		})
	},
	getLastIntegration: (cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Integration.findOne()
					.sort({ entryDt: -1 })
					.exec()
					.then((docs) => cb(null, docs))
					.catch((error) => cb(error))
			}
		})
	},
	saveIntegration: (req, cb) => {
		connect((err) => {
			if (err) {
				cb(crr)
			} else {
				const reg = new Integration({
					_id: new mongoose.Types.ObjectId(),
					id: req.id,
					name: req.name,
					description: req.description,
					source: req.source,
					target: req.target,
					keys: req.keys ? req.keys : {},
					environment: req.environment,
					country: req.country,
					instance: req.instance,
					minVolume: req.minVolume,
					avgVolume: req.avgVolume,
					maxVolume: req.maxVolume,
					template: req.template,
					routes: req.routes ? req.routes : [],
					entryDt: new Date(Date.now())
				})
				reg.save().then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	},
	updateIntegration: (id, updObj, cb) => {
		connect((err) => {
			if (err) {
				cb(crr)
			} else {
				Integration.updateOne({ id }, { $set: updObj })
					.then((result) => cb(null, result))
					.catch((err) => cb(err))
			}
		})
	},
	deleteIntegration: (_id, cb) => {
		connect((err) => {
			if (err) {
				cb(crr)
			} else {
				Integration.findByIdAndRemove(_id).exec().then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	}
}

module.exports = MongoService
