import express from 'express'
import Axios from 'axios'
import ApiResult from './ApiResult'

import config from './config.json'

const router = express.Router()

router.get('/', (req, res) => {
	//res.send(config.services.palettes)
	Axios.get(config.services.palettes)
		.then((result) => {
			if (result.data && result.data.Success) {
				let groups = {}
				result.data.Result.forEach((p) => {
					if (groups[p.group]) {
						groups[p.group].push(p)
					} else {
						groups[p.group] = [ p ]
					}
				})
				ApiResult(res, null, groups)
			} else {
				ApiResult(res, result.data.Message)
			}
		})
		.catch((err) => {
			ApiResult(res, err)
		})
})
router.get('/all', (req, res) => {
	//res.send(config.services.palettes)
	Axios.get(config.services.palettes)
		.then((result) => {
			if (result.data && result.data.Success) {
				//let groups = {}
				// result.data.Result.forEach(p => {
				//     if (groups[p.group]) {
				//         groups[p.group].push(p)
				//     } else {
				//         groups[p.group] = [p]
				//     }
				// });
				ApiResult(res, null, result.data.Result)
			} else {
				ApiResult(res, result.data.Message)
			}
		})
		.catch((err) => {
			ApiResult(res, err)
		})
})

router.put('/:id', (req, res) => {
	Axios.put(config.services.palettes + '/' + req.params.id, req.body, {
		headers: { 'Content-Type': 'application/json' }
	})
		.then((result) => {
			if (result.data && result.data.Success) {
				ApiResult(res, null, result.data.Result)
			} else {
				ApiResult(res, result.data.Message)
			}
		})
		.catch((err) => {
			ApiResult(res, err)
		})
})
router.post('/', (req, res) => {
	Axios.post(config.services.palettes, req.body, { headers: { 'Content-Type': 'application/json' } })
		.then((result) => {
			if (result.data && result.data.Success) {
				ApiResult(res, null, result.data.Result)
			} else {
				ApiResult(res, result.data.Message)
			}
		})
		.catch((err) => {
			ApiResult(res, err)
		})
})
router.delete('/:id', (req, res) => {
	Axios.delete(config.services.palettes + '/' + req.params.id, null, {
		headers: { 'Content-Type': 'application/json' }
	})
		.then((result) => {
			if (result.data && result.data.Success) {
				ApiResult(res, null, result.data.Result)
			} else {
				ApiResult(res, result.data.Message)
			}
		})
		.catch((err) => {
			ApiResult(res, err)
		})
})

module.exports = router
