import mongoose from 'mongoose'

const schema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	cluster: String,
	pattern: String,
	messageSize: String,
	loadSize: String,
	podSize: Number,
	consumer: Number,
	transmittedBw: Number,
	networkBw: Number,
	cpu: Number,
	memory: Number,
	duration: Number,
	tps: Number
})
module.exports = mongoose.model('Record', schema, 'records')
