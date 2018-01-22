'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _event = require('../model/event');

var _event2 = _interopRequireDefault(_event);

var _attend = require('../model/attend');

var _attend2 = _interopRequireDefault(_attend);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var config = _ref.config,
	    db = _ref.db;

	var api = (0, _express.Router)();

	// 'v1/event/add'
	api.post('/add', _authMiddleware.authenticate, function (req, res, next) {
		var newEvent = new _event2.default();
		newEvent.name = req.body.name;
		newEvent.description = req.body.description;
		newEvent.category = req.body.category;
		newEvent.location = req.body.location;
		newEvent.starttime = new Date(req.body.starttime);
		newEvent.endtime = new Date(req.body.endtime);
		newEvent.image = req.body.image;
		newEvent.owner = req.user.id;
		newEvent.save(function (err) {
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
	api.get('/', function (req, res) {
		_event2.default.find({}, function (err, events) {
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
	api.get('/:id', function (req, res) {
		_event2.default.findById(req.params.id, function (err, event) {
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
	api.put('/:id', _authMiddleware.authenticate, function (req, res) {
		_event2.default.findById(req.params.id, function (err, event) {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else if (!event) {
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
					event.save(function (err) {
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
	api.delete("/:id", _authMiddleware.authenticate, function (req, res) {
		_event2.default.findById(req.params.id, function (err, event) {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else if (!event) {
				return res.status(404).json({
					success: false,
					error: 'Not Found.'
				});
			} else {
				if (req.user.id == event.owner) {
					event.name = req.body.name;
					event.remove(function (err) {
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
	api.post('/add/:id', _authMiddleware.authenticate, function (req, res) {
		_event2.default.findById(req.params.id, function (err, event) {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else if (!event) {
				return res.status(404).json({
					success: false,
					error: 'Not Found.'
				});
			} else {
				var newAttend = new _attend2.default();

				newAttend.user = req.user.id;
				newAttend.event = event._id;
				newAttend.save(function (err, event) {
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
};
//# sourceMappingURL=event.js.map