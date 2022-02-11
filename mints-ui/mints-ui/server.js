const express = require('express')
const fileupload = require('express-fileupload')
const bodyParser = require('body-parser')
const path = require('path')
const Api = require('./Api')

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())
app.use(fileupload())
app.use(express.static(path.join(__dirname, 'build')))

app.get('/ping', function (req, res) {
	return res.send('pong')
})
app.use('/api/*', Api)
app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(PORT, () => {
	console.log('UI is ready on prot ' + PORT)
})
