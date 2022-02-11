import mongoose from 'mongoose'
import Palette from './Palette'

const schema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	version: String,
	palette: { type: mongoose.Schema.Types.ObjectId, ref: 'Palette' },
	inputs: Object,
	outputs: [ Object ],
	xml: Object
})
module.exports = mongoose.model('FormatConfig', schema, 'formatconfig')
