import mongoose from 'mongoose'
const schema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	mapName: String,
	keys: [ Object ],
	values: [ Object ],
	_class: String
})
module.exports = mongoose.model('DataMapperMap', schema, 'datamapper_maps')
