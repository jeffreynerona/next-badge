'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _badge = require('../model/badge');

var _badge2 = _interopRequireDefault(_badge);

var _issue = require('../model/issue');

var _issue2 = _interopRequireDefault(_issue);

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var config = _ref.config,
	    db = _ref.db;

	var api = (0, _express.Router)();

	// 'v1/badge/add'
	api.post('/add', _authMiddleware.authenticate, function (req, res, next) {
		console.log(req.user.id);
		_user2.default.findById(req.user.id, function (err, user) {
			if (user.type == "issuer") {
				var newBadge = new _badge2.default();
				newBadge.name = req.body.name;
				newBadge.description = req.body.description;
				newBadge.category = req.body.category;
				newBadge.tags = req.body.tags ? req.body.tags.split(',') : [];
				newBadge.image = req.body.image;
				newBadge.creator = req.user.id;
				newBadge.save(function (err) {
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
			} else {
				return res.status(401).json({
					success: false,
					error: 'Not Authorized.'
				});
			}
		});
	});

	// '/v1/badge/' - read
	api.get('/', function (req, res) {
		_badge2.default.find({}, function (err, badges) {
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
	api.get('/:id', function (req, res) {
		_badge2.default.findById(req.params.id, function (err, badge) {
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
	api.put('/:id', _authMiddleware.authenticate, function (req, res) {
		_badge2.default.findById(req.params.id, function (err, badge) {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else if (!badge) {
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
					badge.save(function (err) {
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
	api.delete("/:id", _authMiddleware.authenticate, function (req, res) {
		_badge2.default.findById(req.params.id, function (err, badge) {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else if (!badge) {
				return res.status(404).json({
					success: false,
					error: 'Not Found.'
				});
			} else {
				if (req.user.id == badge.creator) {
					badge.name = req.body.name;
					badge.remove(function (err) {
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
	api.post('/issue/:id/:rc', _authMiddleware.authenticate, function (req, res) {
		_badge2.default.findById(req.params.id, function (err, badge) {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else if (!badge) {
				return res.status(404).json({
					success: false,
					error: 'Not Found.'
				});
			} else {
				if (req.user.id == badge.creator) {
					_user2.default.findById(req.params.rc, function (error, user) {
						if (error) {
							res.status(422).json({
								success: false,
								message: err.message
							});
						} else {
							var newIssue = new _issue2.default();
							newIssue.issuer = req.user.id;
							newIssue.user = user.id;
							newIssue.badge = badge._id;
							if (badge.limit >= 1) {
								newIssue.save(function (err) {
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
							} else {
								res.status(200).json({
									success: false,
									message: 'Badge Limit Exceeded!'
								});
							}
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

	return api;
};
//# sourceMappingURL=badge.js.map