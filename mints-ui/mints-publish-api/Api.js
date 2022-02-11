import express from 'express'
import mongodb from './mongodb'
import ApiResult from './ApiResult'
import GitService from './GitService'
import path from 'path'
const fs = require('fs')

const Mongo = express.Router()

Mongo.get('/', (req, res) => {
	ApiResult(res, null, '/publish api test')
})
Mongo.get('/file', (req, res) => {
	//ApiResult(res, null, req.query.file)
	readFileContent(res, req.query.file)
})
Mongo.post('/file', (req, res) => {
	//ApiResult(res, null, { file: req.query.file, info: req.body })
	writeFileContent(res, req.query.file, req.body.info)
})

Mongo.get('/files', (req, res) => {
	getFiles(res)
})
Mongo.get('/filesAndFolders', (req, res) => {
	getFilesAndFolders(req.query.path ? req.query.path : '/', res)
})
Mongo.post('/files', (req, res) => {
	postFile(res, req.body.info, req.files.file)
})
Mongo.post('/deleteFile', (req, res) => {
	deleteFile(res, req.body)
})
Mongo.post('/viewFile', (req, res) => {
	viewFile(res, req.body)
})

Mongo.get('/:version', (req, res) => {
	mongodb.getVersionConfig(req.params.version, (err, info) => {
		if (err) {
			ApiResult(res, err)
		} else {
			if (info) {
				ApiResult(res, null, info)
			} else {
				ApiResult(res, 'Failed to get info for given version')
			}
		}
	})
})

Mongo.put('/:version/:environment/:id', (req, res) => {
	mongodb.updateConfig(
		req.params.id,
		{ version: req.params.version, environment: req.params.environment, configuration: req.body },
		(err, result) => ApiResult(res, err, result)
	)
})
Mongo.post('/:version/:environment', (req, res) => {
	mongodb.saveConfig(
		{ version: req.params.version, environment: req.params.environment, configuration: req.body },
		(err, result) => ApiResult(res, err, result)
	)
})

const makeRoutesDir = (folder) => {
	let dir = path.join(__dirname, folder)
	if (!fs.existsSync(dir)) {
		//fs.removeSync(dir)
		fs.mkdirSync(dir)
	}
	return dir
}


Mongo.post('/publishSync', (req, res) => {
	let { version, environment, id, data } = req.body
	mongodb.getConfig(version, environment, (err, gitInfo) => {
		if (err) {
			ApiResult(res, err)
		} else {
			let gitDir = makeRoutesDir(gitInfo.configuration.routesLocation)
			GitService.prepareRepo(gitInfo.configuration, gitDir)
				.then((gitPromise) => {
					data.forEach((route) => {
						GitService.saveAndProcessFile(gitPromise, path.join(gitDir, route.file), route.data)
							.then((addSuccess) => {
								log(addSuccess)
							})
							.catch((addError) => log(addError))
					})
					GitService.commitAndSyncRepo(gitInfo.configuration, gitPromise, 'Deployed integration: ' + id)
						.then((gitSuccess) => {
							ApiResult(res, null, gitSuccess ? gitSuccess : 'Deployed integration: ' + id)
						})
						.catch((gitError) => ApiResult(res, 'Failed to commit & sync to Git repository'))
				})
				.catch((gitError) => {
					ApiResult(res, 'Failed to connect to Git repository.')
				})
		}
	})
})

// const reWritePermissions = (location) => {
// 	const { exec } = require('child_process')
// 	//let dir = path.join(__dirname, location)
// 	log('kubectl exec camelapp chgrp -hR root ' + location)
// 	exec('kubectl exec camelapp chgrp -hR root ' + location, (error, stdout, stderr) => {
// 		if (error) {
// 			log(`error: ${error.message}`)
// 			return
// 		}
// 		if (stderr) {
// 			log(`stderr: ${stderr}`)
// 			return
// 		}
// 		log(`stdout: ${stdout}`)
// 	})
// }

// const log = (location, message) => {
// 	try {
// 		let file = path.join(location, 'change.log')
// 		let content = ''
// 		if (fs.existsSync(file)) {
// 			content = fs.readFileSync(file)
// 			fs.unlinkSync(file)
// 		}
// 		if (content !== '') {
// 			fs.writeFileSync(file, content)
// 		}
// 		message = '[' + new Date().toUTCString() + '] ' + message + '\n'
// 		fs.appendFileSync(file, message)
// 		log(message)
// 	} catch (error) {
// 		log(error)
// 	}
// }

const log = (message) => {
	//console.log('[' + new Date().toUTCString() + '] ' + message)
	console.log(message)
}

