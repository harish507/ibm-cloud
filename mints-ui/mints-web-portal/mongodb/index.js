import mongoose from 'mongoose'
import { options } from '../config.json'
import Master from './Master'
import Record from './Record'
import Organization from './Organization'
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer'
import crypto from 'crypto'

const models = { masters: Master }

const connect = function (cb) {
	if (!mongoose.connection || mongoose.connection.readyState === 0)
		mongoose.connect(
			options.DBConnection,
			{ useNewUrlParser: true, retryWrites: true, w: 'majority' },
			//{ useUnifiedTopology: true, useNewUrlParser: true },
			(err) => cb(err)
		)
	else cb(null)
}
const sendEmail = function (value, secret){
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		  user: 'abc@gmail.com',
		  pass: 'abc@123'
		}
	  });
	  
	  var mailOptions = {
		from: 'xyz@gmail.com',
		to: value.email,
		subject: 'Web Portal Service',
		text: value.password
		
	  };
	  
	  transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		  console.log(error);
		} else {
		  console.log('Email sent: ' + info.response);
		}
	  });
}

const MongoService = {
	// DB COLLECTION ACTIONS
	get: (name, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				if (models[name]) {
					models[name].find().exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
				} else {
					cb('Invalid collection name')
				}
			}
		})
	},
	post: (name, data, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				if (models[name]) {
					models[name].insertMany(data).then((result) => cb(null, result)).catch((error) => cb(error))
				} else {
					cb('Invalid collection name')
				}
			}
		})
	},
	delete: (name, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				if (models[name]) {
					models[name].deleteMany({}).then((result) => cb(null, result)).catch((error) => cb(error))
				} else {
					cb('Invalid collection name')
				}
			}
		})
	},

	//  MASTERS
	getMasters: (cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Master.find().exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	getMaster: (key, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Master.find({ type: key })
					.exec()
					.then((docs) => {
						if (docs && docs.length > 0) {
							cb(null, docs[0].list)
						} else {
							cb({ message: 'Master data not available for key ' + key })
						}
					})
					.catch((error) => cb(error))
			}
		})
	},
	updateMaster: (_id, updObj, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Master.updateOne({ _id }, { $set: updObj }).then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	},

	getAllRecords: (cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Record.find().exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	getRecords: (obj, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Record.find({ ...obj }).exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	getRecord: (key, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Record.find({ _id: key })
					.exec()
					.then((docs) => {
						if (docs && docs.length > 0) {
							cb(null, docs[0].list)
						} else {
							cb({ message: 'Master data not available for key ' + key })
						}
					})
					.catch((error) => cb(error))
			}
		})
	},
	saveRecord: (req, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				const record = new Record({
					_id: new mongoose.Types.ObjectId(),
					cluster: req.cluster,
					pattern: req.pattern,
					messageSize: req.messageSize,
					loadSize: req.loadSize,
					podSize: req.podSize,
					consumer: req.consumer,
					transmittedBw: req.transmittedBw,
					networkBw: req.networkBw,
					cpu: req.cpu,
					memory: req.memory,
					duration: req.duration,
					tps: req.tps
				})
				record
					.save()
					.then((result) => {
						cb(null, result)
					})
					.catch((err) => cb(err))
			}
		})
	},
	updateRecord: (_id, updObj, cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Record.updateOne({ _id }, { $set: updObj }).then((result) => cb(null, result)).catch((err) => cb(err))
			}
		})
	},
	getOrgDetails:(cb) => {
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				Organization.find().exec().then((docs) => cb(null, docs)).catch((error) => cb(error))
			}
		})
	},
	register:(req, cb)=>{
		function randomValueHex (len) {
			return crypto.randomBytes(Math.ceil(len/2))
				.toString('hex')
				.slice(0,len).toUpperCase();
		}
		var secret = randomValueHex(4)+"-"+randomValueHex(4)+"-"+randomValueHex(4);
		console.log(secret);
		connect((err) => {
			if (err) {
				cb(err)
			} else {
				const salt = bcrypt.genSaltSync(10);
				const hash = bcrypt.hashSync("B4c0/\/", salt);
				const organization = new Organization({
					_id: new mongoose.Types.ObjectId(),
					organization : req.organization,
    				name: req.name,
    				email: req.email,
    				password: bcrypt.hashSync(req.password === ""?secret:"", hash),
    				phone: req.phone,
    				active: req.active,
    				orgID: req.orgID,
    				role: req.role,
    				subscriptions: req.subscriptions? req.subscriptions: []
				})
				organization
					.save()
					.then((result) => {
						//sendEmail(result, secret)
						cb(null, result)
					})
					.catch((err) => cb(err))
			}
		})
	}
	
}

module.exports = MongoService
