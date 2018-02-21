import mongoose from 'mongoose';
import { Router } from 'express';
import Event from '../model/event';
import Host from '../model/host';

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
	let api = Router();
	api.get('/:id', authenticate, (req, res, next) => {
		let host = req.user.id;
		Event.findById(req.params.id, (err, event) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else {
				if(event.owner == host) {
					// host part
					res.status(200).json({
						success: true,
						message: 'Host Authenticated'
					});
					//end host
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

	});

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