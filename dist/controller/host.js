'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _event = require('../model/event');

var _event2 = _interopRequireDefault(_event);

var _host = require('../model/host');

var _host2 = _interopRequireDefault(_host);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var config = _ref.config,
	    db = _ref.db;

	var api = (0, _express.Router)();

	// for testing 'v1/host/test/:id'
	api.get('/test/:id', _authMiddleware.authenticate, function (req, res, next) {
		var host = req.user.id;
		// newEvent.name = req.body.name;
		// newEvent.description = req.body.description;
		// newEvent.category = req.body.category;
		// newEvent.location = req.body.location;
		// newEvent.starttime = new Date(req.body.starttime);
		// newEvent.endtime = new Date(req.body.endtime);
		// newEvent.image = req.body.image;
		// newEvent.owner = req.user.id;
		_event2.default.findById(req.params.id, function (err, event) {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else {
				if (event.owner == host) {
					// host part
					_host2.default.find({
						"event": req.params.id,
						"endtime": { $exists: false }
					}, function (err, hosts) {
						if (err) {
							res.status(200).json({
								success: false,
								message: 'nothing found'
							});
						} else {
							console.log('search host success');
							if (hosts.length >= 1) {
								//found an active host
								//generate qr shit and connect the sockiets(happens in client)
								var toupdate = hosts[hosts.length - 1];
								var qrupdated = Date.now().toString();
								var qr = (0, _md2.default)(event.id.toString() + qrupdated);
								qr = qr.substr(qr.length - 5);
								toupdate.save(function (err) {
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
							} else {
								//no active host, create one
								var now = new Date();
								var end = now;
								var qrupdated = Date.now().toString();
								var qr = (0, _md2.default)(event.id.toString() + qrupdated);
								qr = qr.substr(qr.length - 5);
								// end.setHours(end.getHours() + 12);
								var newHost = new _host2.default();
								newHost.event = event.id;
								newHost.host = event.owner;
								newHost.starttime = now.toISOString();
								newHost.qr = qr;
								newHost.save(function (err) {
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

					//end host
				} else {
					return res.status(401).json({
						success: false,
						message: 'Not Authorized.'
					});
				}
			}
		});
	});

	// list of hosts - for testing /v1/host
	api.get('/', function (req, res) {
		_host2.default.find({}, function (err, hosts) {
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
	api.get('/:id', _authMiddleware.authenticate, function (req, res, next) {
		var host = req.user.id;
		// newEvent.name = req.body.name;
		// newEvent.description = req.body.description;
		// newEvent.category = req.body.category;
		// newEvent.location = req.body.location;
		// newEvent.starttime = new Date(req.body.starttime);
		// newEvent.endtime = new Date(req.body.endtime);
		// newEvent.image = req.body.image;
		// newEvent.owner = req.user.id;
		_event2.default.findById(req.params.id, function (err, event) {
			if (err) {
				res.status(422).json({
					success: false,
					message: err.message
				});
			} else {
				if (event.owner == host) {

					// 1. host.find(eventid) where end is not set
					// 2. if found, generate na ng qr and socket connect
					// 3. else, new host session., then back to step 2
					// may button pala sa host page na pwede i stop yung host, mag lagay lang ng end time.

					var now = new Date();
					var end = now;
					var qr = (0, _md2.default)(event.id.toString() + Date.now().toString());
					qr = qr.substr(qr.length - 5);
					// end.setHours(end.getHours() + 12);
					var newHost = new _host2.default();
					newHost.event = event.id;
					newHost.host = event.owner;
					newHost.starttime = now.toISOString();
					newHost.qr = qr;
					newHost.save(function (err) {
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
				} else {
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
					message: 'Not Found.'
				});
			} else {
				var newAttend = new Attend();
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
						success: true,
						message: 'Attendee Saved!'
					});
				});
			}
		});
	});

	return api;
};
//# sourceMappingURL=host.js.map