import express from 'express'
import mongodb from './mongodb'
import ApiResult from './ApiResult'

const Mongo = express.Router()

Mongo.get('/', (req, res) => {
	ApiResult(res, null, '/templates api test')
})
Mongo.get('/templates', (req, res) => {
	//ApiResult(res,null,templates)
	mongodb.getTemplates((err, result) => {
		ApiResult(res, err, result)
	})
})
Mongo.get('/nextTemplateId', (req, res) => {
	getNextTemplateId().then((result) => ApiResult(res, null, result)).catch((err) => ApiResult(res, err))
})
const getNextTemplateId = () => {
	return new Promise((resolve, reject) => {
		mongodb.getLastTemplate((err, result) => {
			if (err) {
				reject(err)
			} else {
				let id = 'T0000'
				if (result && result.id) {
					id = result.id
				}
				id = '' + (Number(id.substring(1)) + 1)
				var pad = '0000'
				id = 'T' + pad.substring(0, pad.length - id.length) + id
				resolve(id)
			}
		})
	})
}
Mongo.get('/templates/:id', (req, res) => {
	mongodb.getTemplateById(req.params.id, (err, result) => {
		//ApiResult(res,err,result.length ? result[0]: null)
		if (result && result.length) {
			ApiResult(res, null, result[0])
		} else {
			ApiResult(res, err, null)
		}
	})
})
Mongo.put('/templates/:id', (req, res) => {
	mongodb.updateTemplate(req.params.id, req.body, (err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			mongodb.getTemplateById(req.body.id, (err, result) => ApiResult(res, err, result.length ? result[0] : null))
		}
	})
})
Mongo.post('/templates', (req, res) => {
	getNextTemplateId()
		.then((result) => {
			req.body.id = result
			mongodb.saveTemplate(req.body, (err, result) => {
				if (err) {
					ApiResult(res, err)
				} else if (result && result.id) {
					mongodb.getTemplateById(result.id, (err, result) =>
						ApiResult(res, err, result.length ? result[0] : null)
					)
					// mongodb.getTemplateById(result.id, (err1,result1) => {
					//     if (result1 && result1.length) {
					//         ApiResult(res,null, result1[0])
					//     } else {
					//         ApiResult(res,err1,null)
					//     }
					// } )
				} else {
					ApiResult(res, 'Failed to save Template')
				}
			})
		})
		.catch((err) => ApiResult(res, err))
})
Mongo.delete('/templates/:id', (req, res) => {
	mongodb.deleteTemplate(req.params.id, (err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			ApiResult(res, null, true)
		}
	})
})

Mongo.get('/palettes', (req, res) => {
	mongodb.getPalettes((err, result) => ApiResult(res, err, result))
})
Mongo.get('/palettes/:id', (req, res) => {
	mongodb.getPaletteById(req.params.id, (err, result) => ApiResult(res, err, result.length ? result[0] : null))
})
Mongo.put('/palettes/:id', (req, res) => {
	mongodb.updatePalette(req.params.id, req.body, (err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			mongodb.getPaletteById(req.params.id, (err, result) =>
				ApiResult(res, err, result.length ? result[0] : null)
			)
		}
	})
})
Mongo.post('/palettes', (req, res) => {
	mongodb.savePalette(req.body, (err, result) => ApiResult(res, err, result))
})
Mongo.delete('/palettes/:id', (req, res) => {
	mongodb.deletePalette(req.params.id, (err, result) => {
		if (err) {
			ApiResult(res, err)
		} else {
			ApiResult(res, null, true)
		}
	})
})

module.exports = Mongo
