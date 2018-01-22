'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var config = _ref.config,
	    db = _ref.db;

	var api = (0, _express.Router)();

	// '/v1/user/register'
	api.post('/register', _passport2.default.authenticate('local-register', {
		session: false,
		scope: []
	}), function (err, req, res, next) {
		console.log('it goes here');
		if (err) {
			console.log(err + "haha");
			return res.status(200).json({
				success: false,
				message: err
			});
		}
		next();
	}, function (req, res) {
		res.status(200).json({
			success: true,
			message: "User has been created"
		});
	});

	// '/v1/user/login'
	api.post('/login', _passport2.default.authenticate('local-login', {
		session: false,
		scope: []
	}), function (err, req, res, next) {
		if (err) {
			return res.status(200).json({ success: false, message: err });
		}
		next();
	}, _authMiddleware.generateAccessToken, _authMiddleware.respond);

	// 'v1/user/logout'
	api.get('/logout', _authMiddleware.authenticate, function (req, res) {
		res.logout();
		res.status(200).send('Successfully logged out');
	});
	api.get('/error', function (req, res) {
		res.status(200).json({
			success: false,
			message: "There was an error"
		});
	});

	api.get('/me', _authMiddleware.authenticate, function (req, res) {
		console.log("authenticated");
		res.status(200).json({
			success: true,
			message: "Authenticated"
		});
	});

	return api;
};
//# sourceMappingURL=user.js.map