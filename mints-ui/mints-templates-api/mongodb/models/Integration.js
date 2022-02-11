import mongoose from 'mongoose'
import Template from './Template'
import Palette from './Palette'

const routeSchema = mongoose.Schema({
    palette: {type: mongoose.Schema.Types.ObjectId, ref:'Palette'},
    properties: Object
})
const Route = mongoose.model('Route', routeSchema)

const schema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    id: String,
    name: String,
    description: String,
    source: String,
    target: String,
    environment: String,
    country: String,
    instance: String,
    minVolume: Number,
    avgVolume: Number,
    maxVolume: Number,
    template: {type: mongoose.Schema.Types.ObjectId, ref: 'Template'},
    routes: [routeSchema],
    entryDt: Date
})
module.exports = mongoose.model('Integration',schema)