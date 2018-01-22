import mongoose from 'mongoose';
import { Router } from 'express';
import Event from '../model/event';
import Attend from '../model/attend';

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
	let api = Router();

	// 'v1/event/add'
	api.post('/add', authenticate, (req, res, next) => {
		let newEvent = new Event();
		newEvent.name = req.body.name;
		newEvent.description = req.body.description;
		newEvent.category = req.body.category;
		newEvent.location = req.body.location;
		newEvent.starttime = new Date(req.body.starttime);
		newEvent.endtime = new Date(req.body.endtime);
		newEvent.image = req.body.image;
		newEvent.owner = req.user.id;
		newEvent.save(err => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else {
				res.status(200).json({
					success: true,
					message: 'Event saved successfully'
				});
			}
		});
	});

	// '/v1/event/' - read
	api.get('/', (req,res) => {
		Event.find({}, (err, events) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else {
				res.status(200).json(events);
			}
		});
	});

	// '/v1/event/:id' - read 1
	api.get('/:id', (req, res) => {
		Event.findById(req.params.id, (err, event) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else {
				res.status(200).json(event);
			}
		});
	});

	// '/v1/event/:id' - update 1
	api.put('/:id', authenticate, (req,res) => {
		Event.findById(req.params.id, (err, event) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else if (!event){
					return res.status(404).json({
						success: false,
						error: 'Not Found.'
					});
			} else {
					if (req.user.id == event.owner) {
					event.name = req.body.name;
					event.description = req.body.description;
					event.category = req.body.category;
					event.location = req.body.location;
					event.starttime = new Date(req.body.starttime);
					event.endtime = new Date(req.body.endtime);
					event.image = req.body.image;
					event.save(err => {
						if (err) {
							res.status(422).json({
								success: false,
								message: err.message
							});
						} else {
							res.status(200).json({
								success: true,
								message: "Event info updated"
							});
						}
					});
				} else {
					return res.status(401).json({
						success: false,
						error: 'Not Authorized.'
					});
				}
			}
		});
	});

	// '/v1/event/:id' - delete
	api.delete("/:id", authenticate, (req, res) => {
		Event.findById(req.params.id, (err, event) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else if (!event){
					return res.status(404).json({
						success: false,
						error: 'Not Found.'
					});
			} else {
					if (req.user.id == event.owner) {
					event.name = req.body.name;
					event.remove(err => {
						if (err) {
							res.status(422).json({
								success: false,
								message: err.message
							});
						} else {
							res.status(200).json({
								success: true,
								message: "Event deleted"
							});
						}
					});
				} else {
					return res.status(401).json({
						success: false,
						error: 'Not Authorized.'
					});
				}
			}
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
						error: 'Not Found.'
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
						message: 'Attendee Saved!'
					});
				});
			}
		});
	});

	return api;
}