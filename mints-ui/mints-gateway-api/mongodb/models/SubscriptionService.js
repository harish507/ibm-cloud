import mongoose from 'mongoose'

const schema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    publisher: {type: mongoose.Schema.Types.ObjectId, ref: 'Publisher'},
    application: String,
    name: String,
    description: String,
    properties: Object,
    documents: [],
    endpoint: String,
    operation: String,
    policies: Object
})
module.exports = mongoose.model('SubscriptionService',schema,'subscriptionServices')