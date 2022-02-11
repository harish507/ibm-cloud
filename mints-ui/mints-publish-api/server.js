import express from 'express'
import fileupload from 'express-fileupload'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'

//import Api from './src/Api'
import Api from './Api'

const app = express()
const PORT = 8004

app.use(cors())
app.use(bodyParser.json())
app.use(fileupload())

app.use('/', Api)
app.listen(PORT, () => {
	console.log(`App running on ${PORT}`)
})
