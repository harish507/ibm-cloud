import mongoose from 'mongoose'
const schema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    version: String,
    environment: String,
    configuration: Object
})
module.exports = mongoose.model('PublishConfig',schema,"publishconfig")