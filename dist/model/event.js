'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _attend = require('./attend');

var _attend2 = _interopRequireDefault(_attend);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var eventSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},
	starttime: {
		type: Date,
		required: true
	},
	endtime: {
		type: Date,
		required: true
	},
	image: {
		type: String
	},
	qr: {
		type: String
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
}, { timestamps: true });

module.exports = _mongoose2.default.model('Event', eventSchema);
//# sourceMappingURL=event.js.map