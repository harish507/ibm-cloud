import mongoose from 'mongoose'
const schema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    group: String,
    name: String,
    type: String,
    icon: String,
    properties: [Object],
})
module.exports = mongoose.model('Palette',schema)