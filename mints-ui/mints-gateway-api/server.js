import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import fileupload from 'express-fileupload'
import path from 'path'

//import Api from './src/Api'
import Api from './Api'
import Admin from './Admin'
import Integrations from './Integrations'
import Templates from './Templates'
import Palettes from './Palettes'

const app = express()
const PORT = 8000

app.use(cors())
app.use(bodyParser.json())
app.use(fileupload())

app.use('/', Api)
app.use('/admin', Admin)
app.use('/integrations', Integrations)
app.use('/templates', Templates)
app.use('/palettes', Palettes)

app.listen(PORT, () => {
	console.log(`App running on ${PORT}`)
})
