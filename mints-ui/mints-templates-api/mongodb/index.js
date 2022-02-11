import mongoose from 'mongoose'
import Integration from './models/Integration'
import Template from './models/Template'
import Palette from './models/Palette'
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
	// TEMPLATE DETAILS
	getTemplates: (cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Template.find()
					.sort({ entryDt: -1 })
					.populate('palettes')
					.exec()
					.then((docs) => cb(null, docs))
					.catch((error) => cb(error))
			}
		})
	},
	getTemplateById: (id, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Template.find({ id: id })
					.populate('palettes')
					.exec()
					.then((docs) => cb(null, docs))
					.catch((error) => cb(error))
			}
		})
	},
	getLastTemplate: (cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Template.findOne().sort({ _id: -1 }).exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	saveTemplate: (req, cb) => {
		connect((err) => {
			if (err) {
				cb(crr)
			} else {
				const reg = new Template({
					_id: new mongoose.Types.ObjectId(),
					id: req.id,
					name: req.name,
					description: req.description,
					category: req.category,
					palettes: req.palettes ? req.palettes : [],
					hideProps: req.hideProps
				})
				reg.save().then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	},
	updateTemplate: (_id, updObj, cb) => {
		connect((err) => {
			if (err) {
				cb(crr)
			} else {
				Template.updateOne({ _id }, { $set: updObj }).then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	},
	deleteTemplate: (_id, cb) => {
		connect((err) => {
			if (err) {
				cb(crr)
			} else {
				Integration.find({ template: _id })
					.exec()
					.then((result) => {
						if (result && result.length > 0) {
							cb('Template cannot be deleted as it is associated with ' + result.length + ' integrations')
						} else {
							Template.findByIdAndRemove(_id)
								.exec()
								.then((result) => cb(null, result))
								.catch((err) => cb(err))
						}
					})
					.catch((err) => cb(err))
			}
		})
	},

	// PALETTE DETAILS
	getPalettes: (cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Palette.find().exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	getPaletteById: (_id, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Palette.find({ _id }).exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	savePalette: (req, cb) => {
		connect((err) => {
			if (err) {
				cb(crr)
			} else {
				const reg = new Palette({
					_id: new mongoose.Types.ObjectId(),
					group: req.group,
					name: req.name,
					type: req.type,
					icon: req.icon,
					properties: req.properties ? req.properties : []
				})
				reg.save().then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	},
	updatePalette: (_id, updObj, cb) => {
		connect((err) => {
			if (err) {
				cb(crr)
			} else {
				Palette.updateOne({ _id }, { $set: updObj }).then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	},
	deletePalette: (_id, cb) => {
		connect((err) => {
			if (err) {
				cb(crr)
			} else {
				Template.find({ palettes: _id })
					.exec()
					.then((result) => {
						if (result && result.length > 0) {
							cb('Palette cannot be deleted as it is associated with ' + result.length + ' templates')
						} else {
							Palette.findByIdAndRemove(_id)
								.exec()
								.then((result) => cb(null, result))
								.catch((err) => cb(err))
						}
					})
					.catch((err) => cb(err))
			}
		})
	}
}

module.exports = MongoService