Mongo.post('/publish', (req, res) => {
	let { version, environment, id, data } = req.body
	mongodb.getConfig(version, environment, (err, gitInfo) => {
		if (err) {
			log(err)
			ApiResult(res, err)
		} else {
			let routesDir = makeRoutesDir(gitInfo.configuration.routesLocation)
			data.forEach((route) => {
				fs.writeFileSync(path.join(routesDir, route.file), route.data)
			})
			//reWritePermissions(routesDir)
			//log(routesDir, 'Deployed integration: ' + id)
			log('Deployed integration: ' + id)
			res.send({ Success: true, Message: 'Ok', Result: 'Deployed integration: ' + id })

			// let gitDir = makeRoutesDir(version)
			// GitService.prepareRepo(gitInfo.configuration, gitDir)
			// 	.then((gitPromise) => {
			// 		data.forEach((route) => {
			// 			GitService.saveAndProcessFile(gitPromise, path.join(gitDir, route.file), route.data)
			// 				.then((delSuccess) => {
			// 					if (delSuccess) {
			// 						log(delSuccess)
			// 					}
			// 				})
			// 				.catch((delError) => {
			// 					if (delError) {
			// 						log(delError)
			// 					}
			// 				})
			// 		})
			// 		GitService.commitAndSyncRepo(gitInfo.configuration, gitPromise, 'Deployed integration: ' + id)
			// 			.then((gitSuccess) => {
			// 				log(gitSuccess ? gitSuccess : 'Commit & Sync complete')
			// 				//ApiResult(res, null, gitSuccess ? gitSuccess : 'Deployed integration: ' + id)
			// 			})
			// 			.catch((gitError) => {
			// 				log('Failed to commit & sync to Git repository')
			// 				//ApiResult(res, 'Failed to commit & sync to Git repository')
			// 			})
			// 	})
			// 	.catch((gitError) => {
			// 		log('Failed to connect to Git repository.')
			// 		//ApiResult(res, 'Failed to connect to Git repository.')
			// 	})
		}
	})
})

Mongo.post('/unPublishSync', (req, res) => {
	let { version, environment, id, data } = req.body
	mongodb.getConfig(version, environment, (err, gitInfo) => {
		if (err) {
			ApiResult(res, err)
		} else {
			let gitDir = makeRoutesDir(gitInfo.configuration.routesLocation)
			GitService.prepareRepo(gitInfo.configuration, gitDir)
				.then((gitPromise) => {
					data.forEach((file) => {
						if (fs.existsSync(path.join(gitDir, file))) {
							GitService.removeAndProcessFile(gitPromise, path.join(gitDir, file))
								.then((delSuccess) => {
									log(delSuccess)
								})
								.catch((delError) => log(delError))
						}
					})
					GitService.commitAndSyncRepo(gitInfo.configuration, gitPromise, 'Deleted integration: ' + id)
						.then((gitSuccess) => {
							ApiResult(res, null, gitSuccess ? gitSuccess : 'Deleted integration: ' + id)
						})
						.catch((gitError) => ApiResult(res, 'Failed to commit & sync to Git repository'))
				})
				.catch((gitError) => {
					ApiResult(res, 'Failed to connect to Git repository.')
				})
		}
	})
})

Mongo.post('/unPublish', (req, res) => {
	let { version, environment, id, data } = req.body
	mongodb.getConfig(version, environment, (err, gitInfo) => {
		if (err) {
			log(err)
			ApiResult(res, err)
		} else {
			let routesDir = makeRoutesDir(gitInfo.configuration.routesLocation)
			data.forEach((file) => {
				console.log(file)
				// if (fs.existsSync(path.join(routesDir, file))) {
				fs.writeFileSync(path.join(routesDir, file), '')
				//fs.unlinkSync(path.join(routesDir, file))
				// }
			})
			//reWritePermissions(routesDir)
			//log(routesDir, 'Deleted integration: ' + id)
			log('Deleted integration: ' + id)
			res.send({ Success: true, Message: 'Ok', Result: 'Deleted integration: ' + id })

			let gitDir = makeRoutesDir(version)
			GitService.prepareRepo(gitInfo.configuration, gitDir)
				.then((gitPromise) => {
					data.forEach((file) => {
						if (fs.existsSync(path.join(gitDir, file))) {
							GitService.removeAndProcessFile(gitPromise, path.join(gitDir, file))
								.then((delSuccess) => {
									if (delSuccess) {
										log(delSuccess)
									}
								})
								.catch((delError) => {
									if (delError) {
										log(delError)
									}
								})
						}
					})
					GitService.commitAndSyncRepo(gitInfo.configuration, gitPromise, 'Deleted integration: ' + id)
						.then((gitSuccess) => {
							log(gitSuccess ? gitSuccess : 'Deleted integration: ' + id)
						})
						.catch((gitError) => log('Failed to commit & sync to Git repository'))
				})
				.catch((gitError) => {
					log('Failed to connect to Git repository.')
				})
		}
	})
})

/// file manager
const readFileContent = (res, file) => {
	try {
		let filepath = path.join(__dirname, 'routes', file)
		if (fs.existsSync(filepath)) {
			ApiResult(res, null, fs.readFileSync(filepath, { encoding: 'utf8' }))
		} else {
			ApiResult(res, 'File not available: ' + file)
		}
	} catch (error) {
		ApiResult(res, 'Filed to process your request')
	}
}
const writeFileContent = (res, file, content) => {
	try {
		let filepath = path.join(__dirname, 'routes', file)
		fs.writeFileSync(filepath, content, { encoding: 'utf8' })
		ApiResult(res, null, true)
	} catch (error) {
		ApiResult(res, 'Filed to process your request')
	}
}

