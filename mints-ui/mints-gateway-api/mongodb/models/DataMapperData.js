import mongoose from 'mongoose'
const schema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	mapName: String,
	data: [ Object ],
	_class: String
})
module.exports = mongoose.model('DataMapperData', schema, 'datamapper_data')
