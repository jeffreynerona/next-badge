import mongoose from 'mongoose';
import { Router } from 'express';
import Badge from '../model/badge';
import Issue from '../model/issue';
import User from '../model/user';

import { authenticate } from '../middleware/authMiddleware';

export default({ config, db }) => {
	let api = Router();

	// 'v1/badge/add'
	api.post('/add', authenticate, (req, res, next) => {
		console.log(req.user.id);
		User.findById(req.user.id, (err, user) => {
			if (user.type == "issuer") {
				let newBadge = new Badge();
				newBadge.name = req.body.name;
				newBadge.description = req.body.description;
				newBadge.category = req.body.category;
				newBadge.tags = req.body.tags ? req.body.tags.split(',') : [];
				newBadge.image = req.body.image;
				newBadge.creator = req.user.id;
				newBadge.save(err => {
					if (err) {
						res.status(422).json({
							success: false,
							message: err.message
						});
					} else {
						res.status(200).json({
							success: true,
							message: 'Badge saved successfully'
						});
					}
				});
			}
			else {
				return res.status(401).json({
					success: false,
					error: 'Not Authorized.'
				});
			}
		});
	});

	// '/v1/badge/' - read
	api.get('/', (req,res) => {
		Badge.find({}, (err, badges) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else {
				res.status(200).json(badges);
			}
		});
	});

	// '/v1/badge/:id' - read 1
	api.get('/:id', (req, res) => {
		Badge.findById(req.params.id, (err, badge) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else {
				res.status(200).json(badge);
			}
		});
	});

	// '/v1/badge/:id' - update 1
	api.put('/:id', authenticate, (req,res) => {
		Badge.findById(req.params.id, (err, badge) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else if (!badge){
					return res.status(404).json({
						success: false,
						error: 'Not Found.'
					});
			} else {
					if (req.user.id == badge.creator) {
					badge.name = req.body.name;
					badge.description = req.body.description;
					badge.category = req.body.category;
					badge.tags = req.body.tags.split(',');
					badge.image = req.body.image;
					badge.save(err => {
						if (err) {
							res.status(422).json({
								success: false,
								message: err.message
							});
						} else {
							res.status(200).json({
								success: true,
								message: "Badge info updated"
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

	// '/v1/badge/:id' - delete
	api.delete("/:id", authenticate, (req, res) => {
		Badge.findById(req.params.id, (err, badge) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else if (!badge){
					return res.status(404).json({
						success: false,
						error: 'Not Found.'
					});
			} else {
					if (req.user.id == badge.creator) {
					badge.name = req.body.name;
					badge.remove(err => {
						if (err) {
							res.status(422).json({
								success: false,
								message: err.message
							});
						} else {
							res.status(200).json({
								success: true,
								message: "Badge deleted"
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

	// '/v1/badge/issue/badgeid/userid
	api.post('/issue/:id/:rc', authenticate, (req,res) => {
		Badge.findById(req.params.id, (err, badge) => {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else if (!badge){
					return res.status(404).json({
						success: false,
						error: 'Not Found.'
					});
			} else {
				if(req.user.id == badge.creator) {
					User.findById(req.params.rc, (error, user) => {
						if (error) {
							res.status(422).json({
								success: false,
								message: err.message
							});
						}
						else {
							let newIssue = new Issue();
							newIssue.issuer = req.user.id;
							newIssue.user = user.id;
							newIssue.badge = badge._id;
							if (badge.limit >= 1) {
								newIssue.save((err) => {
									if (err) {
										res.status(422).json({
											success: false,
											message: err.message
										});
									} else {
										badge.limit -= 1;
										badge.save();
										res.status(200).json({
											message: 'Badge Issued!'
										});
									}
								});
							}
							else {
								res.status(200).json({
									success: false,
									message: 'Badge Limit Exceeded!'
								});
							}
						}
					});
				}
				else {
					return res.status(401).json({
						success: false,
						error: 'Not Authorized.'
					});
				}
			}
		});
	});

	return api;
}