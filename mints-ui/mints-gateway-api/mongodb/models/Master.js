import mongoose from 'mongoose'
const schema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    type: String,
    format: Object,
    list: [Object]
})
module.exports = mongoose.model('Master',schema)