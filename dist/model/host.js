'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var hostSchema = new Schema({
	event: {
		type: Schema.Types.ObjectId,
		ref: 'Event',
		required: true
	},
	host: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	starttime: {
		type: Date,
		required: true
	},
	endtime: {
		type: Date
	},
	qr: {
		type: String
	}
}, { timestamps: true });

module.exports = _mongoose2.default.model('Host', hostSchema);
//# sourceMappingURL=host.js.map