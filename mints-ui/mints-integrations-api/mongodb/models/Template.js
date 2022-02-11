import mongoose from 'mongoose'

const schema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    id: String,
    name: String,
    description: String,
    category: String,
    palettes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Palette'}],
    hideProps: Object
})
module.exports = mongoose.model('Template',schema)