import express from 'express'
import Axios from 'axios';
import ApiResult from './ApiResult'

import PublishService from './PublishService'

import config from './config.json'

const router = express.Router();

router.get('/',(req,res) => {
    //res.send(config.services.templates)
    Axios.get(config.services.templates)
    .then(result => {
        if (result.data && result.data.Success) {
            ApiResult(res,null,result.data.Result)
        } else {
            ApiResult(res,result.data.Message)
        }
    })
    .catch(err => {
        ApiResult(res,err)
    })
})
router.get('/img/:id',(req,res,next) => {
    //res.send(config.services.templates)
    try {
        const fs = require('fs')
        const path = require('path')
        var options = {
            root: path.join(__dirname, 'tmplImages'),
            dotfiles: 'deny',
            headers: { 'x-timestamp': Date.now(), 'x-sent': true}
        }
        var fileName = req.params.id + '.jpg'
        if (fs.existsSync(path.join(__dirname,'tmplImages',fileName))) {
            res.sendFile(fileName,options, err => { if (err) { next(err) } })
        } else {
            res.sendFile('tmpl.jpg',options, err => { if (err) { next(err) } })
        }

    } catch (error) {
        console.log(error)
        ApiResult(res,error)
    }
})
router.get('/:id',(req,res) => {
    Axios.get(config.services.templates + '/' + req.params.id)
    .then(result => {
        if (result.data && result.data.Success) {
            ApiResult(res,null,result.data.Result)
        } else {
            ApiResult(res,result.data.Message)
        }
    })
    .catch(err => {
        ApiResult(res,err)
    })
})
router.put('/:id',(req,res) => {
    Axios.put(config.services.templates + '/' + req.params.id, req.body,  {headers: {"Content-Type": "application/json"}})
    .then(result => {
        if (result.data && result.data.Success) {
            ApiResult(res,null,result.data.Result)
        } else {
            ApiResult(res,result.data.Message)
        }
    })
    .catch(err => {
        ApiResult(res,err)
    })
})
router.post('/upload', (req, res) => {
    //console.log(req.body.id)
    let info = { filename : req.body.id + '.feature', path : './testTemplates' }
    Promise.all([
        PublishService.postFile(JSON.stringify({ filename: req.body.id + '.feature', path: './testTemplates' }), req.files.feature.data),
        PublishService.postFile(JSON.stringify({ filename: req.body.id + '.steps.xml', path: './testTemplates' }), req.files.steps.data),
        PublishService.postFile(JSON.stringify({ filename: req.body.id + '.template.xml', path: './testTemplates' }), req.files.template.data)
        ])
        .then((result) => {
            ApiResult(res, null, true)
        })
        .catch((error) => {
            console.log(error)
            ApiResult(res, error)
        })
})
router.post('/',(req,res) => {
    Axios.post(config.services.templates, req.body,  {headers: {"Content-Type": "application/json"}})
    .then(result => {
        if (result.data && result.data.Success) {
            ApiResult(res,null,result.data.Result)
        } else {
            ApiResult(res,result.data.Message)
        }
    })
    .catch(err => {
        ApiResult(res,err)
    })
})
router.delete('/:id',(req,res) => {
    Axios.delete(config.services.templates + '/' + req.params.id, null,  {headers: {"Content-Type": "application/json"}})
    .then(result => {
        if (result.data && result.data.Success) {
            ApiResult(res,null,result.data.Result)
        } else {
            ApiResult(res,result.data.Message)
        }
    })
    .catch(err => {
        ApiResult(res,err)
    })
})

module.exports = router