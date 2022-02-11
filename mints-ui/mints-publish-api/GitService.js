// Simple-git without promise
const fs = require('fs')
const path = require('path')

const log = (message) => {
	//console.log('[' + new Date().toUTCString() + '] ' + message)
	console.log(message)
}

const GitService = {
	saveAndProcessFile: (gitPromise, file, content) => {
		return new Promise((resolve, reject) => {
			try {
				fs.writeFileSync(file, content)
			} catch (error) {
				log(error)
				reject(error)
			}
			gitPromise.add(file).then(
				(addSuccess) => {
					log('File added successfully')
					resolve(addSuccess)
				},
				(failedAdd) => {
					reject(failedAdd)
				}
			)
		})
	},
	removeAndProcessFile: (gitPromise, file) => {
		return new Promise((resolve, reject) => {
			try {
				fs.unlinkSync(file)
			} catch (error) {
				log(error)
				reject(error)
			}
			gitPromise.rm(file).then(
				(success) => {
					log('File deleted successfully')
					resolve(success)
				},
				(failed) => {
					reject(failed)
				}
			)
		})
	},
	commitAndSyncRepo: (config, gitPromise, comment) => {
		return new Promise((resolve, reject) => {
			const simpleGit = require('simple-git')(config.routesLocation)

			// if (config.host.includes('github.org')) {
			simpleGit.addConfig('user.email', config.email)
			simpleGit.addConfig('user.name', config.name)
			// }
			gitPromise.commit(comment).then(
				(successCommit) => {
					gitPromise.push('origin', 'master').then(
						(success) => {
							log('Git commit completed')
							resolve(success)
						},
						(failed) => {
							reject(failed)
						}
					)
				},
				(failed) => {
					reject(failed)
				}
			)
		})
	},
	prepareRepo: (config, gitDir) => {
		return new Promise((resolve, reject) => {
			const simpleGit = require('simple-git')(gitDir)
			const simpleGitPromise = require('simple-git/promise')(gitDir)

			// const localPath = '\\\\172.17.3.73\\routes\\local'
			// const repo = 'camel-routes.git'
			// const username = 'csnmiraclesoft'
			// const password = 'Miracle1*3'

			// Set up GitHub url like this so no manual entry of user pass needed
			const gitHubUrl = `https://${config.username}:${config.password}@${config.host}/${config.group}/${config.repo}`
			// add local git config like username and email
			// if (config.host.includes('github.org')) {
			simpleGit.addConfig('user.email', config.email)
			simpleGit.addConfig('user.name', config.name)
			// }

			//const file = path.join(localPath , "text.txt")

			//Add remote repo url as origin to repo
			//simpleGitPromise.remote('origin',gitHubUrl);
			if (!fs.existsSync(path.join(gitDir, '.git'))) {
				simpleGitPromise
					.clone(gitHubUrl, gitDir)
					.then((success) => {
						log('Git clone complete')
						resolve(simpleGitPromise)
					})
					.catch((error) => {
						log(error)
						reject(error)
					})
			} else {
				simpleGitPromise
					.pull(gitHubUrl)
					.then((success) => {
						log('Git pull complete')
						resolve(simpleGitPromise)
					})
					.catch((error) => {
						log(error)
						reject(error)
					})
			}
		})
	}
}

// // Add remote repo url as origin to repo
// //simpleGitPromise.addRemote('origin',gitHubUrl);

// // Add all files for commit
// simpleGitPromise.add('./local')
//     .then(
//     (addSuccess) => {
//         log(addSuccess);
//     }, (failedAdd) => {
//         log('adding files failed');
//     });
// // Commit files as Initial Commit
// simpleGitPromise.commit('commit by simple-git')
// .then(
//     (successCommit) => {
//         log(successCommit);
//     }, (failed) => {
//         log('failed commit');
// });
// // Finally push to online repository
// simpleGitPromise.push('origin','master')
//     .then((success) => {
//     log('repo successfully pushed');
//     },(failed)=> {
//     log('repo push failed');
// });

export default GitService
