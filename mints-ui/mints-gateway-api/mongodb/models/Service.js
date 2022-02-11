import mongoose from 'mongoose'
const schema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    serviceId: Number,
    type: String,
    name: String,
    version: String,
    active: Boolean,
    default: Boolean,
    url: String
})
module.exports = mongoose.model('Service',schema)