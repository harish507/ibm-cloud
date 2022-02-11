import mongoose from 'mongoose'
const schema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	connection: String,
	type: String,
	defaultAmq: Boolean,
	defaultWmq: Boolean,
	defaultKafka: Boolean,
	defaultFtp: Boolean,
	defaultRest: Boolean,
	defaultShare: Boolean,
	defaultPgp: Boolean,
	defaultEncoding: Boolean,
	amq: Object,
	wmq: Object,			
	kafka: Object,
	ftp: Object,				
	rest: Object,
	fileShare: Object,
	pgp:Object
})
module.exports = mongoose.model('AppConfig', schema, 'applicationconfig')
