import mongodb from './mongodb'
import path from 'path'
import fs from 'fs'

const SubscriptionService = {
	getAllLists: () => {
		return new Promise((resolveAll, rejectAll) => {
			Promise.all([
				mongodb.getPublishers(),
				mongodb.getSubscribers(),
				mongodb.getSubscriptionServices(),
				mongodb.getSubscriptions()
			]).then(([r1,r2,r3,r4]) => {
				resolveAll({publishers: r1, subscribers: r2, subscriptionServices: r3, subscriptions: r4})
			}).catch(err => {
				console.log(err);
				rejectAll(err)
			})
		})
	},
	getPublishers: () => {		
		return mongodb.getPublishers()
	},
	getPublisher: (id) => {		
		return mongodb.getPublisher(id)
	},
	savePublisher: (obj) => {		
		return mongodb.savePublisher(obj)
	},
	updatePublisher: (id,obj) => {		
		return mongodb.updatePublisher(id, obj)
	},
	deletePublisher: (id) => {		
		return mongodb.deletePublisher(id)
	},	
	getSubscribers: () => {		
		return mongodb.getSubscribers()
	},
	getSubscriber: (id) => {		
		return mongodb.getSubscriber(id)
	},
	saveSubscriber: (obj) => {		
		return mongodb.saveSubscriber(obj)
	},
	updateSubscriber: (id,obj) => {		
		return mongodb.updateSubscriber(id, obj)
	},
	deleteSubscriber: (id) => {		
		return mongodb.deleteSubscriber(id)
	},

	getSubscriptionServices: () => {
		return mongodb.getSubscriptionServices()
	},
	getSubscriptionService: (id) => {		
		return mongodb.getSubscriptionService(id)
	},
	saveSubscriptionService: (info,doc) => {		
		return new Promise((resolve, reject) => {
			try {
				let obj = JSON.parse(info)
				obj.documents = [{'Definition': doc.name}]
				mongodb.saveSubscriptionService(obj).then(result => {
					let filepath = path.join(__dirname, 'routes/service_docs', result._id + '_Definition_' + doc.name)
					doc.mv(filepath, function(err) {
						if (err) {
							console.log(err)
							reject(err)
						}
						else {
							resolve(true)
						}					
					})
				})
			} catch (err) {
				console.log(err)
				reject(err)
			}
		})
	},
	updateSubscriptionService: (id,info,doc) => {		
		return new Promise((resolve, reject) => {
			try {
				let obj = JSON.parse(info)
				if (obj.documents.length > 0) {
					let deletePath = path.join(__dirname, 'routes/service_docs', id + '_Definition_' + obj.documents[0].Definition)
					fs.unlinkSync(deletePath)
				}
				obj.documents = [{'Definition': doc.name}]
				mongodb.updateSubscriptionService(id,obj).then(result => {
					let filepath = path.join(__dirname, 'routes/service_docs', result._id + '_Definition_' + doc.name)
					doc.mv(filepath, function(err) {
						if (err) {
							console.log(err)
							reject(err)
						}
						else {
							resolve(true)
						}					
					})
				})
			} catch (err) {
				console.log(err)
				reject(err)
			}
		})
	},
	deleteSubscriptionService: (id) => {		
		return mongodb.deleteSubscriptionService(id)
	},

	getSubscriptions: () => {
		return mongodb.getSubscriptions()
	},
	getSubscription: (id) => {		
		return mongodb.getSubscription(id)
	},
	saveSubscription: (obj) => {		
		return mongodb.saveSubscription(obj)
	},
	updateSubscription: (id,obj) => {		
		mongodb.updateSubscription(id,obj)
	},
	deleteSubscription: (id) => {		
		return mongodb.deleteSubscription(id)
	}
}

module.exports = SubscriptionService
