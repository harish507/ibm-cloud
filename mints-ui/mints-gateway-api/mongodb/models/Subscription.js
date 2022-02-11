import mongoose from 'mongoose'

const schema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    subscriber: {type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber'},
    service: {type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionService'},
})
module.exports = mongoose.model('Subscription',schema,'subscriptions')