import mongoose from 'mongoose';
import { Router } from 'express';
import Event from '../model/event';
import Host from '../model/host';
import md5 from 'md5';

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
	let api = Router();


	// for testing 'v1/host/test/:id'
	api.get('/test/:id', authenticate, (req, res, next) => {
		let host = req.user.id;
		// newEvent.name = req.body.name;
		// newEvent.description = req.body.description;
		// newEvent.category = req.body.category;
		// newEvent.location = req.body.location;
		// newEvent.starttime = new Date(req.body.starttime);
		// newEvent.endtime = new Date(req.body.endtime);
		// newEvent.image = req.body.image;
		// newEvent.owner = req.user.id;
		Event.findById(req.params.id, (err, event) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else {
				if(event.owner == host) {
					Host.find({
						"event" : req.params.id,
						"endtime" : { $exists: false }
					}, (err, hosts) => {
						if (err) {
							res.status(200).json({
								success: false,
								message: 'nothing found',
							});
						} else {
							console.log('search host success');
							if(hosts.length>=1) {
								//found an active host
								//generate qr shit and connect the sockiets(happens in client)
								var toupdate = hosts[hosts.length-1];
								var qrupdated = Date.now().toString();
								var qr = md5(event.id.toString() + qrupdated);
								qr = qr.substr(qr.length - 5);
								toupdate.save(err => {
									if (err) {
										res.status(422).json({
											success: false,
											message: err.message
										});
									} else {
										res.status(200).json({
											success: true,
											message: 'Regenerated QR',
											qr: qr
										});
									}
								});
								// res.status(200).json({
								// 	success: true,
								// 	hosts: hosts[hosts.length-1]
								// 	});
							}
							else {
								//no active host, create one
								var now = new Date();
								var end = now;
								var qrupdated = Date.now().toString();
								var qr = md5(event.id.toString() + qrupdated);
								qr = qr.substr(qr.length - 5);
								// end.setHours(end.getHours() + 12);
								let newHost = new Host();
								newHost.event = event.id;
								newHost.host = event.owner;
								newHost.starttime = now.toISOString();
								newHost.qr = qr;
								newHost.save(err => {
									if (err) {
										res.status(422).json({
											success: false,
											message: err.message
										});
									} else {
										res.status(200).json({
											success: true,
											message: 'Hosting',
											qr: newHost.qr
										});
									}
								});
							}
						}
					});
				}
				else {
					return res.status(401).json({
						success: false,
						message: 'Not Authorized.'
					});
				}
			}
		});
	});

	// list of hosts - for testing /v1/host
	api.get('/', (req,res) => {
		Host.find({}, (err, hosts) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else {
				res.status(200).json(hosts);
			}
		});
	});

	// 'v1/host/id'
	api.get('/:id', authenticate, (req, res, next) => {
		let host = req.user.id;
		// newEvent.name = req.body.name;
		// newEvent.description = req.body.description;
		// newEvent.category = req.body.category;
		// newEvent.location = req.body.location;
		// newEvent.starttime = new Date(req.body.starttime);
		// newEvent.endtime = new Date(req.body.endtime);
		// newEvent.image = req.body.image;
		// newEvent.owner = req.user.id;
		Event.findById(req.params.id, (err, event) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else {
				if(event.owner == host) {

					// 1. host.find(eventid) where end is not set
					// 2. if found, generate na ng qr and socket connect
					// 3. else, new host session., then back to step 2
					// may button pala sa host page na pwede i stop yung host, mag lagay lang ng end time.

					var now = new Date();
					var end = now;
					var qr = md5(event.id.toString() + Date.now().toString());
					qr = qr.substr(qr.length - 5);
					// end.setHours(end.getHours() + 12);
					let newHost = new Host();
					newHost.event = event.id;
					newHost.host = event.owner;
					newHost.starttime = now.toISOString();
					newHost.qr = qr;
					newHost.save(err => {
						if (err) {
							res.status(422).json({
								success: false,
								message: err.message
							});
						} else {
							res.status(200).json({
								success: true,
								message: 'Hosting',
								qr: newHost.qr
							});
						}
					});
				}
				else {
					return res.status(401).json({
						success: false,
						message: 'Not Authorized.'
					});
				}
			}
		});
	});

	// // '/v1/event/' - read
	// api.get('/', (req,res) => {
	// 	Event.find({}, (err, events) => {
	// 		if (err) {
	// 			res.status(422).json({
	// 				success: false,
	// 				message: err.message
	// 			});
	// 		} else {
	// 			res.status(200).json(events);
	// 		}
	// 	});
	// });

	// '/v1/event/add/:id attend
	api.post('/add/:id', authenticate, (req,res) => {
		Event.findById(req.params.id, (err, event) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else if (!event){
					return res.status(404).json({
						success: false,
						message: 'Not Found.'
					});
			} else {
				let newAttend = new Attend();
				newAttend.user = req.user.id;
				newAttend.event = event._id;
				newAttend.save((err, event) => {
					if (err) {
						res.status(422).json({
							success: false,
							message: err.message
						});
					}
					res.status(200).json({
						success: true,
						message: 'Attendee Saved!'
					});
				});
			}
		});
	});

	return api;
}