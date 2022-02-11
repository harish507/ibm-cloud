import mongoose from 'mongoose'
const schema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    environment: String,
    defaultValues: Object
})
module.exports = mongoose.model('Defaults',schema,'defaults')