import mongoose from 'mongoose'
const schema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    organization : String,
    name: String,
    email: String,
    password: String,
    phone: Number,
    active: Boolean,
    orgID: { type: mongoose.Schema.Types.ObjectId },
    role: String,
    subscriptions: [Object]
})
module.exports = mongoose.model('Organization',schema,'organizations')