const getFiles = (res) => {
	let data = {}
	try {
		mongodb.getMapsPropsConfig('v0', (err, fileData) => {
			if (err) {
				log(err)
				ApiResult(res, err)
			} else {
				if (!fileData) {
					ApiResult(res, 'Filed to get Maps/Properties configuration')
				} else {
					fileData[0].configuration.forEach((d) => {
						//console.log(path.join(__dirname, 'routes', d.path))
						if (fs.existsSync(path.join(__dirname, 'routes', d.path))) {
							let files = fs.readdirSync(path.join(__dirname, 'routes', d.path))
							data[d.name] = { ...d, files: files ? files : [] }
						} else {
							data[d.name] = { ...d, files: ['Invalid path'], update: false }
						}
					})
					ApiResult(res, null, data)
				}
			}
		})
	} catch (error) {
		ApiResult(res, 'Filed to process your request')
	}
}
const getFilesAndFolders = (folder, res) => {
	let info = { error: false, path: folder, files: [], folders: [] }
	let fullPath = path.join(__dirname, 'routes', folder)
	try {
		if (fs.existsSync(fullPath)) {
			let all = fs.readdirSync(fullPath)
			all.forEach((f) => {
				if (fs.statSync(fullPath + '/' + f).isDirectory()) {
					info.folders.push(f)
				} else {
					info.files.push(f)
				}
			})
		} else {
			ApiResult(res, 'Invalid path : ' + folder)
		}
		ApiResult(res, null, info)
	} catch (error) {
		ApiResult(res, 'Filed to process your request')
	}
}
const postFile = (res, _info, file) => {
	let info = JSON.parse(_info)
	//console.log(info)
	//console.log(path.join(__dirname, 'routes', info.path, info.filename))
	//console.log(file.data)
	try {
		fs.writeFileSync(path.join(__dirname, 'routes', info.path, info.filename), file.data)
		ApiResult(res, null, true)
	} catch (error) {
		console.log(error)
		ApiResult(res, error)
	}
}
const deleteFile = (res, info) => {
	try {
		if (fs.existsSync(path.join(__dirname, 'routes', info.path, info.filename))) {
			fs.unlinkSync(path.join(__dirname, 'routes', info.path, info.filename))
		}
		ApiResult(res, null, true)
	} catch (error) {
		console.log(error)
		ApiResult(res, error)
	}
}
const viewFile = (res, info) => {
	try {
		//console.log(info)
		if (fs.existsSync(path.join(__dirname, 'routes', info.path, info.filename))) {
			var content = fs.readFileSync(path.join(__dirname, 'routes', info.path, info.filename), {
				encoding: 'utf8'
			})
			//console.log(content)
			ApiResult(res, null, content)
		} else {
			ApiResult(res, 'File not found')
		}
	} catch (error) {
		console.log(error)
		ApiResult(res, error)
	}
}
Mongo.post('/pgpFiles', (req, res) => {
	let pgpPath = path.join(__dirname + '/routes/PGP_Keys/', req.body.connection)
	try {
		if (!fs.existsSync(pgpPath)) {
			fs.mkdirSync(pgpPath);
		}
		fs.writeFileSync(pgpPath + '/' + req.body.connection + '_public.gpg', req.body.pgp.publicKeyData);
		if (req.body.pgp.privateKey === true) {
			if (fs.existsSync(pgpPath)) {
				fs.writeFileSync(pgpPath + '/' + req.body.connection + '_secret.gpg', req.body.pgp.privateKeyData)
			}
		}
		ApiResult(res, null, "Files Created")
	} catch (e) {
		console.log(e);
	}
})

Mongo.post('/editFile', (req, res) => {
	try {
		let filepath = path.join(__dirname + '/routes' + req.body.path, req.body.filename )
		if(fs.existsSync(filepath)) {
			fs.writeFileSync(filepath, req.body.content, { encoding: 'utf8' })
		}
		ApiResult(res, null, true)
	} catch (error) {
		ApiResult(res, error)
	}
})

Mongo.post('/createFolder', (req, res) => {
	try {
		if (!fs.existsSync(path.join(__dirname + '/routes' + req.body.path, req.body.foldername))) {
			fs.mkdirSync(path.join(__dirname + '/routes' + req.body.path, req.body.foldername))
		}
		ApiResult(res, null, 'Folder Created')
	} catch (error) {
		ApiResult(res, error)
	}
})

Mongo.post('/deleteFolder', (req, res) => {
	try {
		let filepath = path.join(__dirname + '/routes' + req.body.path, req.body.foldername )
		if(fs.existsSync(filepath)) {
			fs.rmdirSync(filepath)
		}
		ApiResult(res, null, true)
	} catch (error) {
		ApiResult(res, 'Please delete files before removing this folder')
	}
})

module.exports = Mongo
